
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FamilyData } from '@/lib/travel-types';

interface TripComparisonProps {
  family: FamilyData;
}

export default function TripComparison({ family }: TripComparisonProps) {
  return (
    <Card className="shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle>Trip Comparison</CardTitle>
        <CardDescription>
          Compare options from the agents' findings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">Trip comparison results will appear here.</p>
        </div>
      </CardContent>
    </Card>
  );
}
