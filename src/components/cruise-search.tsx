"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Loader2, Ship, Anchor, Calendar as CalendarIcon, Users, DollarSign, Search, MapPin, Sailboat, Trash2, PlusCircle, Wand2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { toast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format, addDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { searchCruises, CruiseSearchInput } from "@/ai/flows/cruise-search";
import type { Cruise } from "@/ai/flows/cruise-search-types";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { shipData } from "@/data/cruise-ship-data";
import { InsiderTips } from "./insider-tips";
import { PackingGuide } from "./packing-guide";
import { BudgetEstimator } from "./budget-estimator";

const cruiseSearchSchema = z.object({
  tripType: z.enum(["family", "couple"]).default("family"),
  destination: z.string().min(1, "Destination is required."),
  departurePort: z.string().optional(),
  dates: z.object({
    from: z.date(),
    to: z.date(),
  }),
  length: z.string().optional(),
  ship: z.string().optional(),
  passengers: z.object({
    adults: z.array(z.object({ age: z.coerce.number().min(18) })).min(1),
    children: z.array(z.object({ age: z.coerce.number().min(0).max(17) })),
  }),
  room: z.string().default("balcony"),
});

type CruiseSearchFormData = z.infer<typeof cruiseSearchSchema>;

interface FilterData {
    ports: {id: string, name: string}[];
    ships: {id: string, name: string}[];
    regions: {id: string, name: string}[];
}

