
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
    return NextResponse.json({ error: 'API key is not configured.' }, { status: 500 });
  }

  try {
    // First, search for the show by title to get its ID
    const searchUrl = `https://streaming-availability.p.rapidapi.com/search/title?title=${encodeURIComponent(title)}&country=us&show_type=all&output_language=en`;
    const searchOptions = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'streaming-availability.p.rapidapi.com'
      }
    };

    const searchResponse = await fetch(searchUrl, searchOptions);
    if (!searchResponse.ok) {
        const errorBody = await searchResponse.text();
        console.error('RapidAPI Search Error:', errorBody);
        throw new Error(`Failed to search for show. Status: ${searchResponse.status}`);
    }
    const searchData = await searchResponse.json();
    
    const show = searchData.result?.[0];
    if (!show) {
      return NextResponse.json({ services: [] });
    }

    // Now, get streaming availability using the ID
    const showId = show.tmdbId;
    const showType = show.type;
    const detailsUrl = `https://streaming-availability.p.rapidapi.com/shows/v2/${showType}/${showId}?output_language=en&country=us`;
    const detailsOptions = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'streaming-availability.p.rapidapi.com'
      }
    };
    
    const detailsResponse = await fetch(detailsUrl, detailsOptions);
    if (!detailsResponse.ok) {
        const errorBody = await detailsResponse.text();
        console.error('RapidAPI Details Error:', errorBody);
        throw new Error(`Failed to get show details. Status: ${detailsResponse.status}`);
    }
    const detailsData = await detailsResponse.json();

    const services = detailsData.result?.streamingInfo?.us?.map((service: any) => ({
        name: service.service,
        type: service.streamingType,
        quality: service.quality,
        link: service.link
    })) || [];


    return NextResponse.json({ services });

  } catch (error: any) {
    console.error(`Streaming availability error:`, error);
    return NextResponse.json({ error: error.message || 'Failed to fetch streaming availability.' }, { status: 500 });
  }
}
