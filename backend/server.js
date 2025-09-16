const express = require('express');
const cheerio = require('cheerio');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

const app = express();
const PORT = 3001;

ffmpeg.setFfmpegPath(ffmpegPath);
app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

const waitForFileAccess = async (filePath, timeout = 15000, interval = 100) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        try {
            await fs.promises.access(filePath, fs.constants.F_OK);
            return true;
        } catch {
            await new Promise(res => setTimeout(res, interval));
        }
    }
    throw new Error('File not accessible within timeout');
};

const labelToFileName = str =>
    str
        .replace(/[^a-zA-Z0-9]/g, '_')     // Replace all non-alphanumeric characters with _
        .replace(/_+/g, '_')               // Collapse multiple underscores
        .replace(/^_+|_+$/g, '');          // Trim leading/trailing underscores

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


app.post('/segLinksToMp4', async (req, res) => {
    const { segLinks, label, entryId } = req.body;
    if (!segLinks) return res.status(400).send('Missing segLinks');
    if (!label) return res.status(400).send('Missing label');
    if (!entryId) return res.status(400).send('Missing entryId');
    const tempDir = path.join(__dirname, 'temp' + entryId);
    const outputFile = path.join(tempDir, 'output.mp4');
    const publicDir = path.join(__dirname, 'public');
    const fileName = labelToFileName(label)
    const publicFile = path.join(publicDir, `${fileName}_${entryId}.mp4`);

    try {
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
        if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

        const tsFiles = [];

        for (let i = 0; i < segLinks.length; i++) {
            const url = segLinks[i];
            const filePath = path.join(tempDir, `seg${i}.ts`);

            try {
                const response = await axios.get(url, {
                    responseType: 'stream',
                    timeout: 10000,
                });

                const writer = fs.createWriteStream(filePath);
                response.data.pipe(writer);
                await new Promise((resolve, reject) => {
                    writer.on('finish', resolve);
                    writer.on('error', reject);
                });

                tsFiles.push(filePath);
            } catch (err) {
                console.warn(`Failed to download segment ${i}: ${url}`);
            }
        }

        if (tsFiles.length === 0) {
            return res.status(400).send('No valid segments downloaded');
        }

        // Create concat.txt file
        const concatList = tsFiles.map(file => `file '${file}'`).join('\n');
        const listPath = path.join(tempDir, 'concat.txt');
        fs.writeFileSync(listPath, concatList);

        // Run FFmpeg using concat demuxer
        ffmpeg()
            .input(listPath)
            .inputOptions(['-f', 'concat', '-safe', '0'])
            .outputOptions(['-c', 'copy'])
            .on('end', async () => {
                try {
                    await waitForFileAccess(outputFile);
                    await fs.promises.copyFile(outputFile, publicFile);
                    const fileUrl = `/public/${label}${entryId}.mp4`;
                    res.status(200).json({ url: fileUrl });
                } catch (err) {
                    console.error('Output file not ready:', err);
                    res.status(500).send('FFmpeg finished but output file was not found');
                }

                res.on('close', () => {
                    fs.rm(tempDir, { recursive: true, force: true }, err => {
                        if (err) console.error('Cleanup failed:', err);
                        else console.log('Temp directory cleaned up');
                    });
                });
            })
            .on('error', err => {
                console.error('FFmpeg error:', err);
                res.status(500).send('Conversion failed');
            })
            .save(outputFile);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).send('Internal server error');
    }
});

app.get('/scrapeNumber', async (req, res) => {
    const { url, cookie } = req.query;
    if (!url) return res.status(400).send('Missing URL');
    if (!cookie) return res.status(400).send('Missing cookie');

    try {
        const headers = {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'accept-language': 'en-US,en;q=0.9',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/139 Safari/537.36',
            'upgrade-insecure-requests': '1',
            'x-proctorio': '1.5.25178.21',
            'cookie': cookie
        };

        const response = await fetch(url, { method: 'GET', headers });
        const html = await response.text();

        // Extract number from data-original-title="17 Media"
        const match = html.match(/data-original-title="(\d+)\s+Media"/);
        const mediaCount = match ? parseInt(match[1], 10) : null;

        if (mediaCount === null) {
            return res.status(404).send('Media count not found');
        }

        res.json({ mediaCount });
    } catch (err) {
        console.error(err);
        res.status(500).send('Scraping failed');
    }
});

app.get('/scrapeLinks', async (req, res) => {
    const { url } = req.query;
    const { cookie } = req.query;
    if (!url) return res.status(400).send('Missing URL');
    if (!cookie) return res.status(400).send('Missing cookie');

    try {
        console.log(cookie)
        console.log(url)
        const headers = {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'accept-language': 'en-US,en;q=0.9',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/139 Safari/537.36',
            'upgrade-insecure-requests': '1',
            'x-proctorio': '1.5.25178.21',
            'cookie': cookie
        };
        const response = await fetch(url, { method: 'GET', headers });
        const html = await response.text();
        const $ = cheerio.load(html);

        const videoLinks = [];
        $('div.photo-group.thumb_wrapper').each((_, el) => {
            const label = $(el).attr('title')?.trim();
            const href = $(el).find('a.item_link').attr('href')?.trim();
            const entryId = href.split('/')[3];
            if (label && entryId) {
                videoLinks.push({ label, entryId });
            }
        });

        if (videoLinks.length === 0) {
            console.log("no video links")
            return res.status(404).send(html);
        }

        const match = html.match(/&partnerId=(\d+)&ks=([^&]+)&/);
        const partnerId = match ? match[1] : null;
        const ks = match ? match[2] : null;

        if (partnerId == null) {
            console.log("partnerId null")
            console.log(match)
            return res.status(406).send(html);
        }

        if (ks == null) {
            console.log("ks null")
            console.log(match)
            return res.status(406).send(html);
        }

        res.json({ links: videoLinks, partnerId: partnerId, ks: ks });
    } catch (err) {
        console.error(err);
        res.status(500).send('Scraping failed');
    }
});

app.get('/scrapeGenericM3u8', async (req, res) => {
    const { url } = req.query;
    const { cookie } = req.query;
    if (!url) return res.status(400).send('Missing URL');
    if (!cookie) return res.status(400).send('Missing cookie');

    try {
        console.log(cookie)
        console.log(url)
        const headers = {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9",
            "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "iframe",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-storage-access": "active",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "x-proctorio": "1.5.25178.21"
        };
        const response = await fetch(url, { method: 'GET', headers });
        const html = await response.text();

        const m3u8Links = [...html.matchAll(/http:\/\/[^\s]+\.m3u8/g)].map(match => match[0]);

        if (m3u8Links.length === 0) {
            return res.status(404).send(html);
        }

        res.json({ link: m3u8Links[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Scraping failed');
    }
});

app.get('/scrapeFlavoredM3u8', async (req, res) => {
    const { url } = req.query;
    const { cookie } = req.query;
    if (!url) return res.status(400).send('Missing URL');
    if (!cookie) return res.status(400).send('Missing cookie');

    try {
        console.log(cookie)
        console.log(url)
        const headers = {
            'upgrade-insecure-requests': '1'
        };
        const response = await fetch(url, { method: 'GET', headers });
        const html = await response.text();

        const m3u8Links = [...html.matchAll(/https?:\/\/[^\s]+\.ts/g)].map(match => match[0]);

        if (m3u8Links.length === 0) {
            return res.status(404).send(html);
        }

        res.json({ links: m3u8Links });
    } catch (err) {
        console.error(err);
        res.status(500).send('Scraping failed');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


