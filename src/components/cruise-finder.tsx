"use client";

import {
  Anchor,
  Briefcase,
  Calendar,
  Clock,
  Globe,
  Ship,
  Wallet,
  Sailboat,
  Flag,
  Search,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";

export function CruiseFinder() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Destinations */}
          <div className="space-y-2">
            <Label htmlFor="destinations">Destinations</Label>
            <div className="flex items-center">
              <div className="p-2.5 border border-r-0 rounded-l-md bg-muted">
                <Globe className="h-5 w-5 text-muted-foreground" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger id="destinations" className="rounded-l-none">
                  <SelectValue placeholder="All Destinations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Destinations</SelectItem>
                  <SelectItem value="caribbean">Caribbean</SelectItem>
                  <SelectItem value="alaska">Alaska</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="mexico">Mexico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Ship Type */}
          <div className="space-y-2">
            <Label htmlFor="ship-type">Ship Type</Label>
            <div className="flex items-center">
              <div className="p-2.5 border border-r-0 rounded-l-md bg-muted">
                <Sailboat className="h-5 w-5 text-muted-foreground" />
              </div>
              <Select defaultValue="ocean-river">
                <SelectTrigger id="ship-type" className="rounded-l-none">
                  <SelectValue placeholder="Ocean & River" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ocean-river">Ocean & River</SelectItem>
                  <SelectItem value="ocean">Ocean</SelectItem>
                  <SelectItem value="river">River</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Departure Port */}
          <div className="space-y-2">
            <Label htmlFor="departure-port">Departure Port / Country</Label>
            <div className="flex items-center">
              <div className="p-2.5 border border-r-0 rounded-l-md bg-muted">
                <Anchor className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="departure-port"
                placeholder="Search port by name or country"
                className="rounded-l-none"
              />
            </div>
          </div>

          {/* Port of Call */}
          <div className="space-y-2">
            <Label htmlFor="port-of-call">
              Preferable Port of Call / Country
            </Label>
            <div className="flex items-center">
              <div className="p-2.5 border border-r-0 rounded-l-md bg-muted">
                <Flag className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="port-of-call"
                placeholder="Search port by name or country"
                className="rounded-l-none"
              />
            </div>
          </div>

          {/* Ship */}
          <div className="space-y-2">
            <Label htmlFor="ship">Ship</Label>
            <div className="flex items-center">
              <div className="p-2.5 border border-r-0 rounded-l-md bg-muted">
                <Ship className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="ship"
                placeholder="Search ship by name"
                className="rounded-l-none"
              />
            </div>
          </div>

          {/* Line / Company */}
          <div className="space-y-2">
            <Label htmlFor="line">Line / Company</Label>
            <div className="flex items-center">
              <div className="p-2.5 border border-r-0 rounded-l-md bg-muted">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="line"
                placeholder="Search line by name"
                className="rounded-l-none"
              />
            </div>
          </div>

          {/* Itinerary Dates */}
          <div className="space-y-2">
            <Label>Itinerary Dates</Label>
            <div className="flex items-center space-x-2">
              <div className="flex items-center w-full">
                <div className="p-2.5 border border-r-0 rounded-l-md bg-muted">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="from-date"
                  type="date"
                  placeholder="Earliest departure date"
                  className="rounded-l-none"
                />
              </div>
              <div className="flex items-center w-full">
                <div className="p-2.5 border border-r-0 rounded-l-md bg-muted">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="to-date"
                  type="date"
                  placeholder="Latest departure date"
                  className="rounded-l-none"
                />
              </div>
            </div>
          </div>

          {/* Cruise Length & Type */}
          <div className="space-y-2">
            <Label>Cruise Length & Type</Label>
            <div className="flex items-center space-x-2">
              <div className="w-full">
                <div className="flex items-center">
                  <div className="p-2.5 border border-r-0 rounded-l-md bg-muted">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Select>
                    <SelectTrigger className="rounded-l-none">
                      <SelectValue placeholder="Any cruise length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any cruise length</SelectItem>
                      <SelectItem value="1-3">1-3 Nights</SelectItem>
                      <SelectItem value="4-6">4-6 Nights</SelectItem>
                      <SelectItem value="7-9">7-9 Nights</SelectItem>
                      <SelectItem value="10+">10+ Nights</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="w-full">
                <div className="flex items-center">
                  <div className="p-2.5 border border-r-0 rounded-l-md bg-muted">
                    <Wallet className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Select>
                    <SelectTrigger className="rounded-l-none">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="holiday">Holiday</SelectItem>
                      <SelectItem value="repositioning">Repositioning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Price Sliders */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <Label htmlFor="price-person">Cruise price per person</Label>
              <div className="flex items-center space-x-4">
                <span>$0</span>
                <Slider
                  defaultValue={[2000]}
                  max={5000}
                  step={100}
                  id="price-person"
                />
                <span>$5000</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price-night">Cruise price per night (PP)</Label>
              <div className="flex items-center space-x-4">
                <span>$0</span>
                <Slider
                  defaultValue={[100]}
                  max={500}
                  step={10}
                  id="price-night"
                />
                <span>$500</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end pt-4">
            <Button size="lg">
              <Search className="mr-2 h-5 w-5" />
              Find Cruises
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
