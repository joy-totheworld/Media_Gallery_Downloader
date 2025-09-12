const express = require('express');
const cheerio = require('cheerio');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors()); // Allow requests from React
app.use(express.json());

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

            if (label && href) {
                videoLinks.push({ label, href });
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


