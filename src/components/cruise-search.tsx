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
import { Loader2, Ship, Anchor, Calendar as CalendarIcon, Users, DollarSign, Search, MapPin, Sailboat, Trash2, PlusCircle, Wand2, SearchIcon } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { toast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { shipData } from "@/data/cruise-ship-data";
import { InsiderTips } from "./insider-tips";
import { PackingGuide } from "./packing-guide";
import { BudgetEstimator } from "./budget-estimator";
import { ShipDetails } from "./ShipDetails";
import type { ScrapedCruiseData } from "@/services/cruise-critic-scraper";


const cruiseSearchSchema = z.object({
  tripType: z.enum(["family", "couple"]).default("family"),
  destination: z.string().min(1, "Destination is required."),
  departurePort: z.string().optional(),
  cruiseLine: z.string().optional(),
  dates: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }).optional(),
  length: z.string().optional(),
  ship: z.string().optional(),
  passengers: z.object({
    adults: z.array(z.object({ age: z.coerce.number().min(18) })).min(1),
    children: z.array(z.object({ age: z.coerce.number().min(0).max(17) })),
  }),
  room: z.string().default("ocean-facing-balcony"),
});

type CruiseSearchFormData = z.infer<typeof cruiseSearchSchema>;

interface FilterData {
    ports: {id: string, name: string}[];
    regions: {id: string, name: string}[];
}

const cruiseLines = [...new Set(shipData.map(ship => ship.cruiseLine))].sort();

