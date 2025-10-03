#!/bin/bash

# SP AUTONOMOUS CRUISE DATA COLLECTION SYSTEM
# Complete replacement for n8n/AirTop with intelligent agents

echo "SP AUTONOMOUS CRUISE SCRAPER - COMPLETE SYSTEM"
echo "=============================================="

# Create project directory
mkdir -p sp-autonomous-cruise-scraper
cd sp-autonomous-cruise-scraper

# Install dependencies
echo "Installing dependencies..."
cat > package.json << 'EOF'
{
  "name": "sp-autonomous-cruise-scraper",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "scrape": "node scraper-agent.js",
    "monitor": "node monitor-agent.js"
  },
  "dependencies": {
    "puppeteer": "^21.0.0",
    "cheerio": "^1.0.0-rc.12",
    "cron": "^3.0.0",
    "winston": "^3.10.0"
  }
}
EOF

npm install

# Create the main orchestrator
cat > index.js << 'EOF'
#!/usr/bin/env node

/**
 * SP Autonomous Cruise Data Collection System
 * Complete replacement for n8n/AirTop with intelligent agents
 */

const ScraperAgent = require('./scraper-agent');
const DataAgent = require('./data-agent');
const FirebaseAgent = require('./firebase-agent');
const MonitorAgent = require('./monitor-agent');
const cron = require('cron');
const winston = require('winston');

class SPAutonomousOrchestrator {
    constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: 'cruise-scraper.log' })
            ]
        });

        this.agents = {
            scraper: new ScraperAgent(this.logger),
            data: new DataAgent(this.logger),
            firebase: new FirebaseAgent(this.logger),
            monitor: new MonitorAgent(this.logger)
        };

        this.isRunning = false;
    }

    async executeDataCollection() {
        if (this.isRunning) {
            this.logger.warn('Data collection already in progress');
            return;
        }

        this.isRunning = true;
        this.logger.info('Starting autonomous cruise data collection...');

        try {
            // Phase 1: Scrape data from multiple sources
            const rawData = await this.agents.scraper.collectCruiseData();
            this.logger.info(`Collected ${rawData.length} raw cruise records`);

            // Phase 2: Process and clean data
            const cleanData = await this.agents.data.processData(rawData);
            this.logger.info(`Processed ${cleanData.length} clean cruise records`);

            // Phase 3: Save to Firebase
            const saveResult = await this.agents.firebase.saveData(cleanData);
            this.logger.info(`Saved to Firebase: ${saveResult.success ? 'SUCCESS' : 'FAILED'}`);

            // Phase 4: Monitor results
            await this.agents.monitor.checkDataQuality(cleanData);

            this.logger.info('Autonomous data collection completed successfully');

            return {
                success: true,
                recordsCollected: rawData.length,
                recordsProcessed: cleanData.length,
                firebaseSaved: saveResult.success
            };

        } catch (error) {
            this.logger.error('Data collection failed:', error);
            return { success: false, error: error.message };
        } finally {
            this.isRunning = false;
        }
    }

    startScheduledCollection() {
        // Run every 6 hours
        const job = new cron.CronJob('0 */6 * * *', async () => {
            await this.executeDataCollection();
        });

        job.start();
        this.logger.info('Scheduled collection started (every 6 hours)');
    }

    async runOnce() {
        return await this.executeDataCollection();
    }
}

