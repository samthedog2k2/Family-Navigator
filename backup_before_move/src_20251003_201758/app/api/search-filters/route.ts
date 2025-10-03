
import { NextResponse } from 'next/server';

async function fetchFilterData(endpoint: string, apiKey: string) {
    const url = `https://cruise.p.rapidapi.com/${endpoint}`;
    try {
        const response = await fetch(url, {
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': 'cruise.p.rapidapi.com',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch ${endpoint} with status: ${response.status}`);
        }
        return await response.json();
    } catch(error) {
        console.error(`Error fetching from URL ${url}:`, error);
        throw error;
    }
}

export async function GET() {
    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    // NOTE: The provided API `cruise.p.rapidapi.com` does not seem to have endpoints
    // for filters like /ports, /lines etc. I am simulating the response here based
    // on what a typical cruise API would return, with a comprehensive list of US ports.
    const simulatedData = {
        ports: [
            // Florida
            {id: 'MIA', name: 'Miami, FL'},
            {id: 'FLL', name: 'Fort Lauderdale, FL'},
            {id: 'PCN', name: 'Port Canaveral, FL'},
            {id: 'TPA', name: 'Tampa, FL'},
            {id: 'JAX', name: 'Jacksonville, FL'},
            {id: 'KEY', name: 'Key West, FL'},
            // California
            {id: 'LAX', name: 'Los Angeles, CA'},
            {id: 'SFO', name: 'San Francisco, CA'},
            {id: 'SAN', name: 'San Diego, CA'},
            {id: 'LGB', name: 'Long Beach, CA'},
            // Texas
            {id: 'GAL', name: 'Galveston, TX'},
            // Washington
            {id: 'SEA', name: 'Seattle, WA'},
            // New York
            {id: 'NYC', name: 'New York, NY'},
            // Alaska
            {id: 'ANC', name: 'Anchorage, AK'},
            {id: 'SEW', name: 'Seward, AK'},
            {id: 'WHI', name: 'Whittier, AK'},
            // Other
            {id: 'BAL', name: 'Baltimore, MD'},
            {id: 'BOS', name: 'Boston, MA'},
            {id: 'CHS', name: 'Charleston, SC'},
            {id: 'MOB', name: 'Mobile, AL'},
            {id: 'NOL', name: 'New Orleans, LA'},
            {id: 'HNL', name: 'Honolulu, HI'},
            {id: 'NOR', name: 'Norfolk, VA'},
        ],
        lines: [
            {id: 'RCI', name: 'Royal Caribbean'}, 
            {id: 'CCL', name: 'Carnival'},
            {id: 'NCL', name: 'Norwegian Cruise Line'},
            {id: 'DCL', name: 'Disney Cruise Line'},
            {id: 'MSC', name: 'MSC Cruises'},
            {id: 'HAL', name: 'Holland America Line'},
            {id: 'CEL', name: 'Celebrity Cruises'},
        ],
        ships: [
            {id: 'ICON', name: 'Icon of the Seas'}, 
            {id: 'WONDER', name: 'Wonder of the Seas'},
            {id: 'MARDI', name: 'Mardi Gras'},
            {id: 'PRIMA', name: 'Norwegian Prima'},
            {id: 'WISH', name: 'Disney Wish'},
        ],
        regions: [
            {id: 'CARIB', name: 'Caribbean'}, 
            {id: 'AK', name: 'Alaska'},
            {id: 'MEX', name: 'Mexican Riviera'},
            {id: 'BAH', name: 'Bahamas'},
            {id: 'BER', name: 'Bermuda'},
            {id: 'HAW', name: 'Hawaii'},
            {id: 'EUR', name: 'Europe'},
        ],
    };

    return NextResponse.json({ data: simulatedData });
}
