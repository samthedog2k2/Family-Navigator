"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Loader2, Ship, Anchor, Calendar, Users, DollarSign, Search, MapPin } from "lucide-react";
import { searchCruises, CruiseSearchInput, CruiseSearchResult } from "@/ai/flows/cruise-search";
import { ScrollArea } from "./ui/scroll-area";
import { ShipMap } from "./ShipMap";
import { Badge } from "./ui/badge";

const searchSchema = z.object({
  query: z.string().min(10, "Please provide a more detailed description of your desired cruise."),
});

type SearchFormData = z.infer<typeof searchSchema>;

export function CruiseSearch() {
  const [results, setResults] = useState<CruiseSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
        query: "A 7-night family-friendly cruise to the Caribbean from Miami in June 2025, with lots of activities for kids."
    }
  });

  const onSubmit = async (data: SearchFormData) => {
    setIsLoading(true);
    setResults(null);
    setError(null);
    try {
      const searchResult = await searchCruises({ query: data.query });
      setResults(searchResult);
    } catch (err) {
      console.error("Cruise search failed:", err);
      setError("The AI failed to find cruises based on your query. Please try being more specific or try a different search.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Describe Your Ideal Cruise</CardTitle>
            <CardDescription>
              Be descriptive! Mention destinations, dates, duration, number of travelers, and your interests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="query">Your ideal cruise trip</Label>
                <Textarea
                  id="query"
                  rows={6}
                  {...register("query")}
                  placeholder="e.g., A romantic 10-day cruise to the Greek Isles for two people in September, focusing on history and good food."
                />
                {errors.query && <p className="text-sm text-destructive">{errors.query.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
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
                         <div className="flex flex-col items-center justify-center h-full text-destructive">
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
