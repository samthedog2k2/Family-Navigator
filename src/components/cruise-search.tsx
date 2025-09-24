
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Label } from "./ui/label";
import { Loader2, Ship, Anchor, Calendar, Users, DollarSign, Search, MapPin, Sailboat } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { toast } from "@/hooks/use-toast";

interface FilterData {
    ports: {id: string, name: string}[];
}

interface Voyage {
    id: number;
    destination_port: string;
    origin_port: string;
    ship_id: number;
    departure_date: string;
    arrival_date: string;
    price: string;
    currency: string;
}

export function CruiseSearch() {
  const [results, setResults] = useState<Voyage[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterData | null>(null);

  const { control, handleSubmit } = useForm<{ destination_port: string }>({
    resolver: zodResolver(z.object({ destination_port: z.string().min(1) })),
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

  const onSubmit = async (data: { destination_port: string }) => {
    setIsLoading(true);
    setResults(null);
    setError(null);

    try {
        const response = await fetch(`/api/voyages?destination_port=${data.destination_port}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch cruises.");
        }
      const searchResult = await response.json();
      if (!searchResult || searchResult.length === 0) {
        setError("No cruises found for the selected destination. Please try another port.");
      } else {
        setResults(searchResult);
      }
    } catch (err) {
      console.error("Cruise search failed:", err);
      setError((err as Error).message || "Failed to find cruises. Please try a different search.");
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
                    <Label>Destination Port</Label>
                    <Controller name="destination_port" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a destination" />
                            </SelectTrigger>
                            <SelectContent>
                                {filters?.ports.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    )} />
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
                <CardDescription>Real cruise data based on your selection.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[calc(100vh-16rem)] pr-4 -mr-4">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                            <p className="text-lg font-semibold">Searching for live cruise data...</p>
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
                    {results && (
                        <div className="space-y-4">
                            {results.map((voyage) => (
                                <Card key={voyage.id} className="overflow-hidden">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-xl">Voyage to {voyage.destination_port}</CardTitle>
                                                <CardDescription>Ship ID: {voyage.ship_id}</CardDescription>
                                            </div>
                                             <Badge variant="secondary">{voyage.price} {voyage.currency}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2"><Anchor className="text-muted-foreground"/> <span>Departs From: {voyage.origin_port}</span></div>
                                            <div className="flex items-center gap-2"><MapPin className="text-muted-foreground"/> <span>Arrives At: {voyage.destination_port}</span></div>
                                            <div className="flex items-center gap-2"><Calendar className="text-muted-foreground"/> <span>Departs: {new Date(voyage.departure_date).toLocaleDateString()}</span></div>
                                            <div className="flex items-center gap-2"><Calendar className="text-muted-foreground"/> <span>Arrives: {new Date(voyage.arrival_date).toLocaleDateString()}</span></div>
                                        </div>
                                        <Button asChild className="w-full">
                                            <a href="#" target="_blank" rel="noopener noreferrer">
                                                View Deal (Example)
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
