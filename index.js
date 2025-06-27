const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

app.use(express.json());

app.post('/', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).send('Missing URL');

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Scroll to the bottom
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    const html = await page.content();
    await browser.close();

    res.json({ html });
  } catch (err) {
    await browser.close();
    res.status(500).send('Failed to scrape');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
