import { NextResponse } from 'next/server';
import { searchCruises } from '@/ai/flows/cruise-search';
import type { CruiseSearchInput } from '@/ai/flows/cruise-search-types';

export async function POST(request: Request) {
    try {
        const body: { query: string } = await request.json();

        if (!body.query) {
            return NextResponse.json({ error: "A query is required to search for cruises." }, { status: 400 });
        }
        
        const results = await searchCruises({ query: body.query });
        return NextResponse.json(results);

    } catch (error: any) {
        console.error("Error in search-cruises route:", error);
        return NextResponse.json({ error: error.message || "An unknown error occurred" }, { status: 500 });
    }
}
