
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

// This is a placeholder for the actual API call. 
const fetchDeals = async (query: string) => {
  console.log(`Searching for deals with query: ${query}`);
  // Simulate an API call with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (query.toLowerCase().includes('cruise')) {
      return [
          { title: '7-Night Caribbean Cruise', discount: '15% Off', source: 'CruiseDirect' },
          { title: 'Kids Sail Free on Select Sailings', discount: 'Free', source: 'MSC Cruises' },
      ];
  }
  return [{ title: 'No deals found for this query', discount: '', source: 'System' }];
};

export function DealFinder() {
  const [query, setQuery] = useState('cruise deals 2025');

  const { data, refetch, isFetching } = useQuery({
    queryKey: ['deals', query],
    queryFn: () => fetchDeals(query),
    enabled: false, // The query will not run automatically
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deal & Coupon Finder</CardTitle>
        <CardDescription>Search for the latest travel promotions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input 
            type="text" 
            placeholder="e.g., Caribbean cruise, flight deals"
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? <Loader2 className="animate-spin mr-2" /> : null}
            {isFetching ? 'Searching...' : 'Find Deals'}
          </Button>
        </div>
        <div className="mt-4">
          {isFetching && <p className="text-muted-foreground">Looking for the best deals...</p>}
          {data && (
            <ul className="list-disc space-y-2 pl-5 mt-2">
              {data.map((d, i) => <li key={i}><b>{d.title}</b> ({d.discount}) - <i>{d.source}</i></li>)}
            </ul>
          )}
          <p className="mt-4 text-sm text-muted-foreground italic">
            Insider Tip: Check sites like Vacations To Go for last-minute deals, often at significant discounts.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
