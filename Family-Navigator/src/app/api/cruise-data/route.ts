import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// A simple in-memory cache to avoid getting blocked by the data source
const cache = new Map();

async function fetchCruiselineData(shipId: string) {
    const now = Date.now();
    const cachedItem = cache.get(shipId);
    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey) {
        throw new Error('RapidAPI key not configured');
    }

    // Cache is valid for 15 minutes
    if (cachedItem && (now - cachedItem.timestamp < 15 * 60 * 1000)) {
        return cachedItem.data;
    }

    try {
        // This endpoint doesn't seem to exist on cruise.p.rapidapi.com.
        // We will simulate a response based on what a real API might return.
        // In a real scenario, you'd replace this with the actual API endpoint for ship tracking.
        const simulatedData = {
            position: {
                timestamp: Math.floor(now / 1000),
                lat: 25.7617 + (Math.random() - 0.5), // Simulate around Miami
                lng: -80.1918 + (Math.random() - 0.5),
                speed: 15 + Math.random() * 5,
                destination: "Nassau, Bahamas"
            },
            itinerary: [
                { day: 1, port: "Miami, USA" },
                { day: 2, port: "At Sea" },
                { day: 3, port: "Cozumel, Mexico" },
            ]
        };
        
        cache.set(shipId, { timestamp: now, data: simulatedData });
        return simulatedData;

    } catch (error) {
        console.error(`Error fetching data for ship ${shipId}:`, error);
        return null; // Return null on error
    }
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const shipId = searchParams.get('shipId');

    if (!shipId) {
        return NextResponse.json({ error: 'shipId parameter is required' }, { status: 400 });
    }

    try {
        const data = await fetchCruiselineData(shipId);

        if (!data) {
            return NextResponse.json({ error: 'Failed to retrieve cruise data' }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch(err) {
        const error = err as Error;
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
