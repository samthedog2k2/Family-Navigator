const cheerio = require('cheerio');
const https = require('https');
const http = require('http');
const { URL } = require('url');

class ScraperAgent {
    constructor(logger) {
        this.logger = logger;
        this.userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ];
    }

    async humanDelay(min = 2000, max = 5000) {
        const delay = Math.random() * (max - min) + min;
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    async fetchPage(url) {
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const client = urlObj.protocol === 'https:' ? https : http;
            const userAgent = this.userAgents[Math.floor(Math.random() * this.userAgents.length)];

            const options = {
                hostname: urlObj.hostname,
                port: urlObj.port,
                path: urlObj.pathname + urlObj.search,
                method: 'GET',
                headers: {
                    'User-Agent': userAgent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1'
                }
            };

            const req = client.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data);
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.setTimeout(30000, () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });

            req.end();
        });
    }

    generateMockCruiseData() {
        const mockCruises = [
            {
                title: 'Caribbean Paradise - 7 Days',
                ship: 'Royal Symphony',
                line: 'Royal Caribbean',
                price: '$899',
                departure: 'Miami, FL',
                date: '2025-11-15',
                duration: '7 days',
                itinerary: 'Miami, Cozumel, Jamaica, Bahamas',
                link: 'https://example.com/cruise1',
                source: 'MockData',
                scrapedAt: new Date().toISOString()
            },
            {
                title: 'Mediterranean Explorer',
                ship: 'Celebrity Eclipse',
                line: 'Celebrity Cruises',
                price: '$1,299',
                departure: 'Barcelona, Spain',
                date: '2025-12-01',
                duration: '10 days',
                itinerary: 'Barcelona, Rome, Naples, Greece',
                link: 'https://example.com/cruise2',
                source: 'MockData',
                scrapedAt: new Date().toISOString()
            },
            {
                title: 'Alaska Adventure',
                ship: 'Norwegian Star',
                line: 'Norwegian Cruise Line',
                price: '$1,599',
                departure: 'Seattle, WA',
                date: '2025-06-20',
                duration: '7 days',
                itinerary: 'Seattle, Juneau, Ketchikan, Glacier Bay',
                link: 'https://example.com/cruise3',
                source: 'MockData',
                scrapedAt: new Date().toISOString()
            },
            {
                title: 'Pacific Coast Journey',
                ship: 'Holland America Koningsdam',
                line: 'Holland America',
                price: '$1,150',
                departure: 'Los Angeles, CA',
                date: '2025-10-05',
                duration: '14 days',
                itinerary: 'Los Angeles, San Francisco, Portland, Vancouver',
                link: 'https://example.com/cruise4',
                source: 'MockData',
                scrapedAt: new Date().toISOString()
            },
            {
                title: 'Baltic Sea Discovery',
                ship: 'MSC Splendida',
                line: 'MSC Cruises',
                price: '$2,099',
                departure: 'Copenhagen, Denmark',
                date: '2025-07-10',
                duration: '12 days',
                itinerary: 'Copenhagen, Stockholm, Helsinki, St. Petersburg',
                link: 'https://example.com/cruise5',
                source: 'MockData',
                scrapedAt: new Date().toISOString()
            }
        ];

        this.logger.info(`Generated ${mockCruises.length} mock cruise records for testing`);
        return mockCruises;
    }

    async collectCruiseData() {
        this.logger.info('Starting cruise data collection...');

        // For now, return mock data since we can't run Puppeteer
        // In a real environment with proper dependencies, this would scrape actual sites
        const mockData = this.generateMockCruiseData();

        // Add some realistic delay to simulate scraping
        await this.humanDelay(3000, 5000);

        this.logger.info(`Total cruises collected: ${mockData.length}`);
        return mockData;
    }
}

module.exports = ScraperAgent;