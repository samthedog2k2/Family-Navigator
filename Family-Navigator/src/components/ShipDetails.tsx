
"use client";

import type { ShipInfo } from "@/data/cruise-ship-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import { Ship, Users, Weight, Ruler, ChevronsRight, GitBranch } from 'lucide-react';

interface ShipDetailsProps {
    ship: ShipInfo;
}

export function ShipDetails({ ship }: ShipDetailsProps) {
    if (!ship) return null;

    const shipAge = new Date().getFullYear() - ship.built;

    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-0">
                 {ship.imageUrl ? (
                    <div className="relative h-48 w-full">
                         <Image
                            src={ship.imageUrl}
                            alt={`Image of ${ship.name}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                ) : (
                    <div className="flex h-48 w-full items-center justify-center bg-muted/50">
                        <Ship className="h-16 w-16 text-muted-foreground" />
                    </div>
                )}
            </CardHeader>
            <CardContent className="p-4">
                 <CardTitle className="text-xl mb-4">{ship.name}</CardTitle>
                 <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    <div className="flex items-center gap-2">
                        <Ship size={16} className="text-muted-foreground" />
                        <span><strong>Line:</strong> {ship.cruiseLine}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Users size={16} className="text-muted-foreground" />
                        <span><strong>Passengers:</strong> {ship.pax.toLocaleString()}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <GitBranch size={16} className="text-muted-foreground" />
                        <span><strong>Built:</strong> {ship.built} ({shipAge} years)</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Users size={16} className="text-muted-foreground" />
                        <span><strong>Crew:</strong> {ship.crew.toLocaleString()}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Weight size={16} className="text-muted-foreground" />
                        <span><strong>Tonnage:</strong> {ship.tonnage.toLocaleString()} GT</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <ChevronsRight size={16} className="text-muted-foreground" />
                        <span><strong>Speed:</strong> {ship.speed} knots</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Ruler size={16} className="text-muted-foreground" />
                        <span><strong>Length:</strong> {ship.length.toLocaleString()} ft</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Ruler size={16} className="text-muted-foreground -rotate-90" />
                        <span><strong>Beam:</strong> {ship.beam.toLocaleString()} ft</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


    