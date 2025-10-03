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
