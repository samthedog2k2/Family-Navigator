
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const destinationPort = searchParams.get('destination_port');

  if (!destinationPort) {
    return NextResponse.json({ error: 'destination_port parameter is required' }, { status: 400 });
  }

  const apiKey = process.env.RAPIDAPI_KEY_DREAMS;
  if (!apiKey) {
    console.error('RAPIDAPI_KEY_DREAMS is not configured in .env file.');
    return NextResponse.json({ error: 'API key is not configured.' }, { status: 500 });
  }

  try {
    const url = `https://dreams-travel-agency.p.rapidapi.com/voyages-get?destination_port=${destinationPort}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'dreams-travel-agency.p.rapidapi.com'
      }
    };

    const response = await fetch(url, options);

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`RapidAPI Error (status: ${response.status}):`, errorBody);
        throw new Error(`Failed to fetch voyage data. The external API may be down or the key is invalid.`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error(`Voyages API route error:`, error);
    return NextResponse.json({ error: error.message || 'Failed to fetch voyage data.' }, { status: 500 });
  }
}
