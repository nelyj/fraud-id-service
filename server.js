const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/get-fraud-id', async (req, res) => {
  const { apiKey, env = 'sandbox', params = {} } = req.body;

  if (!apiKey || typeof params !== 'object' || Object.keys(params).length === 0) {
    return res.status(400).json({ error: 'Missing or invalid apiKey or params' });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const html = `
    <html>
      <body>
        <script>
          var script = document.createElement("script");
          script.id = "deuna-sdk";
          script.src = "https://cdn.deuna.io/web-sdk/v1.1/index.js";

          script.onload = async function () {
            try {
              await DeunaSDK.initialize({
                publicApiKey: "${apiKey}",
                env: "${env}"
              });

              const fraudId = await DeunaSDK.generateFraudId(${JSON.stringify(params)});
              window.fraudId = fraudId;
            } catch (e) {
              window.fraudId = "ERROR:" + e.message;
            }
          };

          document.body.appendChild(script);
        </script>
      </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });

  const fraudId = await page.evaluate(() => window.fraudId);

  await browser.close();

  res.json({ fraudId });
});

app.listen(port, () => {
  console.log(`Precise Deuna FraudID service running at http://localhost:${port}`);
});