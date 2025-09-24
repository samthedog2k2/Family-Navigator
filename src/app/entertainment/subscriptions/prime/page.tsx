
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Loader2, Clapperboard, Star, ThumbsUp } from 'lucide-react';
import { getEntertainmentRecommendations, EntertainmentRecommendationsInput, EntertainmentRecommendation } from '@/ai/flows/entertainment-recommendations';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { toast } from '@/hooks/use-toast';

export default function PrimePage() {
  const [recommendations, setRecommendations] = useState<EntertainmentRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleGetRecommendations = async () => {
      setIsLoading(true);
      setRecommendations([]);
      try {
        const input: EntertainmentRecommendationsInput = { 
          category: 'movies',
          promptAugmentation: 'specifically on Prime Video' 
        };
        const result = await getEntertainmentRecommendations(input);
        setRecommendations(result.recommendations);
      } catch (error) {
        console.error("Failed to get Prime Video recommendations:", error);
        toast({
          title: 'Error',
          description: 'Could not fetch AI recommendations for Prime Video. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    handleGetRecommendations();
  }, []);

  return (
    <LayoutWrapper>
      <PageHeader
        title="Prime Video Recommendations"
        description="AI-curated list of what to watch on Prime Video right now."
      />
      <Card>
        <CardHeader>
          <CardTitle>Top Picks for Prime Video</CardTitle>
        </CardHeader>
        <CardContent>
             {isLoading && (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-lg font-semibold">Our AI is curating recommendations for you...</p>
                </div>
            )}
            {!isLoading && recommendations.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-lg">
                    <p>Could not load recommendations at this time.</p>
                </div>
            )}
            {!isLoading && recommendations.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {recommendations.map((item, index) => (
                        <Card key={index} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-xl">{item.title}</CardTitle>
                                <CardDescription>{item.year} - {item.genre}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-3">
                                <p className="text-sm">{item.description}</p>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        <span className="font-bold">{item.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <ThumbsUp className="w-4 h-4 text-green-500" />
                                        <span>{item.audienceScore}%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </CardContent>
      </Card>
    </LayoutWrapper>
  );
}
