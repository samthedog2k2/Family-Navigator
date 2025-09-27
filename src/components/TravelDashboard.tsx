
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { FamilyData, TripRequest } from '@/lib/travel-types';

const tripRequestSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  budget: z.coerce.number().positive('Budget must be a positive number'),
  additionalInfo: z.string().optional(),
});

interface TravelDashboardProps {
  family: FamilyData;
  onTripRequest: (request: TripRequest) => void;
  isProcessing: boolean;
}

export default function TravelDashboard({ family, onTripRequest, isProcessing }: TravelDashboardProps) {
  const { control, handleSubmit, register, formState: { errors } } = useForm<TripRequest>({
    resolver: zodResolver(tripRequestSchema),
  });

  const onSubmit = (data: TripRequest) => {
    onTripRequest(data);
  };

  return (
    <Card className="shadow-xl rounded-2xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Plan Your Next Adventure</CardTitle>
          <CardDescription>
            Tell the coordinator agent what you're looking for. The more detail, the better!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="origin">From</Label>
              <Input id="origin" placeholder="e.g., New York, NY" {...register('origin')} />
              {errors.origin && <p className="text-sm text-red-500">{errors.origin.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">To</Label>
              <Input id="destination" placeholder="e.g., Orlando, FL" {...register('destination')} />
              {errors.destination && <p className="text-sm text-red-500">{errors.destination.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">Budget (USD)</Label>
            <Input id="budget" type="number" placeholder="e.g., 4000" {...register('budget')} />
            {errors.budget && <p className="text-sm text-red-500">{errors.budget.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea
              id="additionalInfo"
              placeholder="e.g., 'We have two young kids who love swimming. We prefer direct flights and need a rental car.'"
              {...register('additionalInfo')}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isProcessing ? 'Agents are working...' : 'Start Planning'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
