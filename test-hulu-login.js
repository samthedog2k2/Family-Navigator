#!/usr/bin/env node

import puppeteer from 'puppeteer';

async function testHuluLogin() {
  let browser;
  try {
    console.log('Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      executablePath: '/google/idx/builtins/bin/chromium', // Use system chromium
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-features=VizDisplayCompositor',
        '--disable-web-security',
        '--disable-dev-shm-usage',
        '--no-zygote',
        '--single-process',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
      ]
    });

    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({ width: 1366, height: 768 });

    // Navigate to login page
    console.log('Navigating to Hulu login page...');
    await page.goto('https://www.hulu.com/login', { waitUntil: 'networkidle2', timeout: 30000 });

    // Take a screenshot for debugging
    await page.screenshot({ path: '/tmp/hulu-login.png' });
    console.log('Screenshot saved to /tmp/hulu-login.png');

    // Get page title and URL
    const title = await page.title();
    const url = await page.url();
    console.log(`Page title: ${title}`);
    console.log(`Current URL: ${url}`);

    // Look for login form elements
    console.log('Searching for login form elements...');
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const submitButton = await page.$('button[type="submit"]');

    console.log(`Email input found: ${!!emailInput}`);
    console.log(`Password input found: ${!!passwordInput}`);
    console.log(`Submit button found: ${!!submitButton}`);

    // Get all input elements and their attributes
    const inputs = await page.$$eval('input', inputs =>
      inputs.map(input => ({
        type: input.type,
        name: input.name,
        id: input.id,
        placeholder: input.placeholder,
        className: input.className
      }))
    );
    console.log('All input elements:');
    console.log(JSON.stringify(inputs, null, 2));

    // Get all button elements
    const buttons = await page.$$eval('button', buttons =>
      buttons.map(button => ({
        type: button.type,
        textContent: button.textContent.trim(),
        className: button.className
      }))
    );
    console.log('All button elements:');
    console.log(JSON.stringify(buttons, null, 2));

    // Check if page content indicates we need to wait for JavaScript
    const bodyHTML = await page.$eval('body', body => body.innerHTML.length);
    console.log(`Body HTML length: ${bodyHTML} characters`);

    if (bodyHTML < 1000) {
      console.log('Waiting for JavaScript to load...');
      await page.waitForTimeout(5000);

      // Check again
      const newInputs = await page.$$eval('input', inputs =>
        inputs.map(input => ({
          type: input.type,
          name: input.name,
          id: input.id,
          placeholder: input.placeholder
        }))
      );
      console.log('Input elements after waiting:');
      console.log(JSON.stringify(newInputs, null, 2));
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testHuluLogin();