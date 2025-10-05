#!/usr/bin/env node

const fs = require('fs');

console.log('SP Firebase Import Helper');
console.log('========================');

// Find latest data file
const files = fs.readdirSync('.').filter(f => f.startsWith('firebase-import-'));
if (files.length === 0) {
    console.log('No Firebase import files found. Run the scraper first.');
    process.exit(1);
}

const latestFile = files.sort().reverse()[0];
console.log(`Latest file: ${latestFile}`);

const data = JSON.parse(fs.readFileSync(latestFile, 'utf8'));
console.log(`Records: ${Object.keys(data).length}`);

console.log('\nTo import to Firebase:');
console.log('1. Go to Firebase Console');
console.log('2. Database > Import JSON');
console.log(`3. Upload: ${latestFile}`);
console.log('4. Import path: /cruises');

// Show sample data
const firstKey = Object.keys(data)[0];
if (firstKey) {
    console.log('\nSample record:');
    console.log(JSON.stringify(data[firstKey], null, 2));
}
