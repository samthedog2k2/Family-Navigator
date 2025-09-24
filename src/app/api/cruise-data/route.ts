import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// A simple in-memory cache to avoid getting blocked by the data source
const cache = new Map();

async function fetchCruiselineData(shipId: string) {
    const now = Date.now();
    const cachedItem = cache.get(shipId);

    // Cache is valid for 15 minutes
    if (cachedItem && (now - cachedItem.timestamp < 15 * 60 * 1000)) {
        return cachedItem.data;
    }

    try {
        // Fetch both position and itinerary concurrently
        const [posResponse, itinResponse] = await Promise.all([
            fetch(`https://www.cruisemapper.com/ajax/shipposition/${shipId}`, { headers: { 'User-Agent': 'Mozilla/5.0' } }),
            fetch(`https://www.cruisemapper.com/ajax/shipitinerary/${shipId}`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
        ]);

        if (!posResponse.ok || !itinResponse.ok) {
            throw new Error('Failed to fetch data from source');
        }

        const posData = await posResponse.json();
        const itinData = await itinResponse.json();

        const data = {
            position: {
                timestamp: posData.timestamp,
                lat: posData.lat,
                lng: posData.lng,
                speed: posData.speed,
                destination: posData.destination
            },
            itinerary: itinData.itinerary
        };

        cache.set(shipId, { timestamp: now, data });
        return data;

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

    const data = await fetchCruiselineData(shipId);

    if (!data) {
        return NextResponse.json({ error: 'Failed to retrieve cruise data' }, { status: 500 });
    }

    return NextResponse.json(data);
}
