const express = require('express');
const { chromium } = require('playwright');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/get-fraud-id', async (req, res) => {
  const { apiKey, env = 'sandbox', params = {} } = req.body;

  console.log('➡️ Request recibido:');
  console.log('apiKey:', apiKey);
  console.log('env:', env);
  console.log('params:', params);

  if (!apiKey || typeof params !== 'object' || Object.keys(params).length === 0) {
    return res.status(400).json({ error: 'Missing or invalid apiKey or params' });
  }

  let browser;

  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

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
                console.log("✅ fraudId generado:", fraudId);
                window.fraudId = fraudId;
              } catch (e) {
                console.error("❌ Error en generateFraudId:", e.message);
                window.fraudId = "ERROR:" + e.message;
              }
            };

            document.body.appendChild(script);
          </script>
        </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: 'load' });

    // Esperar hasta que el fraudId esté disponible
    await page.waitForFunction(() => typeof window.fraudId !== 'undefined', { timeout: 5000 });

    // Obtener el valor real de window.fraudId
    const fraudId = await page.evaluate(() => window.fraudId);

    console.log('⬅️ Respuesta enviada:', fraudId);
    res.json({ fraudId });

  } catch (error) {
    console.error('🔥 Error al procesar:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(port, () => {
  console.log(`✅ FraudID service running at http://localhost:${port}`);
});