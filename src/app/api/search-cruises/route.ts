
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const searchCriteria = await request.json();

        const response = await fetch('https://www.cruisemapper.com/api/v2/c/c', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
            body: JSON.stringify(searchCriteria),
        });

        if (!response.ok) {
            throw new Error('Failed to execute cruise search');
        }

        const results = await response.json();
        return NextResponse.json(results);

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
