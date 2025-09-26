
"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Loader2, Ship, Anchor, Calendar as CalendarIcon, Users, DollarSign, Search, MapPin, Sailboat, LinkIcon, ExternalLink } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { toast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

const cruiseSearchSchema = z.object({
  url: z.string().url("Please select a valid website to scrape."),
  // Other fields can be re-added later for more advanced query building
});

type CruiseSearchFormData = z.infer<typeof cruiseSearchSchema>;

interface ScrapedCruise {
  title: string | null;
  ship: string | null;
  line: string | null;
  price: string | null;
  duration: string | null;
  itinerary: string | null;
  departure: string | null;
  rating: string | null;
  date: string | null;
  link: string | null;
}

const SCRAPE_TARGETS = [
    { name: "CruiseCritic.com", url: "https://www.cruisecritic.com/find-a-cruise/" },
    { name: "Cruises.com", url: "https://www.cruises.com/" },
    { name: "Cruise.com", url: "https://www.cruise.com/" },
    { name: "MSC Cruises", url: "https://www.msccruisesusa.com/cruise/deals" },
];

export function CruiseSearch() {
  const [results, setResults] = useState<ScrapedCruise[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<CruiseSearchFormData>({
    resolver: zodResolver(cruiseSearchSchema),
    defaultValues: {
      url: SCRAPE_TARGETS[0].url,
    },
  });
  
  const onSubmit = async (data: CruiseSearchFormData) => {
    setIsLoading(true);
    setResults(null);
    setError(null);

    try {
        const response = await fetch(`/api/scrape-cruises?url=${encodeURIComponent(data.url)}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || `Scraping failed with status ${response.status}`);
        }

        const scrapedData = await response.json();

        if (scrapedData.results && scrapedData.results.length > 0) {
            setResults(scrapedData.results);
        } else {
            toast({ title: "No Results", description: "The scraper couldn't find any cruise results on that page."});
        }

    } catch(err) {
        console.error("Scraper fetch failed:", err);
        const errorMessage = (err as Error).message || "An unknown error occurred during scraping.";
        setError(errorMessage);
        toast({ title: "Scraping Error", description: errorMessage, variant: "destructive"});
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Live Cruise Scraper</CardTitle>
            <CardDescription>
              Select a website and scrape live cruise deals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              <div className="space-y-2">
                <Label>Website to Scrape</Label>
                <Controller name="url" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger><SelectValue placeholder="Select a website" /></SelectTrigger>
                        <SelectContent>
                            {SCRAPE_TARGETS.map(site => <SelectItem key={site.url} value={site.url}>{site.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                )} />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Scrape Live Deals
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Scraped Results</CardTitle>
                <CardDescription>Live data pulled directly from the selected website.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[calc(100vh-16rem)] pr-4 -mr-4">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                            <p className="text-lg font-semibold">Launching headless browser...</p>
                            <p>Scraping live data. This can take up to a minute.</p>
                        </div>
                    )}
                    {error && (
                         <div className="flex flex-col items-center justify-center h-full text-destructive text-center p-4">
                            <p className='font-semibold'>Scraping Error</p>
                             <p>{error}</p>
                         </div>
                    )}
                    {!isLoading && !results && !error && (
                         <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-4">
                            <Sailboat className="h-16 w-16 mb-4"/>
                            <p className='font-semibold text-lg'>Your scraped cruise results will appear here.</p>
                            <p>Select a website and click "Scrape Live Deals".</p>
                        </div>
                    )}
                    {results && (
                        <div className="space-y-4">
                            {results.map((cruise, index) => (
                                <Card key={index} className="overflow-hidden">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-xl">{cruise.title || "Untitled Cruise"}</CardTitle>
                                                <CardDescription>{cruise.line} - {cruise.ship}</CardDescription>
                                            </div>
                                             {cruise.price && <Badge variant="secondary">{cruise.price}</Badge>}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4 text-sm">
                                       {cruise.itinerary && <p><span className="font-semibold">Itinerary:</span> {cruise.itinerary}</p>}
                                       <div className="flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground">
                                           {cruise.duration && <div className="flex items-center gap-1"><CalendarIcon size={14} /><span>{cruise.duration}</span></div>}
                                           {cruise.departure && <div className="flex items-center gap-1"><Anchor size={14} /><span>{cruise.departure}</span></div>}
                                           {cruise.date && <div className="flex items-center gap-1"><CalendarIcon size={14} /><span>{cruise.date}</span></div>}
                                       </div>
                                    </CardContent>
                                    {cruise.link && (
                                    <CardFooter>
                                        <Button asChild className="w-full" variant="outline">
                                            <a href={cruise.link.startsWith('http') ? cruise.link : `https://www.cruisecritic.com${cruise.link}`} target="_blank" rel="noopener noreferrer">
                                                View on Source Site <ExternalLink className="ml-2" size={14}/>
                                            </a>
                                        </Button>
                                    </CardFooter>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
