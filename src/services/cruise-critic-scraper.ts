
'use server';

import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

export interface ScrapedCruiseData {
  title: string;
  price: string;
  itinerary: string;
  duration: string;
  url: string;
}

export interface ScraperInput {
  destination: string;
  length?: string;
  cruiseLine?: string;
}

const cruiseLineMap: { [key: string]: string } = {
    'Royal Caribbean': 'royal-caribbean-cruises',
    'Carnival': 'carnival-cruises',
    'Norwegian': 'norwegian-cruise-line',
    'MSC Cruises': 'msc-cruises',
    'Disney': 'disney-cruise-line',
    'Holland America': 'holland-america-line',
    'Celebrity': 'celebrity-cruises',
    'Viking': 'viking-ocean-cruises',
    'Virgin Voyages': 'virgin-voyages',
};

const lengthMap: { [key: string]: string } = {
    '3-5 nights': '3-5',
    '6-9 nights': '6-9',
    '10-14 nights': '10-14',
    '15+ nights': '15-',
};

const destinationMap: { [key: string]: string } = {
    'CARIB': 'caribbean-cruises',
    'AK': 'alaska-cruises',
    'MEX': 'mexico-cruises',
    'BAH': 'bahamas-cruises',
    'BER': 'bermuda-cruises',
    'HAW': 'hawaii-cruises',
    'EUR': 'europe-cruises',
};

export async function scrapeCruiseCritic(input: ScraperInput): Promise<ScrapedCruiseData[]> {
    console.log('Starting scrape with input:', input);
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    // Set a realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');
  
    // Build URL from input
    const baseUrl = 'https://www.cruisecritic.com';
    let url = `${baseUrl}/find-a-cruise/`;
    
    const destinationPath = destinationMap[input.destination];
    if (destinationPath) url += `${destinationPath}/`;
    
    const linePath = input.cruiseLine ? cruiseLineMap[input.cruiseLine] : undefined;
    if (linePath) url += `${linePath}/`;

    const lengthPath = input.length ? lengthMap[input.length] : undefined;
    if (lengthPath) url += `?duration=${lengthPath}`;

    console.log('Scraping URL:', url);

    await page.goto(url, { waitUntil: 'networkidle2' });

    const content = await page.content();
    const $ = cheerio.load(content);

    const cruises: ScrapedCruiseData[] = [];

    // This selector targets the main cruise card on Cruise Critic's search results
    $('div.find-a-cruise-card').each((index, element) => {
        if (index >= 5) return; // Limit to 5 results for now

        const title = $(element).find('h3.cruise-card__title').text().trim();
        const price = $(element).find('div.price-value').text().trim();
        const itinerary = $(element).find('div.cruise-card__itinerary-list').text().trim().replace(/\s+/g, ' ');
        const duration = $(element).find('div.cruise-card__duration').text().trim();
        const relativeUrl = $(element).find('a.cruise-card__title-link').attr('href');
        
        cruises.push({
            title,
            price: price || 'Call for price',
            itinerary,
            duration,
            url: relativeUrl ? baseUrl + relativeUrl : baseUrl,
        });
    });

    console.log(`Scraped ${cruises.length} cruises.`);
    await browser.close();
    return cruises;
}