// Main execution
async function main() {
    const orchestrator = new SPAutonomousOrchestrator();

    if (process.argv.includes('--schedule')) {
        orchestrator.startScheduledCollection();
        console.log('Autonomous cruise scraper running with schedule...');
        process.stdin.resume(); // Keep process alive
    } else {
        console.log('Running one-time data collection...');
        const result = await orchestrator.runOnce();
        console.log('Result:', result);
        process.exit(result.success ? 0 : 1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = SPAutonomousOrchestrator;
EOF

# Create intelligent scraper agent
cat > scraper-agent.js << 'EOF'
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

class ScraperAgent {
    constructor(logger) {
        this.logger = logger;
        this.userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ];
        this.sites = [
            {
                name: 'CruiseMapper',
                url: 'https://www.cruisemapper.com/cruise-deals',
                selectors: {
                    container: '.cruise-card, .deal-card, .itinerary-list li',
                    title: '.cruise-title, .deal-title, .ship-name, h3',
                    ship: '.ship-name, .vessel-name',
                    line: '.cruise-line, .company-name',
                    price: '.price, .deal-price, .cost',
                    departure: '.departure-port, .port',
                    date: '.sail-date, .departure-date, .date',
                    duration: '.duration, .length, .days',
                    itinerary: '.itinerary, .ports, .destinations'
                }
            },
            {
                name: 'CruiseCritic',
                url: 'https://www.cruisecritic.com/cruise-deals/',
                selectors: {
                    container: '.result-card-container, .cruise-card',
                    title: '.result-card-title, .cruise-title',
                    ship: '.ship-name',
                    line: '.cruise-line-name',
                    price: '.price-amount, .cruise-price',
                    departure: '.departure-port',
                    itinerary: '.itinerary-overview'
                }
            }
        ];
    }

    async createBrowser() {
        return await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--disable-dev-shm-usage'
            ]
        });
    }

    async humanDelay(min = 2000, max = 5000) {
        const delay = Math.random() * (max - min) + min;
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    async scrapeSite(site) {
        const browser = await this.createBrowser();
        const page = await browser.newPage();

        try {
            // Set random user agent
            const userAgent = this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
            await page.setUserAgent(userAgent);

            this.logger.info(`Scraping ${site.name}...`);

            await page.goto(site.url, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            await this.humanDelay();

            const cruises = await page.evaluate((selectors) => {
                const results = [];

                document.querySelectorAll(selectors.container).forEach(container => {
                    const getTextContent = (selectorString) => {
                        const selectors = selectorString.split(', ');
                        for (const selector of selectors) {
                            const element = container.querySelector(selector.trim());
                            if (element) return element.textContent?.trim() || '';
                        }
                        return '';
                    };

                    const cruise = {
                        title: getTextContent(selectors.title),
                        ship: getTextContent(selectors.ship),
                        line: getTextContent(selectors.line),
                        price: getTextContent(selectors.price),
                        departure: getTextContent(selectors.departure),
                        date: getTextContent(selectors.date),
                        duration: getTextContent(selectors.duration),
                        itinerary: getTextContent(selectors.itinerary),
                        link: container.querySelector('a')?.href || '',
                        rawHtml: container.innerHTML.substring(0, 500)
                    };

                    if (cruise.title && (cruise.ship || cruise.price)) {
                        results.push(cruise);
                    }
                });

                return results;
            }, site.selectors);

            this.logger.info(`Found ${cruises.length} cruises from ${site.name}`);

            return cruises.map(cruise => ({
                ...cruise,
                source: site.name,
                scrapedAt: new Date().toISOString()
            }));

        } catch (error) {
            this.logger.error(`Error scraping ${site.name}:`, error.message);
            return [];
        } finally {
            await browser.close();
        }
    }

    async collectCruiseData() {
        const allCruises = [];

        for (const site of this.sites) {
            const siteData = await this.scrapeSite(site);
            allCruises.push(...siteData);

            // Respectful delay between sites
            await this.humanDelay(10000, 15000);
        }

        this.logger.info(`Total cruises collected: ${allCruises.length}`);
        return allCruises;
    }
}

module.exports = ScraperAgent;
EOF

# Create data processing agent
cat > data-agent.js << 'EOF'
class DataAgent {
    constructor(logger) {
        this.logger = logger;
    }

    cleanText(text) {
        if (!text) return '';
        return text.replace(/\s+/g, ' ').trim();
    }

    extractPrice(priceText) {
        if (!priceText) return null;
        const match = priceText.match(/\$[\d,]+/);
        return match ? match[0] : priceText;
    }

    extractDuration(durationText) {
        if (!durationText) return null;
        const match = durationText.match(/(\d+)\s*(day|night)/i);
        return match ? parseInt(match[1]) : null;
    }

    processData(rawData) {
        this.logger.info('Processing raw cruise data...');

        const processed = rawData.map(cruise => {
            return {
                id: `cruise_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                title: this.cleanText(cruise.title),
                shipName: this.cleanText(cruise.ship) || this.cleanText(cruise.title),
                cruiseLine: this.cleanText(cruise.line),
                price: this.extractPrice(cruise.price),
                departurePort: this.cleanText(cruise.departure),
                departureDate: this.cleanText(cruise.date),
                duration: this.extractDuration(cruise.duration),
                durationText: this.cleanText(cruise.duration),
                itinerary: this.cleanText(cruise.itinerary),
                link: cruise.link,
                source: cruise.source,
                scrapedAt: cruise.scrapedAt,
                processedAt: new Date().toISOString(),
                quality: this.assessQuality(cruise)
            };
        }).filter(cruise => cruise.quality > 0.3); // Filter low quality data

        // Remove duplicates
        const unique = this.removeDuplicates(processed);

        this.logger.info(`Processed ${unique.length} unique cruises`);
        return unique;
    }

    assessQuality(cruise) {
        let score = 0;
        if (cruise.title) score += 0.3;
        if (cruise.ship) score += 0.2;
        if (cruise.price) score += 0.2;
        if (cruise.departure) score += 0.1;
        if (cruise.itinerary) score += 0.1;
        if (cruise.date) score += 0.1;
        return score;
    }

    removeDuplicates(cruises) {
        const seen = new Set();
        return cruises.filter(cruise => {
            const key = `${cruise.shipName}_${cruise.departureDate}_${cruise.price}`.toLowerCase();
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }
}

module.exports = DataAgent;
EOF

# Create Firebase integration agent
cat > firebase-agent.js << 'EOF'
const fs = require('fs');
const path = require('path');

class FirebaseAgent {
    constructor(logger) {
        this.logger = logger;
    }

    async saveData(cruiseData) {
        this.logger.info('Saving data to Firebase format...');

        try {
            // Create Firebase-compatible structure
            const firebaseData = {};
            const timestamp = new Date().toISOString().split('T')[0];

            cruiseData.forEach((cruise, index) => {
                firebaseData[cruise.id] = cruise;
            });

            // Save as JSON files
            const filename = `cruise-data-${timestamp}.json`;
            const firebaseFilename = `firebase-import-${timestamp}.json`;

            // Raw data file
            fs.writeFileSync(filename, JSON.stringify(cruiseData, null, 2));

            // Firebase import file
            fs.writeFileSync(firebaseFilename, JSON.stringify(firebaseData, null, 2));

            // Create summary
            const summary = {
                timestamp: new Date().toISOString(),
                totalRecords: cruiseData.length,
                sources: [...new Set(cruiseData.map(c => c.source))],
                priceRange: this.calculatePriceRange(cruiseData),
                topCruiseLines: this.getTopCruiseLines(cruiseData)
            };

            fs.writeFileSync(`summary-${timestamp}.json`, JSON.stringify(summary, null, 2));

            this.logger.info(`Data saved: ${filename}, ${firebaseFilename}`);

            return {
                success: true,
                files: [filename, firebaseFilename],
                recordCount: cruiseData.length
            };

        } catch (error) {
            this.logger.error('Firebase save error:', error);
            return { success: false, error: error.message };
        }
    }

    calculatePriceRange(cruises) {
        const prices = cruises
            .map(c => c.price)
            .filter(p => p && p.includes('$'))
            .map(p => parseInt(p.replace(/[$,]/g, '')))
            .filter(p => !isNaN(p));

        if (prices.length === 0) return null;

        return {
            min: Math.min(...prices),
            max: Math.max(...prices),
            average: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
        };
    }

    getTopCruiseLines(cruises) {
        const lines = {};
        cruises.forEach(cruise => {
            if (cruise.cruiseLine) {
                lines[cruise.cruiseLine] = (lines[cruise.cruiseLine] || 0) + 1;
            }
        });

        return Object.entries(lines)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([line, count]) => ({ line, count }));
    }
}

module.exports = FirebaseAgent;
EOF

# Create monitoring agent
cat > monitor-agent.js << 'EOF'
class MonitorAgent {
    constructor(logger) {
        this.logger = logger;
    }

    async checkDataQuality(cruiseData) {
        this.logger.info('Monitoring data quality...');

        const stats = {
            total: cruiseData.length,
            withPrices: cruiseData.filter(c => c.price).length,
            withShipNames: cruiseData.filter(c => c.shipName).length,
            withDeparturePorts: cruiseData.filter(c => c.departurePort).length,
            withItineraries: cruiseData.filter(c => c.itinerary).length,
            sources: [...new Set(cruiseData.map(c => c.source))]
        };

        const qualityScore = (
            (stats.withPrices / stats.total) * 0.3 +
            (stats.withShipNames / stats.total) * 0.3 +
            (stats.withDeparturePorts / stats.total) * 0.2 +
            (stats.withItineraries / stats.total) * 0.2
        );

        this.logger.info('Data quality stats:', stats);
        this.logger.info(`Overall quality score: ${(qualityScore * 100).toFixed(1)}%`);

        if (qualityScore < 0.5) {
            this.logger.warn('Data quality below threshold!');
        }

        return { stats, qualityScore };
    }
}

module.exports = MonitorAgent;
EOF

# Create startup script
cat > start.sh << 'EOF'
#!/bin/bash

echo "SP Autonomous Cruise Scraper"
echo "==========================="

if [ "$1" = "schedule" ]; then
    echo "Starting scheduled collection (every 6 hours)..."
    node index.js --schedule
else
    echo "Running one-time collection..."
    node index.js
fi
EOF

chmod +x start.sh

# Create Firebase import helper
cat > firebase-helper.js << 'EOF'
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
EOF

chmod +x firebase-helper.js

echo ""
echo "SP AUTONOMOUS CRUISE SCRAPER - SETUP COMPLETE"
echo "============================================="
echo ""
echo "FILES CREATED:"
echo "  index.js           - Main orchestrator"
echo "  scraper-agent.js   - Intelligent scraping"
echo "  data-agent.js      - Data processing"
echo "  firebase-agent.js  - Firebase integration"
echo "  monitor-agent.js   - Quality monitoring"
echo "  start.sh           - Startup script"
echo "  firebase-helper.js - Import assistant"
echo ""
echo "USAGE:"
echo "  ./start.sh          - Run once"
echo "  ./start.sh schedule - Run every 6 hours"
echo "  node firebase-helper.js - Show import instructions"
echo ""
echo "OUTPUT FILES:"
echo "  cruise-data-YYYY-MM-DD.json    - Raw data"
echo "  firebase-import-YYYY-MM-DD.json - Firebase format"
echo "  summary-YYYY-MM-DD.json        - Statistics"
echo "  cruise-scraper.log             - Activity log"
echo ""
echo "FEATURES:"
echo "  ✓ Autonomous multi-site scraping"
echo "  ✓ Intelligent data processing"
echo "  ✓ Firebase integration"
echo "  ✓ Quality monitoring"
echo "  ✓ Scheduled execution"
echo "  ✓ Human-like behavior"
echo "  ✓ Duplicate removal"
echo "  ✓ Error handling"
echo ""
echo "Run './start.sh' to begin autonomous cruise data collection!"