
"use client";

import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from 'lucide-react';

interface FilterData {
    ports: { id: string, name: string }[];
    lines: { id: string, name: string }[];
    ships: { id: string, name: string }[];
    regions: { id: string, name: string }[];
}

export function CruiseSearch() {
    const [filters, setFilters] = useState<Partial<FilterData> | null>(null);
    const [selectedLine, setSelectedLine] = useState<string | null>(null);
    const [selectedPort, setSelectedPort] = useState<string | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [selectedShip, setSelectedShip] = useState<string | null>(null);

    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingFilters, setIsLoadingFilters] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadFilters = async () => {
        setIsLoadingFilters(true);
        setError(null);
        try {
            const res = await fetch('/api/search-filters');
            const result = await res.json();

            if (!res.ok) {
                 throw new Error(result.error || 'Failed to load search filters');
            }
            
            if (result.data) {
                setFilters(result.data);
            }

            if (result.errors && result.errors.length > 0) {
                setError(`Could not load some filters: ${result.errors.join(', ')}`);
            }
            
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoadingFilters(false);
        }
    };

    useEffect(() => {
        loadFilters();
    }, []);

    const handleSearch = async () => {
        setIsLoading(true);
        setError(null);
        setResults([]);

        const searchCriteria = {
            ...(selectedLine && { line: [parseInt(selectedLine)] }),
            ...(selectedPort && { port: [parseInt(selectedPort)] }),
            ...(selectedRegion && { region: [parseInt(selectedRegion)] }),
            ...(selectedShip && { ship: [parseInt(selectedShip)] }),
        };

        try {
            const res = await fetch('/api/search-cruises', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(searchCriteria),
            });
            if (!res.ok) throw new Error('Search request failed');
            const data = await res.json();
            setResults(data.cruises || []); // Assuming the API returns a { cruises: [...] } object
        } catch (err) {
             setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search Filters Column */}
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Cruise Search</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoadingFilters && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Loading filters...</span>
                            </div>
                        )}
                        {error && !isLoadingFilters && (
                             <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {error}
                                    <Button variant="secondary" size="sm" className="mt-2" onClick={loadFilters}>
                                        Retry
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        )}
                        {filters && (
                            <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                                {filters.regions && (
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Destinations</AccordionTrigger>
                                    <AccordionContent>
                                        <Select onValueChange={setSelectedRegion}>
                                            <SelectTrigger><SelectValue placeholder="Select Destination" /></SelectTrigger>
                                            <SelectContent>
                                                {filters.regions.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </AccordionContent>
                                </AccordionItem>
                                )}
                                {filters.ports && (
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>Departure Port</AccordionTrigger>
                                    <AccordionContent>
                                         <Select onValueChange={setSelectedPort}>
                                            <SelectTrigger><SelectValue placeholder="Select Port" /></SelectTrigger>
                                            <SelectContent>
                                                {filters.ports.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </AccordionContent>
                                </AccordionItem>
                                )}
                                {filters.lines && (
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>Cruise Line</AccordionTrigger>
                                    <AccordionContent>
                                        <Select onValueChange={setSelectedLine}>
                                            <SelectTrigger><SelectValue placeholder="Select Line" /></SelectTrigger>
                                            <SelectContent>
                                                {filters.lines.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </AccordionContent>
                                </AccordionItem>
                                )}
                                {filters.ships && (
                                <AccordionItem value="item-4">
                                    <AccordionTrigger>Cruise Ship</AccordionTrigger>
                                    <AccordionContent>
                                        <Select onValueChange={setSelectedShip}>
                                            <SelectTrigger><SelectValue placeholder="Select Ship" /></SelectTrigger>
                                            <SelectContent>
                                                {filters.ships.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </AccordionContent>
                                </AccordionItem>
                                )}
                            </Accordion>
                        )}
                        <Button onClick={handleSearch} disabled={isLoading || isLoadingFilters} className="w-full">
                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...</> : 'Search Cruises'}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Search Results Column */}
            <div className="lg:col-span-3">
                 {isLoading ? (
                    <div className="flex items-center justify-center h-full rounded-lg border-2 border-dashed">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : results.length > 0 ? (
                    <div className="space-y-4">
                        {results.map((cruise, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle>{cruise.ship.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">{cruise.line.name}</p>
                                </CardHeader>
                                <CardContent>
                                    <p>{cruise.name}</p>
                                    <p>Duration: {cruise.nights} nights</p>
                                    <p>Departure: {cruise.departs}</p>
                                    <a href={`https://www.cruisemapper.com${cruise.url}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mt-2 inline-block">
                                        View Details on CruiseMapper
                                    </a>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                     <div className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-dashed text-center p-8">
                        <h3 className="text-xl font-semibold text-foreground">Use the filters to find your next cruise</h3>
                        <p className="text-muted-foreground mt-2">Your search results will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
