'use client';

import { useState } from 'react';

interface ScrapingResult {
  success: boolean;
  data?: any;
  error?: string;
  responseSize?: number;
}

export default function TravelScraper() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScrapingResult | null>(null);
  const [customUrl, setCustomUrl] = useState('');

  const cruiseSites = {
    msc: 'https://www.msccruises.com/en-us/special-offers',
    carnival: 'https://www.carnival.com/cruise-deals',
    royal: 'https://www.royalcaribbean.com/cruise-deals'
  };

  const scrapeSite = async (url: string) => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Free HTTPS Cruise Scraper</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Select Cruise Site</h3>
        <div className="space-y-2">
          {Object.entries(cruiseSites).map(([key, url]) => (
            <button
              key={key}
              onClick={() => scrapeSite(url)}
              disabled={isLoading}
              className="w-full p-3 border rounded hover:bg-gray-50 disabled:opacity-50 text-left"
            >
              <div className="font-medium">{key.toUpperCase()}</div>
              <div className="text-sm text-gray-500">{url}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Custom URL</h3>
        <div className="flex gap-3">
          <input
            type="url"
            placeholder="https://example.com"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="flex-1 p-3 border rounded"
          />
          <button
            onClick={() => customUrl && scrapeSite(customUrl)}
            disabled={isLoading || !customUrl.startsWith('https://')}
            className="bg-blue-500 text-white px-6 py-3 rounded disabled:opacity-50"
          >
            {isLoading ? 'Scraping...' : 'Scrape'}
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-6 border rounded p-4">
          {result.success ? (
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-3">
                Success! ({result.responseSize} bytes)
              </h3>

              <div>
                <h4 className="font-medium">Title:</h4>
                <p>{result.data?.title}</p>
              </div>

              {result.data?.cruiseDeals?.foundDeals && (
                <div className="mt-4">
                  <h4 className="font-medium">Cruise Deals Found:</h4>
                  {result.data.cruiseDeals.prices?.length > 0 && (
                    <div>
                      <strong>Prices:</strong>
                      {result.data.cruiseDeals.prices.map((price: string, i: number) => (
                        <span key={i} className="text-green-600 mr-2">{price}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4">
                <h4 className="font-medium">Content:</h4>
                <div className="max-h-40 overflow-y-auto bg-gray-50 p-3 rounded text-sm">
                  {result.data?.text?.substring(0, 1000)}...
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-red-600">Failed</h3>
              <p className="text-red-500">{result.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}