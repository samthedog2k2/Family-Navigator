
"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Loader2, Ship, Anchor, Calendar as CalendarIcon, Users, DollarSign, Search, MapPin } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

const cruiseSearchSchema = z.object({
  destinations: z.array(z.string()).min(1, "Please select at least one destination."),
  shipType: z.string().optional(),
  departurePort: z.string().optional(),
  shipName: z.string().optional(),
  line: z.string().optional(),
  dateRange: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }).optional(),
  cruiseLength: z.string().optional(),
});

type CruiseSearchFormData = z.infer<typeof cruiseSearchSchema>;

interface CruiseSearchProps {
    onSearch: (data: CruiseSearchFormData) => void;
    isLoading: boolean;
}

export function CruiseSearch({ onSearch, isLoading }: CruiseSearchProps) {
  const [filterData, setFilterData] = useState<any>(null);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<CruiseSearchFormData>({
    resolver: zodResolver(cruiseSearchSchema),
    defaultValues: {
      destinations: ["CARIB"],
      shipType: "ocean",
      cruiseLength: "any"
    },
  });

  useEffect(() => {
    async function loadFilters() {
      const response = await fetch('/api/search-filters');
      const data = await response.json();
      setFilterData(data.data);
    }
    loadFilters();
  }, []);
  
  const dateRange = watch("dateRange");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cruise Finder</CardTitle>
        <CardDescription>
          Use our AI-powered search to find the perfect cruise. Your family's preferences are pre-selected.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSearch)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Destinations */}
            <div className="space-y-2">
              <Label>Destinations</Label>
              <Controller name="destinations" control={control} render={({ field }) => (
                <Select onValueChange={(val) => field.onChange([val])} defaultValue={field.value?.[0]}>
                    <SelectTrigger><SelectValue placeholder="Select Destination" /></SelectTrigger>
                    <SelectContent>
                      {filterData?.regions.map((r: any) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                    </SelectContent>
                </Select>
              )} />
            </div>

            {/* Ship Type */}
            <div className="space-y-2">
              <Label>Ship Type</Label>
               <Controller name="shipType" control={control} render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select Ship Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ocean">Ocean & River</SelectItem>
                      <SelectItem value="ocean_only">Ocean Only</SelectItem>
                      <SelectItem value="river_only">River Only</SelectItem>
                    </SelectContent>
                  </Select>
               )} />
            </div>

            {/* Departure Port */}
            <div className="space-y-2">
              <Label>Departure Port</Label>
              <Controller name="departurePort" control={control} render={({ field }) => (
                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Any Port" /></SelectTrigger>
                    <SelectContent>
                       {filterData?.ports.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
              )} />
            </div>

            {/* Line / Company */}
            <div className="space-y-2">
                <Label>Line / Company</Label>
                <Controller name="line" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger><SelectValue placeholder="Any Line" /></SelectTrigger>
                        <SelectContent>
                            {filterData?.lines.map((l: any) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                )} />
            </div>

             {/* Itinerary Dates */}
            <div className="space-y-2 md:col-span-2">
              <Label>Itinerary Dates</Label>
              <Controller
                name="dateRange"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            `${format(dateRange.from, 'LLL dd, y')} - ${format(dateRange.to, 'LLL dd, y')}`
                          ) : (
                            format(dateRange.from, 'LLL dd, y')
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
                )}
              />
            </div>
            
            {/* Cruise Length */}
             <div className="space-y-2">
              <Label>Cruise Length</Label>
               <Controller name="cruiseLength" control={control} render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Any Length" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any cruise length</SelectItem>
                      <SelectItem value="1-2">1-2 days</SelectItem>
                      <SelectItem value="3-5">3-5 days</SelectItem>
                      <SelectItem value="6-9">6-9 days</SelectItem>
                      <SelectItem value="10-14">10-14 days</SelectItem>
                      <SelectItem value="15+">15+ days</SelectItem>
                    </SelectContent>
                  </Select>
               )} />
            </div>

          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            Find Cruises
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
