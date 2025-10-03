import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const mscCruiseAgent = onRequest(
  { timeoutSeconds: 540, memory: '2GiB' },
  async (req, res) => {
    const { userId } = req.body;

    let browser;
    try {
      // 1. Get credentials from Firebase
      const credsDoc = await admin.firestore()
        .collection('userCredentials')
        .doc(userId)
        .collection('sites')
        .doc('msc-cruises')
        .get();

      if (!credsDoc.exists) {
        return res.status(404).json({ error: 'No MSC credentials found' });
      }

      const { username, password } = credsDoc.data()!;

      // 2. Launch browser
      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      });

      const page = await browser.newPage();

      // 3. Navigate and login
      await page.goto('https://www.msccruisesusa.com/en-us/Manage-Booking.aspx');
      await page.waitForSelector('input[name="username"]');
      
      await page.type('input[name="username"]', username);
      await page.type('input[name="password"]', password);
      await page.click('button[type="submit"]');

      // 4. Wait for login
      await page.waitForNavigation();

      // 5. Extract data (adjust selectors to match MSC's actual page)
      const cruises = await page.evaluate(() => {
        const results: any[] = [];
        document.querySelectorAll('.booking-item').forEach(item => {
          results.push({
            cruiseName: item.querySelector('.cruise-name')?.textContent,
            dates: item.querySelector('.cruise-dates')?.textContent,
            cabin: item.querySelector('.cabin-type')?.textContent,
            price: item.querySelector('.price')?.textContent,
          });
        });
        return results;
      });

      await browser.close();

      return res.json({
        success: true,
        cruises,
        source: 'MSC Account - Authenticated'
      });

    } catch (error: any) {
      if (browser) await browser.close();
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);
