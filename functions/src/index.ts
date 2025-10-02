import * as functions from 'firebase-functions';
import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

admin.initializeApp();

export const receiveCruiseData = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send({ error: 'Method not allowed' });
    return;
  }

  try {
    const cruiseData = req.body;
    const docRef = await admin.firestore().collection('cruiseResults').add({
      ...cruiseData,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      source: 'n8n-puppeteer'
    });

    res.status(200).json({
      success: true,
      message: 'Cruise data received and saved',
      documentId: docRef.id,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error processing cruise data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export const scrapeCruises = onRequest(
  { timeoutSeconds: 540, memory: '2GiB' },
  async (req, res) => {

    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    const { destination } = req.body;

    let browser;
    try {
      console.log('Launching browser with serverless Chrome...');

      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: { width: 1280, height: 720 },
        executablePath: await chromium.executablePath(),
        headless: true,
      });

      const page = await browser.newPage();

      console.log('Navigating to CruiseMapper...');
      await page.goto('https://www.cruisemapper.com/cruise-search', {
        waitUntil: 'networkidle2',
        timeout: 60000
      });

      await new Promise(resolve => setTimeout(resolve, 3000));

      // Close ads
      console.log('Handling popups...');
      const closeSelectors = [
        'button[aria-label="Close"]',
        'button[aria-label="OK"]',
        '.close-button',
        '[class*="close"]'
      ];

      for (const sel of closeSelectors) {
        try {
          const buttons = await page.$$(sel);
          for (const btn of buttons) {
            await btn.click().catch(() => {});
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } catch (e) {}
      }

      console.log('Filling form...');

      if (destination) {
        await page.type('input[name*="destination"]', destination).catch(() => {});
      }

      console.log('Submitting search...');
      await page.keyboard.press('Enter');
      await new Promise(resolve => setTimeout(resolve, 5000));

      console.log('Extracting results...');
      const cruises = await page.evaluate(() => {
        const results: any[] = [];
        const rows = document.querySelectorAll('table tr');

        rows.forEach((row, i) => {
          if (i === 0 && row.querySelector('th')) return;
          const cells = row.querySelectorAll('td');
          if (cells.length >= 3) {
            results.push({
              cruiseLine: cells[0]?.textContent?.trim() || 'N/A',
              ship: cells[1]?.textContent?.trim() || 'N/A',
              date: cells[2]?.textContent?.trim() || 'N/A',
              price: cells[3]?.textContent?.trim() || 'N/A'
            });
          }
        });

        return results.length > 0 ? results : [{ message: 'No results found' }];
      });

      await browser.close();

      console.log(`Found ${cruises.length} cruises`);

      res.status(200).json({
        success: true,
        results: cruises,
        count: cruises.length,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      console.error('Error:', error);
      if (browser) await browser.close();
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });