const fs = require('fs');

console.log('🧪 SP: Testing Puppeteer installation...');

async function testPuppeteer() {
    try {
        console.log('📦 Importing Puppeteer...');
        const puppeteer = require('puppeteer');
        console.log('✅ Puppeteer imported successfully');
        
        console.log('🚀 Launching browser...');
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ]
        });
        
        console.log('✅ Browser launched');
        
        const page = await browser.newPage();
        await page.goto('https://example.com');
        const title = await page.title();
        
        console.log('✅ Page loaded:', title);
        
        await browser.close();
        console.log('✅ Test completed successfully!');
        
        return true;
        
    } catch (error) {
        console.log('❌ Error:', error.message);
        
        if (error.message.includes('libnss3')) {
            console.log('💡 Issue: Missing system libraries');
            console.log('💡 Recommendation: Use HTTP-only scraping instead');
        }
        
        return false;
    }
}

async function testHTTP() {
    try {
        console.log('🌐 Testing HTTP scraping as fallback...');
        const response = await fetch('https://example.com');
        const html = await response.text();
        console.log('✅ HTTP scraping works!');
        return true;
    } catch (error) {
        console.log('❌ HTTP failed:', error.message);
        return false;
    }
}

// Run tests
testPuppeteer().then(puppeteerWorked => {
    if (puppeteerWorked) {
        console.log('\n🎉 RESULT: Puppeteer is working - you can use full browser automation!');
    } else {
        console.log('\n⚠️ RESULT: Puppeteer failed - using HTTP-only scraping');
        testHTTP();
    }
});