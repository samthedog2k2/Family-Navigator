"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Label } from "./ui/label";
import { Loader2, Ship, Anchor, Calendar, Users, DollarSign, Search, MapPin } from "lucide-react";
import { searchCruises, CruiseSearchResult } from "@/ai/flows/cruise-search";
import { ScrollArea } from "./ui/scroll-area";
import { ShipMap } from "./ShipMap";
import { Badge } from "./ui/badge";
import { toast } from "@/hooks/use-toast";

const searchSchema = z.object({
  region: z.string().optional(),
  port: z.string().optional(),
  line: z.string().optional(),
  ship: z.string().optional(),
});

type SearchFormData = z.infer<typeof searchSchema>;

interface FilterData {
    ports: {id: string, name: string}[];
    lines: {id: string, name: string}[];
    ships: {id: string, name: string}[];
    regions: {id: string, name: string}[];
}

export function CruiseSearch() {
  const [results, setResults] = useState<CruiseSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterData | null>(null);

  const { control, handleSubmit, watch } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
  });

  useEffect(() => {
    async function fetchFilters() {
      try {
        const response = await fetch('/api/search-filters');
        if (!response.ok) throw new Error('Failed to load filter data');
        const data = await response.json();
        setFilters(data.data);
      } catch (err) {
        toast({ title: "Error", description: "Could not load search filters.", variant: "destructive"});
      }
    }
    fetchFilters();
  }, []);

  const onSubmit = async (data: SearchFormData) => {
    setIsLoading(true);
    setResults(null);
    setError(null);
    
    // Construct a natural language query from the form data
    const queryParts = [];
    if(data.region) queryParts.push(`to the ${data.region}`);
    if(data.port) queryParts.push(`departing from ${data.port}`);
    if(data.line) queryParts.push(`on the ${data.line} cruise line`);
    if(data.ship) queryParts.push(`specifically on the ship ${data.ship}`);
    const query = `Find a cruise ${queryParts.join(', ')}. Please provide a few options.`;

    try {
      const searchResult = await searchCruises({ query });
      if (!searchResult.cruises || searchResult.cruises.length === 0) {
        setError("The AI couldn't find any cruises matching your criteria. Please try a broader search.");
      } else {
        setResults(searchResult);
      }
    } catch (err) {
      console.error("Cruise search failed:", err);
      setError((err as Error).message || "The AI failed to find cruises. Please try a different search.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Cruise Finder</CardTitle>
            <CardDescription>
              Select your preferences to find the perfect cruise.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Destination</Label>
                <Controller
                    name="region"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Any Destination" /></SelectTrigger>
                            <SelectContent>
                                {filters?.regions.map(r => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    )}
                />
              </div>
               <div className="space-y-2">
                <Label>Departure Port</Label>
                <Controller
                    name="port"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Any Port" /></SelectTrigger>
                            <SelectContent>
                                {filters?.ports.map(p => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    )}
                />
              </div>
                <div className="space-y-2">
                <Label>Cruise Line</Label>
                <Controller
                    name="line"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Any Cruise Line" /></SelectTrigger>
                            <SelectContent>
                                {filters?.lines.map(l => <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    )}
                />
              </div>
                <div className="space-y-2">
                <Label>Ship</Label>
                <Controller
                    name="ship"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Any Ship" /></SelectTrigger>
                            <SelectContent>
                                {filters?.ships.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    )}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || !filters}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Find Cruises
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Search Results</CardTitle>
                <CardDescription>Based on your query, here are the top AI-suggested cruises.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[600px] pr-4 -mr-4">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                            <p className="text-lg font-semibold">Our AI is searching for your perfect cruise...</p>
                            <p>This may take a moment.</p>
                        </div>
                    )}
                    {error && (
                         <div className="flex flex-col items-center justify-center h-full text-destructive text-center">
                             <p>{error}</p>
                         </div>
                    )}
                    {!isLoading && !results && !error && (
                         <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <p>Your cruise search results will appear here.</p>
                        </div>
                    )}
                    {results?.cruises && (
                        <div className="space-y-4">
                            {results.cruises.map((cruise, index) => (
                                <Card key={index} className="overflow-hidden">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-xl">{cruise.shipName}</CardTitle>
                                                <CardDescription>{cruise.cruiseLine}</CardDescription>
                                            </div>
                                             <Badge variant="secondary">{cruise.price}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-sm">{cruise.itinerary}</p>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2"><Anchor className="text-muted-foreground"/> <span>Departs: {cruise.departurePort}</span></div>
                                            <div className="flex items-center gap-2"><Calendar className="text-muted-foreground"/> <span>Date: {cruise.date}</span></div>
                                        </div>
                                         <div className="h-[200px] w-full rounded-md overflow-hidden border">
                                            <ShipMap lat={cruise.lat} lng={cruise.lng} />
                                        </div>
                                        <Button asChild className="w-full">
                                            <a href={cruise.bookingLink} target="_blank" rel="noopener noreferrer">
                                                View Deal
                                            </a>
                                        </Button>
                                    </CardContent>
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
