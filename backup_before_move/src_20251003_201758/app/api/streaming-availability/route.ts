
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');

  if (!title) {
    return NextResponse.json({ error: 'Title parameter is required' }, { status: 400 });
  }

  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    console.error('RAPIDAPI_KEY is not configured in .env file.');
    return NextResponse.json({ error: 'API key is not configured.' }, { status: 500 });
  }

  try {
    const url = `https://streaming-availability.p.rapidapi.com/search/basic?country=us&service=netflix&type=movie&query=${encodeURIComponent(title)}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'streaming-availability.p.rapidapi.com'
      }
    };

    const response = await fetch(url, options);

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`RapidAPI Error (status: ${response.status}):`, errorBody);
        throw new Error(`Failed to fetch streaming data. The external API may be down or the key is invalid.`);
    }

    const data = await response.json();
    
    // The search/basic endpoint returns results differently. 
    // We'll look through the results for a close match.
    const show = data.results?.[0];

    if (!show || !show.streamingInfo || !show.streamingInfo.us) {
        console.log(`No streaming info found for title: ${title}`);
        return NextResponse.json({ services: [] });
    }

    const services = Object.entries(show.streamingInfo.us).flatMap(([service, availability]) => 
        (availability as any[]).map((item: any) => ({
            name: service,
            type: item.type,
            quality: item.quality,
            link: item.link
        }))
    );

    return NextResponse.json({ services });

  } catch (error: any) {
    console.error(`Streaming availability route error:`, error);
    return NextResponse.json({ error: error.message || 'Failed to fetch streaming availability.' }, { status: 500 });
  }
}