export function CruiseSearch() {
  const [results, setResults] = useState<ScrapedCruiseData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterData | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [showDateRange, setShowDateRange] = useState(false);

  const { control, handleSubmit, watch, setValue, resetField } = useForm<CruiseSearchFormData>({
    resolver: zodResolver(cruiseSearchSchema),
    defaultValues: {
      tripType: 'family',
      destination: 'CARIB', 
      passengers: {
        adults: [{ age: 40 }, { age: 38 }],
        children: [{ age: 10 }, { age: 7 }],
      },
      room: 'ocean-facing-balcony',
    },
  });

  const { fields: adultFields, append: appendAdult, remove: removeAdult } = useFieldArray({ control, name: "passengers.adults" });
  const { fields: childFields, append: appendChild, remove: removeChild } = useFieldArray({ control, name: "passengers.children" });
  
  const selectedCruiseLine = watch("cruiseLine");
  const passengerCounts = watch("passengers");
  const tripType = watch("tripType");
  const selectedShipId = watch("ship");

  const availableShips = useMemo(() => {
    if (!selectedCruiseLine) return [];
    return shipData.filter(ship => ship.cruiseLine === selectedCruiseLine).sort((a,b) => b.built - a.built);
  }, [selectedCruiseLine]);
  
  const selectedShipDetails = useMemo(() => {
    if (!selectedShipId) return null;
    return shipData.find(ship => ship.id === selectedShipId);
  }, [selectedShipId]);


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

  // Reset ship selection when cruise line changes
  useEffect(() => {
    resetField("ship");
  }, [selectedCruiseLine, resetField]);

  const onSubmit = async (data: CruiseSearchFormData) => {
    setIsLoading(true);
    setResults(null);
    setError(null);

    try {
      const response = await fetch('/api/scrape-cruise-critic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: data.destination,
          length: data.length,
          cruiseLine: data.cruiseLine,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Scraping failed');
      }

      const result = await response.json();
      
      if (!result || result.cruises.length === 0) {
        setError("No cruises found for your criteria. Please try a different search.");
      } else {
        setResults(result.cruises);
      }
    } catch (err) {
      console.error("Cruise search failed:", err);
      setError((err as Error).message || "Failed to find cruises. Please try a different search.");
    } finally {
      setIsLoading(false);
    }
  };

  const passengerSummaryText = useMemo(() => {
    const adultCount = passengerCounts.adults.length;
    const childCount = passengerCounts.children.length;
    return `${adultCount} Adult${adultCount !== 1 ? 's' : ''}, ${childCount} Child${childCount !== 1 ? 'ren' : ''}`;
  }, [passengerCounts]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
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
                  <Label>Trip Type</Label>
                    <Controller
                      name="tripType"
                      control={control}
                      render={({ field }) => (
                      <ToggleGroup type="single" variant="outline" onValueChange={(value) => { if(value) field.onChange(value); }} value={field.value} className="w-full grid grid-cols-2">
                          <ToggleGroupItem value="family">Family</ToggleGroupItem>
                          <ToggleGroupItem value="couple">Couple</ToggleGroupItem>
                      </ToggleGroup>
                      )}
                  />
              </div>
              
              <div className="space-y-2">
                <Label>Destination</Label>
                <Controller name="destination" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger><SelectValue placeholder="Select a destination" /></SelectTrigger>
                        <SelectContent>
                            {filters?.regions.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                )} />
              </div>

               <div className="space-y-2">
                    <Label>Departure Port (Optional)</Label>
                    <Controller name="departurePort" control={control} render={({ field }) => (
                        <Select onValueChange={(value) => field.onChange(value === 'any' ? undefined : value)} value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Any Port" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="any">Any Port</SelectItem>
                                {filters?.ports.map(p => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    )} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Cruise Line</Label>
                        <Controller name="cruiseLine" control={control} render={({ field }) => (
                             <Select onValueChange={(value) => field.onChange(value === 'any' ? undefined : value)} value={field.value}>
                                <SelectTrigger><SelectValue placeholder="Any Line" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="any">Any Line</SelectItem>
                                    {cruiseLines.map(line => <SelectItem key={line} value={line}>{line}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )} />
                    </div>
                     <div className="space-y-2">
                        <Label>Ship (Optional)</Label>
                        <Controller name="ship" control={control} render={({ field }) => (
                             <Select onValueChange={(value) => field.onChange(value === 'any' ? undefined : value)} value={field.value} disabled={!selectedCruiseLine}>
                                <SelectTrigger><SelectValue placeholder="Any Ship" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="any">Any Ship</SelectItem>
                                    {availableShips.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.built})</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )} />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <Label>Dates</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className="w-full justify-start text-left font-normal" onClick={() => setShowDateRange(true)}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange?.from ? (
                                    dateRange.to ? (
                                        <>
                                            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(dateRange.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Pick a date range</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                             <Controller
                                name="dates"
                                control={control}
                                render={({ field }) => (
                                     <Calendar
                                        mode="range"
                                        selected={field.value}
                                        onSelect={(range) => {
                                            field.onChange(range);
                                            setDateRange(range);
                                        }}
                                        numberOfMonths={2}
                                    />
                                )}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="space-y-2">
                    <Label>Length of Cruise</Label>
                    <Controller name="length" control={control} render={({ field }) => (
                        <Select onValueChange={(value) => field.onChange(value === 'any' ? undefined : value)} value={field.value}>
                            <SelectTrigger><SelectValue placeholder="Any length" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="any">Any length</SelectItem>
                                <SelectItem value="3-5 nights">3-5 Nights</SelectItem>
                                <SelectItem value="6-9 nights">6-9 Nights</SelectItem>
                                <SelectItem value="10-14 nights">10-14 Nights</SelectItem>
                                <SelectItem value="15+ nights">15+ Nights</SelectItem>
                            </SelectContent>
                        </Select>
                    )} />
                </div>

                <div className="space-y-2">
                    <Label>Passengers</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start font-normal">
                                <Users className="mr-2 h-4 w-4" />
                                {passengerSummaryText}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium">Adults</h4>
                                    {adultFields.map((field, index) => (
                                        <div key={field.id} className="flex items-center gap-2 mt-2">
                                            <Label className="w-20">{index === 0 ? 'Adam' : `Holly`}</Label>
                                            <Controller name={`passengers.adults.${index}.age`} control={control} render={({ field }) => <Input type="number" {...field} className="w-24" />} />
                                            {adultFields.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => removeAdult(index)}><Trash2 className="h-4 w-4"/></Button>}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <h4 className="font-medium">Children</h4>
                                    {childFields.map((field, index) => (
                                        <div key={field.id} className="flex items-center gap-2 mt-2">
                                            <Label className="w-20">{index === 0 ? 'Ethan' : `Elle`}</Label>
                                            <Controller name={`passengers.children.${index}.age`} control={control} render={({ field }) => <Input type="number" {...field} className="w-24" />} />
                                            {childFields.length > 2 && <Button type="button" variant="ghost" size="icon" onClick={() => removeChild(index)}><Trash2 className="h-4 w-4"/></Button>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
                
                <div className="space-y-2">
                    <Label>Room Type</Label>
                     <Controller
                        name="room"
                        control={control}
                        render={({ field }) => (
                        <ToggleGroup type="single" variant="outline" onValueChange={(value) => { if(value) field.onChange(value); }} value={field.value} className="w-full grid grid-cols-2">
                            <ToggleGroupItem value="interior">Interior</ToggleGroupItem>
                            <ToggleGroupItem value="ocean-view">Ocean View</ToggleGroupItem>
                            <ToggleGroupItem value="ocean-facing-balcony">Balcony</ToggleGroupItem>
                            <ToggleGroupItem value="suite">Suite</ToggleGroupItem>
                        </ToggleGroup>
                        )}
                    />
                </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SearchIcon className="mr-2 h-4 w-4" />}
                Find Cruises
              </Button>
            </form>
          </CardContent>
        </Card>
        {selectedShipDetails && <ShipDetails ship={selectedShipDetails} />}
        <BudgetEstimator mode={tripType} />
      </div>

      <div className="lg:col-span-2 space-y-6">
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
                            <p className="text-lg font-semibold">Scraping live data from Cruise Critic...</p>
                            <p>This may take a moment.</p>
                        </div>
                    )}
                    {error && (
                         <div className="flex flex-col items-center justify-center h-full text-destructive text-center p-4">
                            <p className='font-semibold'>Scraping Error</p>
                             <p>{error}</p>
                             <p className='mt-2 text-xs text-muted-foreground'>The website may be blocking the request. Try a different search.</p>
                         </div>
                    )}
                    {!isLoading && !results && !error && (
                         <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-4">
                            <Sailboat className="h-16 w-16 mb-4"/>
                            <p className='font-semibold text-lg'>Your cruise search results will appear here.</p>
                            <p>Fill out the form and click "Find Cruises" to start a live search.</p>
                        </div>
                    )}
                    {results && (
                        <div className="space-y-4">
                            {results.map((cruise, index) => (
                                <Card key={index} className="overflow-hidden">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-xl">{cruise.title}</CardTitle>
                                                <CardDescription>{cruise.duration}</CardDescription>
                                            </div>
                                             <Badge variant="secondary">{cruise.price}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-sm">{cruise.itinerary}</p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button asChild className="w-full">
                                            <a href={cruise.url} target="_blank" rel="noopener noreferrer">
                                                View on Cruise Critic
                                            </a>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
        <div className="grid md:grid-cols-2 gap-6">
            <InsiderTips mode={tripType} />
            <PackingGuide mode={tripType} />
        </div>
      </div>
    </div>
  );
}