export function CruiseSearch() {
  const [results, setResults] = useState<Cruise[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterData | null>(null);
  const [tripType, setTripType] = useState<'family' | 'couple'>('family');


  const { control, handleSubmit, watch, setValue } = useForm<CruiseSearchFormData>({
    resolver: zodResolver(cruiseSearchSchema),
    defaultValues: {
      tripType: 'family',
      destination: 'CARIB', // Default to Caribbean
      dates: {
        from: new Date(),
        to: addDays(new Date(), 7),
      },
      passengers: {
        adults: [{ age: 40 }, { age: 38 }],
        children: [{ age: 10 }, { age: 7 }],
      },
      room: 'balcony',
      ship: 'MSCCoast' // Default to MSC Magnifica
    },
  });

  const { fields: adultFields, append: appendAdult, remove: removeAdult } = useFieldArray({ control, name: "passengers.adults" });
  const { fields: childFields, append: appendChild, remove: removeChild } = useFieldArray({ control, name: "passengers.children" });
  const passengerCounts = watch("passengers");

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

  const onSubmit = async (data: CruiseSearchFormData) => {
    setIsLoading(true);
    setResults(null);
    setError(null);

    const passengerSummary = `${data.passengers.adults.length} adults (ages ${data.passengers.adults.map(p => p.age).join(', ')}) and ${data.passengers.children.length} children (ages ${data.passengers.children.map(p => p.age).join(', ')})`;
    const destinationName = filters?.regions.find(r => r.id === data.destination)?.name || data.destination;

    const query = `
      Find a cruise for a ${data.tripType} trip with ${passengerSummary}.
      Destination Region: ${destinationName}.
      ${data.departurePort ? `Departure Port: ${data.departurePort}.` : ''}
      Travel Dates: Between ${format(data.dates.from, 'LLLL d, yyyy')} and ${format(data.dates.to, 'LLLL d, yyyy')}.
      ${data.length ? `Trip Length: ${data.length}.` : ''}
      ${data.ship ? `Preferred Ship: ${data.ship}.` : ''}
      Room Type: ${data.room}.
      Provide realistic itineraries and pricing based on this criteria, using your knowledge of real-world cruise data.
    `;

    try {
      const searchResult = await searchCruises({ query });
      
      if (!searchResult || searchResult.cruises.length === 0) {
        setError("No cruises found for your criteria. Please try a different search.");
      } else {
        setResults(searchResult.cruises);
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
               {/* Trip Type */}
              <div className="space-y-2">
                  <Label>Trip Type</Label>
                    <Controller
                      name="tripType"
                      control={control}
                      render={({ field }) => (
                      <ToggleGroup type="single" variant="outline" onValueChange={(value) => { if(value) { field.onChange(value); setTripType(value as 'family' | 'couple')}}} defaultValue={field.value} className="w-full grid grid-cols-2">
                          <ToggleGroupItem value="family">Family</ToggleGroupItem>
                          <ToggleGroupItem value="couple">Couple</ToggleGroupItem>
                      </ToggleGroup>
                      )}
                  />
              </div>
              
              {/* Destination */}
               <div className="space-y-2">
                    <Label>Destination</Label>
                    <Controller name="destination" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a destination" />
                            </SelectTrigger>
                            <SelectContent>
                                {filters?.regions.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    )} />
                </div>

                 {/* Departure Port */}
               <div className="space-y-2">
                    <Label>Departure Port (Optional)</Label>
                    <Controller name="departurePort" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Any Port" />
                            </SelectTrigger>
                            <SelectContent>
                                {filters?.ports.map(p => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    )} />
                </div>
                
                {/* Dates */}
                <div className="space-y-2">
                    <Label>Dates</Label>
                    <Controller name="dates" control={control} render={({ field }) => (
                         <Popover>
                            <PopoverTrigger asChild>
                               <Button
                                  variant={"outline"}
                                  className="w-full justify-start text-left font-normal"
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value?.from ? (
                                    field.value.to ? (
                                    <>
                                        {format(field.value.from, "LLL dd, y")} -{" "}
                                        {format(field.value.to, "LLL dd, y")}
                                    </>
                                    ) : (
                                    format(field.value.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Pick a date range</span>
                                )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="range"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    )} />
                </div>

                {/* Length */}
                <div className="space-y-2">
                    <Label>Length of Cruise</Label>
                    <Controller name="length" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Any length" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="3-5 nights">3-5 Nights</SelectItem>
                                <SelectItem value="6-9 nights">6-9 Nights</SelectItem>
                                <SelectItem value="10-14 nights">10-14 Nights</SelectItem>
                                <SelectItem value="15+ nights">15+ Nights</SelectItem>
                            </SelectContent>
                        </Select>
                    )} />
                </div>

                {/* Ship */}
                <div className="space-y-2">
                    <Label>Ship (Optional)</Label>
                    <Controller name="ship" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Any ship" /></SelectTrigger>
                            <SelectContent>
                                {shipData.map(s => <SelectItem key={s.id} value={s.name}>{s.name} ({s.cruiseLine})</SelectItem>)}
                            </SelectContent>
                        </Select>
                    )} />
                </div>

                {/* Passengers */}
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
                                    <Button type="button" variant="outline" size="sm" onClick={() => appendAdult({age: 30})} className="mt-2 text-xs h-7"><PlusCircle className="mr-2 h-3 w-3"/>Add Adult</Button>
                                </div>
                                <div>
                                    <h4 className="font-medium">Children</h4>
                                    {childFields.map((field, index) => (
                                        <div key={field.id} className="flex items-center gap-2 mt-2">
                                            <Label className="w-20">{index === 0 ? 'Ethan' : `Elle`}</Label>
                                            <Controller name={`passengers.children.${index}.age`} control={control} render={({ field }) => <Input type="number" {...field} className="w-24" />} />
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeChild(index)}><Trash2 className="h-4 w-4"/></Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={() => appendChild({age: 10})} className="mt-2 text-xs h-7"><PlusCircle className="mr-2 h-3 w-3"/>Add Child</Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
                
                {/* Room Type */}
                <div className="space-y-2">
                    <Label>Room Type</Label>
                     <Controller
                        name="room"
                        control={control}
                        render={({ field }) => (
                        <ToggleGroup type="single" variant="outline" onValueChange={field.onChange} defaultValue={field.value} className="w-full grid grid-cols-2">
                            <ToggleGroupItem value="interior">Interior</ToggleGroupItem>
                            <ToggleGroupItem value="oceanview">Oceanview</ToggleGroupItem>
                            <ToggleGroupItem value="balcony">Balcony</ToggleGroupItem>
                            <ToggleGroupItem value="suite">Suite</ToggleGroupItem>
                        </ToggleGroup>
                        )}
                    />
                </div>
              
              <Button type="submit" className="w-full" disabled={isLoading || !filters}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Find Cruises with AI
              </Button>
            </form>
          </CardContent>
        </Card>

        <BudgetEstimator mode={tripType} />
      </div>

      <div className="lg:col-span-2 space-y-6">
        <Card className="h-full">
            <CardHeader>
                <CardTitle>AI-Powered Results</CardTitle>
                <CardDescription>Cruises matching your criteria, generated by an expert AI agent.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[calc(100vh-16rem)] pr-4 -mr-4">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                            <p className="text-lg font-semibold">Our AI agent is searching for the best cruises...</p>
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
                            {results.map((cruise, index) => (
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
                                            <div className="flex items-center gap-2"><CalendarIcon className="text-muted-foreground"/> <span>Sails: {cruise.date}</span></div>
                                        </div>
                                         <div className="text-xs text-muted-foreground grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t">
                                            <span><b>Tonnage:</b> {cruise.tonnage?.toLocaleString()} GRT</span>
                                            <span><b>Capacity:</b> {cruise.passengerCapacity?.toLocaleString()} pax</span>
                                            <span><b>Crew:</b> {cruise.crewCapacity?.toLocaleString()}</span>
                                            <span><b>Refurbished:</b> {cruise.lastRefurb || 'N/A'}</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button asChild className="w-full">
                                            <a href={cruise.bookingLink} target="_blank" rel="noopener noreferrer">
                                                View Deal on CruiseDirect
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

    