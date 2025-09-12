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

        // Extract hrefs from <a class="item_link">
        const itemLinks = $('a.item_link')
            .map((_, el) => $(el).attr('href'))
            .get()
            .filter(Boolean); // remove null/undefined

        if (itemLinks.length === 0) {
            return res.status(404).send(html);
        }

        res.json({ links: itemLinks });
    } catch (err) {
        console.error(err);
        res.status(500).send('Scraping failed');
    }
});

app.get('/scrapeM3u8', async (req, res) => {
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

        // Look for embedded player config or script tags
        const scripts = $('script').map((_, el) => $(el).html()).get();
        const m3u8Links = [];

        scripts.forEach(script => {
            const matches = script?.match(/https:\/\/[^"']+\.m3u8/g);
            if (matches) m3u8Links.push(...matches);
        });

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


