
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Label } from "./ui/label";
import { Loader2, Ship, Anchor, Calendar, Users, DollarSign, Search, MapPin, BedDouble, Wifi, Wine, User, Baby } from "lucide-react";
import { searchCruises, CruiseSearchResult, Cruise } from "@/ai/flows/cruise-search";
import { ScrollArea } from "./ui/scroll-area";
import { ShipMap } from "./ShipMap";
import { Badge } from "./ui/badge";
import { toast } from "@/hooks/use-toast";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar as CalendarPicker } from "@/components/ui/calendar"
import { addDays, format, differenceInDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

const searchSchema = z.object({
  region: z.string().optional(),
  port: z.string().optional(),
  line: z.string().optional(),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  passengers: z.object({
      type: z.enum(["couple", "family"]),
      adults: z.array(z.object({ age: z.number().min(18) })),
      children: z.array(z.object({ age: z.number().min(0).max(17) }))
  }),
  roomType: z.string().default("Ocean Facing Balcony"),
  tipsIncluded: z.boolean().default(true),
  wifiPackage: z.string().default("2 adults, 1 device each"),
  drinkPackage: z.boolean().default(false),
});

type SearchFormData = z.infer<typeof searchSchema>;

interface FilterData {
    ports: {id: string, name: string}[];
    lines: {id: string, name: string}[];
    ships: {id: string, name: string}[];
    regions: {id: string, name: string}[];
}

const durationFilters = [
    { label: "3-4 Days", days: 4 },
    { label: "5-7 Days", days: 7 },
    { label: "7+ Days", days: 10 },
]

export function CruiseSearch() {
  const [results, setResults] = useState<CruiseSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterData | null>(null);

  const { control, handleSubmit, watch, setValue } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
        dateRange: {
            from: new Date(),
            to: addDays(new Date(), 7)
        },
        passengers: {
            type: "family",
            adults: [{age: 54}, {age: 52}],
            children: [{age: 16}, {age: 13}],
        },
        roomType: "Ocean Facing Balcony",
        tipsIncluded: true,
        wifiPackage: "2 adults, 1 device each",
        drinkPackage: false,
    }
  });

  const { fields: adultFields, append: appendAdult, remove: removeAdult } = useFieldArray({ control, name: "passengers.adults" });
  const { fields: childFields, append: appendChild, remove: removeChild } = useFieldArray({ control, name: "passengers.children" });
  
  const passengerType = watch("passengers.type");
  
  useEffect(() => {
    if (passengerType === 'couple') {
        setValue('passengers.adults', [{age: 54}, {age: 52}]);
        setValue('passengers.children', []);
    } else { // family
        setValue('passengers.adults', [{age: 54}, {age: 52}]);
        setValue('passengers.children', [{age: 16}, {age: 13}]);
    }
  }, [passengerType, setValue]);


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
    
    // Construct a detailed natural language query from the form data
    const queryParts = [];
    if(data.region) queryParts.push(`to the ${data.region}`);
    if(data.port) queryParts.push(`departing from ${data.port}`);
    if(data.line) queryParts.push(`on the ${data.line} cruise line`);
    
    queryParts.push(`between ${format(data.dateRange.from, 'PPP')} and ${format(data.dateRange.to, 'PPP')}`);
    
    const duration = differenceInDays(data.dateRange.to, data.dateRange.from);
    queryParts.push(`for about ${duration} days`);

    const adultAges = data.passengers.adults.map(a => a.age).join(', ');
    const childAges = data.passengers.children.map(c => c.age).join(', ');
    queryParts.push(`for ${data.passengers.adults.length} adults (ages ${adultAges}) and ${data.passengers.children.length} children (ages ${childAges})`);

    queryParts.push(`in a ${data.roomType} room`);
    if(data.tipsIncluded) queryParts.push("with tips included");
    if(data.wifiPackage) queryParts.push(`and a Wi-Fi package for ${data.wifiPackage}`);
    if(data.drinkPackage) queryParts.push("with a drink package included");

    const query = `Find a cruise ${queryParts.join(', ')}. Please provide 3-5 realistic options with specific ship names and itineraries. Include estimated pricing based on the party size and preferences.`;

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

  const ShipDetails = ({ cruise }: { cruise: Cruise }) => (
    <Card className="mt-4">
        <CardHeader>
            <CardTitle>{cruise.shipName} Details</CardTitle>
            {/* Placeholder for ship image */}
            <div className="w-full h-40 bg-muted rounded-md mt-2 flex items-center justify-center">
                <p className="text-muted-foreground">Ship Image</p>
            </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2"><Ship size={16} className="text-muted-foreground"/> <span>Tonnage: {cruise.tonnage || 'N/A'}</span></div>
            <div className="flex items-center gap-2"><Calendar size={16} className="text-muted-foreground"/> <span>Last Refurb: {cruise.lastRefurb || 'N/A'}</span></div>
            <div className="flex items-center gap-2"><Users size={16} className="text-muted-foreground"/> <span>Passengers: {cruise.passengerCapacity || 'N/A'}</span></div>
            <div className="flex items-center gap-2"><Users size={16} className="text-muted-foreground"/> <span>Crew: {cruise.crewCapacity || 'N/A'}</span></div>
        </CardContent>
    </Card>
  )

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
                {/* Search Criteria */}
                <div className="space-y-2">
                    <Label>Destination</Label>
                    <Controller name="region" control={control} render={({ field }) => (<Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue placeholder="Any Destination" /></SelectTrigger><SelectContent>{filters?.regions.map(r => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}</SelectContent></Select>)} />
                </div>
                <div className="space-y-2">
                    <Label>Date Range</Label>
                     <Controller name="dateRange" control={control} render={({ field }) => (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value?.from ? (field.value.to ? `${format(field.value.from, "LLL dd, y")} - ${format(field.value.to, "LLL dd, y")}`: format(field.value.from, "LLL dd, y")) : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <CalendarPicker mode="range" selected={field.value} onSelect={field.onChange} numberOfMonths={2} />
                                <div className="p-2 border-t flex gap-2">
                                    {durationFilters.map(d => <Button key={d.label} size="sm" variant="ghost" onClick={() => setValue('dateRange.to', addDays(field.value.from, d.days))}>{d.label}</Button>)}
                                </div>
                            </PopoverContent>
                        </Popover>
                     )} />
                </div>

                <Separator/>

                {/* Passengers */}
                <div className="space-y-2">
                    <Label>Passengers</Label>
                    <Controller name="passengers.type" control={control} render={({ field }) => (
                        <div className="flex items-center space-x-2">
                            <Switch id="passenger-type" checked={field.value === 'family'} onCheckedChange={(checked) => field.onChange(checked ? 'family' : 'couple')} />
                            <Label htmlFor="passenger-type">{field.value === 'family' ? 'Family' : 'Couple'}</Label>
                        </div>
                    )} />
                </div>

                <div className="space-y-2">
                    {adultFields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                            <User className="text-muted-foreground" />
                            <Label>Adult {index + 1} Age</Label>
                            <Controller name={`passengers.adults.${index}.age`} control={control} render={({ field }) => <Input type="number" {...field} className="w-20" />} />
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeAdult(index)} disabled={adultFields.length <= 1}><Trash2 className="h-4 w-4"/></Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => appendAdult({age: 30})}>Add Adult</Button>
                </div>
                 {passengerType === 'family' && (
                    <div className="space-y-2">
                        {childFields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                                <Baby className="text-muted-foreground" />
                                <Label>Child {index + 1} Age</Label>
                                <Controller name={`passengers.children.${index}.age`} control={control} render={({ field }) => <Input type="number" {...field} className="w-20"/>} />
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeChild(index)}><Trash2 className="h-4 w-4"/></Button>
                            </div>
                        ))}
                         <Button type="button" variant="outline" size="sm" onClick={() => appendChild({age: 10})}>Add Child</Button>
                    </div>
                 )}

                <Separator />
                
                {/* Room & Extras */}
                 <div className="space-y-2">
                    <Label>Room Type</Label>
                    <Controller name="roomType" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Interior">Interior</SelectItem>
                                <SelectItem value="Ocean View">Ocean View</SelectItem>
                                <SelectItem value="Ocean Facing Balcony">Ocean Facing Balcony</SelectItem>
                                <SelectItem value="Suite">Suite</SelectItem>
                            </SelectContent>
                        </Select>
                    )} />
                </div>
                <div className="space-y-2">
                    <Controller name="tipsIncluded" control={control} render={({ field }) => ( <div className="flex items-center space-x-2"><Switch id="tips-included" checked={field.value} onCheckedChange={field.onChange} /><Label htmlFor="tips-included">Tips Included</Label></div> )} />
                    <Controller name="drinkPackage" control={control} render={({ field }) => ( <div className="flex items-center space-x-2"><Switch id="drink-package" checked={field.value} onCheckedChange={field.onChange} /><Label htmlFor="drink-package">Drink Package</Label></div> )} />
                </div>
                 <div className="space-y-2">
                    <Label>Wi-Fi Package</Label>
                    <Controller name="wifiPackage" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="None">None</SelectItem>
                                <SelectItem value="1 device total">1 device total</SelectItem>
                                <SelectItem value="1 device per adult">1 device per adult</SelectItem>
                                <SelectItem value="Unlimited devices">Unlimited devices</SelectItem>
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
                <CardDescription>Based on your query, here are the top AI-suggested cruises.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[calc(100vh-16rem)] pr-4 -mr-4">
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
                                        <ShipDetails cruise={cruise} />
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
