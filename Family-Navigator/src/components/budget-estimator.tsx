
"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface BudgetEstimatorProps {
  mode: 'family' | 'couple';
}

export function BudgetEstimator({ mode }: BudgetEstimatorProps) {
  const [port, setPort] = useState('Miami');
  const [days, setDays] = useState(7);
  const [estimates, setEstimates] = useState<{ [key: string]: number }>({});

  const calculate = () => {
    const multiplier = mode === 'family' ? 4 : 2;
    // Research-based averages
    const parking = 20 * days;
    const uber = 80 * (multiplier / 2);
    const cruise = 150 * multiplier * days;
    const flights = 400 * multiplier;
    const total = parking + uber + cruise + flights;
    setEstimates({ parking, uber, cruise, flights, total });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Estimator: {mode === 'family' ? 'Family of 4' : 'Adult Couple'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div>
                <Label htmlFor="port">Departure Port</Label>
                <Select onValueChange={setPort} defaultValue={port}>
                    <SelectTrigger id="port"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Miami">Miami</SelectItem>
                        <SelectItem value="Port Canaveral">Port Canaveral</SelectItem>
                        <SelectItem value="Fort Lauderdale">Fort Lauderdale</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="days">Cruise Days</Label>
                <Input id="days" type="number" value={days} onChange={(e) => setDays(Number(e.target.value))} />
            </div>
        </div>
        <Button onClick={calculate} className="w-full">Estimate Budget</Button>
        {estimates.total && (
          <div className="pt-4">
            <h3 className="font-semibold mb-2">Estimated Costs:</h3>
            <ul className="space-y-1 text-sm">
              <li>Parking: ${estimates.parking} (Tip: Use off-site lots to save ~40%)</li>
              <li>Rideshare: ${estimates.uber} (Tip: Compare with port shuttles)</li>
              <li>Cruise Fare: ${estimates.cruise}</li>
              <li>Flights: ${estimates.flights}</li>
              <li className="font-bold text-base mt-2">Total Est: ${estimates.total}</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

    