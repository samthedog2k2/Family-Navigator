
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
    const endpoints = ['ports', 'lines', 'ships', 'regions'];
    
    try {
        const results = await Promise.allSettled(
            endpoints.map(ep => fetchFilterData(ep.slice(0, -1))) // 'ports' -> 'port'
        );

        const data: { [key: string]: any } = {};
        const errors: string[] = [];

        results.forEach((result, index) => {
            const endpointName = endpoints[index];
            if (result.status === 'fulfilled') {
                data[endpointName] = result.value;
            } else {
                console.error(`Error fetching ${endpointName}:`, result.reason);
                errors.push(result.reason.message || `Failed to load ${endpointName}`);
            }
        });

        if (errors.length === endpoints.length) {
            // All requests failed
            return NextResponse.json({ error: 'Failed to load any filter data. The external service may be down.' }, { status: 500 });
        }

        return NextResponse.json({ data, errors: errors.length > 0 ? errors : undefined });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
