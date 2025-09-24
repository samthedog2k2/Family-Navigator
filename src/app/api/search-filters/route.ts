
import { NextResponse } from 'next/server';

// This function fetches data from a given CruiseMapper filter API endpoint
async function fetchFilterData(endpoint: string) {
    const response = await fetch(`https://www.cruisemapper.com/api/v2/c/f/${endpoint}`, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}`);
    }
    return response.json();
}

export async function GET() {
    try {
        // Fetch all filter data in parallel for maximum efficiency
        const [ports, lines, ships, regions] = await Promise.all([
            fetchFilterData('port'),
            fetchFilterData('line'),
            fetchFilterData('ship'),
            fetchFilterData('region'),
        ]);

        return NextResponse.json({
            ports,
            lines,
            ships,
            regions,
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
