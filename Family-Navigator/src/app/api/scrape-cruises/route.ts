import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import * as cheerio from "cheerio";
import chromium from '@sparticuz/chromium';

// --- Site selector map ---
const SITE_CONFIGS = {
  "cruisecritic.com": {
    CONTAINER: [".result-card-container", ".cruise-card"],
    TITLE: [".result-card-title", ".title"],
    SHIP: [".ship-name"],
    LINE: [".cruise-line-name"],
    PRICE: [".price-amount", ".cruise-price"],
    DURATION: [".cruise-length"],
    ITINERARY: [".itinerary-overview", ".itinerary-text"],
    DEPARTURE: [".departure-port"],
    RATING: [".rating"],
    DATE: [".sail-date"],
    LINK: ["a.cruise-card-link", "a.result-card-link"],
    NEXT: ["a[rel='next']", "button[aria-label='Next']"],
  },
  "cruises.com": {
    CONTAINER: [".cruise-result", ".card"],
    TITLE: [".result-title", ".cruise-name"],
    SHIP: [".ship-name"],
    LINE: [".line-name"],
    PRICE: [".price", ".result-price"],
    DURATION: [".duration"],
    ITINERARY: [".itinerary"],
    DEPARTURE: [".departure"],
    RATING: [".rating"],
    DATE: [".sail-date"],
    LINK: ["a.details-link"],
    NEXT: ["a.next-page"],
  },
  "cruise.com": {
    CONTAINER: [".cruise-listing", ".package-block", ".card"],
    TITLE: [".cruise-name", ".package-name"],
    SHIP: [".ship-name"],
    LINE: [".cruise-line"],
    PRICE: [".price", ".cruise-price"],
    DURATION: [".duration"],
    ITINERARY: [".itinerary"],
    DEPARTURE: [".departure"],
    RATING: [".rating"],
    DATE: [".sail-date"],
    LINK: ["a.details-link"],
    NEXT: ["a.next-page"],
  },
  "cruisewatch.com": {
    CONTAINER: [".cruise-result-list .result-item"],
    TITLE: [".result-item__cruise-title"],
    SHIP: [".result-item__ship-name"],
    LINE: [".result-item__cruise-line"],
    PRICE: [".result-item__price"],
    DURATION: [".result-item__duration"],
    ITINERARY: [".result-item__itinerary"],
    DEPARTURE: [".result-item__departure-port"],
    RATING: [".result-item__rating"],
    DATE: [".result-item__date"],
    LINK: ["a.result-item__link"],
    NEXT: [".pagination-next", "button.next"],
  },
  "priceline.com": {
    CONTAINER: [".cruise-card", ".result-item"],
    TITLE: [".cruise-title"],
    SHIP: [".ship-name"],
    LINE: [".line-name"],
    PRICE: [".price"],
    DURATION: [".duration"],
    ITINERARY: [".itinerary"],
    DEPARTURE: [".departure"],
    RATING: [".rating"],
    DATE: [".sail-date"],
    LINK: ["a.details-link"],
    NEXT: ["a.next"],
  },
  "expedia.com": {
    CONTAINER: [".uitk-card", ".results-item"],
    TITLE: [".uitk-heading-5", ".cruise-title"],
    SHIP: [".ship-name"],
    LINE: [".line-name"],
    PRICE: [".uitk-text", ".price"],
    DURATION: [".duration"],
    ITINERARY: [".itinerary"],
    DEPARTURE: [".departure"],
    RATING: [".rating"],
    DATE: [".sail-date"],
    LINK: ["a.uitk-link", "a.details-link"],
    NEXT: ["a.next", "button.next"],
  },
  "vacationstogo.com": {
    CONTAINER: ["table#MainResults tr[valign='top']"],
    TITLE: ["td:nth-child(2) b"],
    SHIP: ["td:nth-child(2)"],
    LINE: ["td:nth-child(1)"],
    PRICE: ["td:nth-child(6)"],
    DURATION: ["td:nth-child(3)"],
    ITINERARY: ["td:nth-child(4)"],
    DEPARTURE: ["td:nth-child(5)"],
    RATING: [],
    DATE: [],
    LINK: ["td:nth-child(2) a"],
    NEXT: ["a:contains('Next')"],
  },
  "cruisemapper.com": {
    CONTAINER: [".cruise-card", ".itinerary-list li"],
    TITLE: [".card-title", ".ship-name"],
    SHIP: [".ship-name"],
    LINE: [".company-name"],
    PRICE: [],
    DURATION: [".duration"],
    ITINERARY: [".itinerary", ".ports-list"],
    DEPARTURE: [".departure-port"],
    RATING: [],
    DATE: [".sailing-date"],
    LINK: ["a", "a.card-link"],
    NEXT: ["a.next"],
  },
  "msccruisesusa.com": {
    CONTAINER: [".cruise-result-list__item"],
    TITLE: [".cruise-card__title"],
    SHIP: [".cruise-card__ship-name"],
    LINE: [],
    PRICE: [".price-box__price"],
    DURATION: [".cruise-card__cruise-length"],
    ITINERARY: [".cruise-card__ports-of-call"],
    DEPARTURE: [".cruise-card__departure-port"],
    RATING: [],
    DATE: [".cruise-card__departure-date"],
    LINK: ["a.cruise-card__link"],
    NEXT: [".pagination__next"],
  },
};

