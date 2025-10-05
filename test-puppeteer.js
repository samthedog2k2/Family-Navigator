/**
 * SP Puppeteer Test Script
 * Tests browser functionality with comprehensive error handling
 */

const fs = require('fs');
const path = require('path');

async function testPuppeteer() {
    console.log('🧪 SP: Testing Puppeteer installation...');

    try {
        // Try to import Puppeteer
        let puppeteer;
        try {
            puppeteer = require('puppeteer');
            console.log('✅ Puppeteer imported successfully');
        } catch (error) {
            console.log('❌ Puppeteer import failed:', error.message);

            // Try puppeteer-core
            try {
                puppeteer = require('puppeteer-core');
                console.log('✅ Puppeteer-core imported successfully');
            } catch (coreError) {
                console.log('❌ Puppeteer-core also failed:', coreError.message);
                return false;
            }
        }

        // Try to launch browser
        console.log('🚀 Attempting to launch browser...');

        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        });

        console.log('✅ Browser launched successfully');

        // Test basic page functionality
        const page = await browser.newPage();
        await page.goto('https://example.com', { waitUntil: 'networkidle0' });
        const title = await page.title();

        console.log(`✅ Page loaded successfully: ${title}`);

        await browser.close();
        console.log('✅ Browser closed successfully');

        return true;

    } catch (error) {
        console.log('❌ Puppeteer test failed:', error.message);

        // Detailed error analysis
        if (error.message.includes('libnss3')) {
            console.log('🔍 Issue: Missing system library libnss3');
            console.log('💡 Solution: System needs Chrome/Chromium dependencies');
        } else if (error.message.includes('ENOENT')) {
            console.log('🔍 Issue: Chromium executable not found');
            console.log('💡 Solution: Try PUPPETEER_EXECUTABLE_PATH');
        } else if (error.message.includes('Permission denied')) {
            console.log('🔍 Issue: Permission problems');
            console.log('💡 Solution: Check file permissions');
        }

        return false;
    }
}

async function testAlternatives() {
    console.log('\n🔄 SP: Testing alternative solutions...');

    // Test fetch-based scraping
    try {
        console.log('🌐 Testing HTTP-only scraping...');
        const response = await fetch('https://example.com');
        const html = await response.text();
        console.log(`✅ HTTP scraping works (${html.length} bytes)`);

        // Test HTML parsing
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : 'No title';
        console.log(`✅ HTML parsing works: ${title}`);

        return true;
    } catch (error) {
        console.log('❌ HTTP scraping failed:', error.message);
        return false;
    }
}

// Run tests
(async () => {
    const puppeteerWorks = await testPuppeteer();

    if (!puppeteerWorks) {
        console.log('\n⚠️  Puppeteer not working, testing alternatives...');
        const httpWorks = await testAlternatives();

        if (httpWorks) {
            console.log('\n✅ SP RECOMMENDATION: Use HTTP-only scraping');
            console.log('   - More reliable in cloud environments');
            console.log('   - No system dependencies required');
            console.log('   - Faster execution');
        } else {
            console.log('\n❌ All scraping methods failed');
        }
    } else {
        console.log('\n🎉 SP SUCCESS: Puppeteer is working perfectly!');
    }
})();