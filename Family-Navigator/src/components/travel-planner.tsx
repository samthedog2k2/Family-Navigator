"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getTravelRecommendations } from "@/ai/flows/travel-recommendations";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  destinationType: z.enum(["road trip", "lodging"]),
  interests: z.string().min(3, "Please describe your interests."),
  budget: z.string().min(3, "Please specify your budget."),
  travelers: z.coerce.number().min(1, "At least one traveler is required."),
  duration: z.string().min(3, "Please specify the trip duration."),
  departureDate: z.string().min(3, "Please specify a departure date."),
});

type FormData = z.infer<typeof formSchema>;

export function TravelPlanner() {
  const [recommendations, setRecommendations] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destinationType: "road trip",
      interests: "beaches and hiking",
      budget: "$3000",
      travelers: 4,
      duration: "7 days",
      departureDate: "Next summer",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setRecommendations("");
    try {
      const result = await getTravelRecommendations({ preferences: data });
      setRecommendations(result.recommendations);
    } catch (error) {
      console.error("Error getting travel recommendations:", error);
      toast({
        title: "Error",
        description: "Failed to get travel recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle>AI-Powered Travel Recommendations</CardTitle>
            <CardDescription>Fill out your preferences for a road trip or lodging and let our AI find the perfect trip for you.</CardDescription>
        </CardHeader>
        <div className="grid gap-6 lg:grid-cols-5 p-6">
            <div className="lg:col-span-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="destinationType">Destination Type</Label>
                        <Controller
                        name="destinationType"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger id="destinationType">
                                <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="road trip">Road Trip</SelectItem>
                                <SelectItem value="lodging">Lodging</SelectItem>
                            </SelectContent>
                            </Select>
                        )}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="interests">Interests & Preferences</Label>
                        <Textarea
                            id="interests"
                            placeholder="e.g., beaches, mountains, city life"
                            {...register("interests")}
                        />
                        {errors.interests && <p className="text-sm text-destructive">{errors.interests.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="budget">Budget</Label>
                            <Input id="budget" placeholder="$5,000" {...register("budget")} />
                            {errors.budget && <p className="text-sm text-destructive">{errors.budget.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="travelers">Travelers</Label>
                            <Input id="travelers" type="number" min="1" {...register("travelers")} />
                            {errors.travelers && <p className="text-sm text-destructive">{errors.travelers.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="duration">Duration</Label>
                            <Input id="duration" placeholder="e.g., 7 days" {...register("duration")} />
                            {errors.duration && <p className="text-sm text-destructive">{errors.duration.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="departureDate">Departure Date</Label>
                            <Input id="departureDate" placeholder="e.g., July 2024" {...register("departureDate")} />
                            {errors.departureDate && <p className="text-sm text-destructive">{errors.departureDate.message}</p>}
                        </div>
                    </div>
                     <Button type="submit" disabled={isLoading} className="w-full mt-4">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Get Recommendations
                    </Button>
                    </div>
                </form>
            </div>
            <div className="lg:col-span-3">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Your Custom Itinerary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                        )}
                        {recommendations && (
                        <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                            {recommendations}
                        </div>
                        )}
                        {!isLoading && !recommendations && (
                        <div className="text-center text-muted-foreground py-12">
                            Your travel recommendations will appear here.
                        </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    </Card>
  );
}
