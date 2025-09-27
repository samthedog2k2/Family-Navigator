import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    // Validate HTTPS URL
    if (!url.startsWith('https://')) {
      throw new Error('Only HTTPS URLs are supported for security');
    }
    
    console.log(`🔍 Scraping HTTPS site: ${url}`);
    
    // Advanced HTTPS request with proper headers
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'Connection': 'keep-alive'
      },
      redirect: 'follow',
      // Important: Handle HTTPS certificates properly
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTPS request failed: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    console.log(`✅ Successfully fetched ${html.length} characters`);
    
    // Parse HTML content without browser
    const parsedData = parseHtmlContent(html, url);
    
    return NextResponse.json({ 
      success: true, 
      data: parsedData,
      url: url,
      timestamp: new Date().toISOString(),
      method: 'Free HTTPS Scraping',
      responseSize: html.length
    });
    
  } catch (error) {
    console.error('HTTPS Scraping error:', error);
    
    // Specific error handling
    let errorMessage = error.message;
    if (error.name === 'AbortError') {
      errorMessage = 'Request timeout - site took too long to respond';
    } else if (error.message.includes('fetch')) {
      errorMessage = 'Network error - site may be blocking requests or down';
    }
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
      details: 'Free HTTPS scraping - no browser dependencies'
    }, { status: 500 });
  }
}

// Advanced HTML parsing function
function parseHtmlContent(html: string, url: string) {
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'No title found';
  
  // Extract meta description
  const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);
  const description = descMatch ? descMatch[1].trim() : '';
  
  // Remove scripts and styles
  let cleanHtml = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '');
  
  // Extract visible text
  const textContent = cleanHtml
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Extract links
  const linkMatches = html.match(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi) || [];
  const links = linkMatches.slice(0, 20).map(link => {
    const hrefMatch = link.match(/href="([^"]*)"/i);
    const textMatch = link.match(/>([^<]*)</);
    return {
      url: hrefMatch ? hrefMatch[1] : '',
      text: textMatch ? textMatch[1].trim() : ''
    };
  });
  
  // Extract images
  const imgMatches = html.match(/<img[^>]*src="([^"]*)"[^>]*>/gi) || [];
  const images = imgMatches.slice(0, 10).map(img => {
    const srcMatch = img.match(/src="([^"]*)"/i);
    const altMatch = img.match(/alt="([^"]*)"/i);
    return {
      src: srcMatch ? srcMatch[1] : '',
      alt: altMatch ? altMatch[1] : ''
    };
  });
  
  // Cruise-specific parsing for your use case
  const cruiseDeals = extractCruiseDeals(html);
  
  return {
    title,
    description,
    text: textContent.substring(0, 5000),
    html: cleanHtml.substring(0, 10000),
    links: links.slice(0, 10),
    images: images.slice(0, 5),
    cruiseDeals,
    wordCount: textContent.split(' ').length,
    domain: new URL(url).hostname
  };
}

// Cruise-specific content extraction
function extractCruiseDeals(html: string) {
  const deals = [];
  
  // Look for price patterns
  const priceMatches = html.match(/\$[\d,]+/g) || [];
  const prices = [...new Set(priceMatches)].slice(0, 10);
  
  // Look for date patterns
  const dateMatches = html.match(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b/gi) || [];
  const dates = [...new Set(dateMatches)].slice(0, 10);
  
  // Look for destination patterns
  const destMatches = html.match(/(?:Caribbean|Mediterranean|Alaska|Hawaii|Bahamas|Mexico|Europe|Asia)/gi) || [];
  const destinations = [...new Set(destMatches)].slice(0, 5);
  
  return {
    prices,
    dates,
    destinations,
    foundDeals: prices.length > 0 || dates.length > 0
  };
}