// --- Helpers ---
function getSiteConfig(url: string) {
  const domain = Object.keys(SITE_CONFIGS).find((d) => url.includes(d));
  if (!domain) return null;
  return SITE_CONFIGS[domain as keyof typeof SITE_CONFIGS];
}

function pickText($el: any, selectors: string[]) {
  for (const sel of selectors) {
    const txt = $el.find(sel).first().text().trim();
    if (txt) return txt;
  }
  return null;
}

function pickAttr($el: any, selectors: string[], attr: string) {
  for (const sel of selectors) {
    const val = $el.find(sel).first().attr(attr);
    if (val) return val;
  }
  return null;
}

function parseResults(html: string, config: any) {
  const $ = cheerio.load(html);
  let results: any[] = [];
  for (const sel of config.CONTAINER) {
    $(sel).each((_, el) => {
      const $el = $(el);
      results.push({
        title: pickText($el, config.TITLE),
        ship: pickText($el, config.SHIP),
        line: pickText($el, config.LINE),
        price: pickText($el, config.PRICE),
        duration: pickText($el, config.DURATION),
        itinerary: pickText($el, config.ITINERARY),
        departure: pickText($el, config.DEPARTURE),
        rating: pickText($el, config.RATING),
        date: pickText($el, config.DATE),
        link: pickAttr($el, config.LINK, "href"),
      });
    });
  }
  // Filter out empty results
  return results.filter(r => r.title);
}


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sourceUrl = searchParams.get("url");

  if (!sourceUrl) {
    return NextResponse.json({ error: "Missing 'url' query parameter" }, { status: 400 });
  }

  const config = getSiteConfig(sourceUrl);
  if (!config) {
    return NextResponse.json({ error: "Unsupported domain" }, { status: 400 });
  }

  let browser = null;
  try {
    console.log("Launching Puppeteer with @sparticuz/chromium...");

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');
    
    console.log(`Navigating to ${sourceUrl}...`);
    await page.goto(sourceUrl, { waitUntil: "networkidle2", timeout: 60000 });

    const html = await page.content();
    console.log("Page content retrieved. Parsing results...");

    const results = parseResults(html, config);
    console.log(`Found ${results.length} results.`);
    
    const payload = {
      source: sourceUrl,
      fetchedAt: new Date().toISOString(),
      count: results.length,
      results,
    };
    
    return NextResponse.json(payload);

  } catch (err: any) {
    console.error("Scraper error:", err.message);
    return NextResponse.json({ error: "Failed to scrape data.", details: err.message }, { status: 500 });
  } finally {
    if (browser) {
      await browser.close();
      console.log("Browser closed.");
    }
  }
}
