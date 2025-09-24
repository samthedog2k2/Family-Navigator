import { NextResponse } from 'next/server';
import { scrapeCruiseCritic, ScraperInput } from '@/services/cruise-critic-scraper';

export async function POST(request: Request) {
    try {
        const body: ScraperInput = await request.json();

        if (!body.destination) {
            return NextResponse.json({ error: "A destination is required." }, { status: 400 });
        }
        
        const results = await scrapeCruiseCritic(body);
        return NextResponse.json({ cruises: results });

    } catch (error: any) {
        console.error("Error in scrape-cruise-critic route:", error);
        return NextResponse.json({ error: error.message || "An unknown error occurred during scraping." }, { status: 500 });
    }
}
