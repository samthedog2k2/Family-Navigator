
'use client';

import { useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Clapperboard, Tv, Dribbble, ThumbsUp, Star, Video } from 'lucide-react';
import { getEntertainmentRecommendations, EntertainmentRecommendationsInput, EntertainmentRecommendation } from '@/ai/flows/entertainment-recommendations';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

type Category = 'movies' | 'tv-shows' | 'sports';

interface StreamingService {
    name: string;
    type: string;
    quality: string;
    link: string;
}

interface EnrichedRecommendation extends EntertainmentRecommendation {
    streamingServices?: StreamingService[];
    isFetchingServices?: boolean;
}

export default function EntertainmentPage() {
  const [category, setCategory] = useState<Category>('movies');
  const [recommendations, setRecommendations] = useState<EnrichedRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setRecommendations([]);
    try {
      const input: EntertainmentRecommendationsInput = { category };
      const result = await getEntertainmentRecommendations(input);
      setRecommendations(result.recommendations);
    } catch (error) {
      console.error("Failed to get entertainment recommendations:", error);
      toast({
        title: 'Error',
        description: 'Could not fetch AI recommendations. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case 'movies': return <Clapperboard className="h-5 w-5 mr-2" />;
      case 'tv-shows': return <Tv className="h-5 w-5 mr-2" />;
      case 'sports': return <Dribbble className="h-5 w-5 mr-2" />;
    }
  };

  const fetchStreamingServices = async (recIndex: number) => {
    const recommendation = recommendations[recIndex];
    if (!recommendation) return;

    // Set loading state for this specific card
    setRecommendations(prev => prev.map((rec, index) => 
        index === recIndex ? { ...rec, isFetchingServices: true } : rec
    ));

    try {
        const response = await fetch(`/api/streaming-availability?title=${encodeURIComponent(recommendation.title)}`);
        if (!response.ok) throw new Error('Failed to fetch streaming info');
        
        const data = await response.json();

        setRecommendations(prev => prev.map((rec, index) => 
            index === recIndex ? { ...rec, streamingServices: data.services, isFetchingServices: false } : rec
        ));

    } catch (error) {
        console.error("Failed to get streaming services:", error);
        toast({
            title: 'API Error',
            description: 'Could not fetch streaming services. Make sure your API key is set in .env.',
            variant: 'destructive',
        });
        setRecommendations(prev => prev.map((rec, index) => 
            index === recIndex ? { ...rec, isFetchingServices: false } : rec
        ));
    }
  };

  return (
    <LayoutWrapper>
      <PageHeader
        title="Entertainment Hub"
        description="Discover AI-powered recommendations and find where to watch them."
      />
      <Card>
        <CardHeader>
            <CardTitle>What are you in the mood for?</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                 <Select onValueChange={(value) => setCategory(value as Category)} defaultValue={category}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="movies">Movies</SelectItem>
                        <SelectItem value="tv-shows">TV Shows</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                    </SelectContent>
                </Select>
                <Button onClick={handleGetRecommendations} disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : getCategoryIcon(category)}
                    {isLoading ? 'Getting Recommendations...' : `Recommend ${category.replace('-', ' ')}`}
                </Button>
            </div>
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
                    <p>Your entertainment recommendations will appear here.</p>
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
                                {item.streamingServices && (
                                    <div className='pt-2'>
                                        <h4 className="text-xs font-semibold mb-2">Available on:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {item.streamingServices.length > 0 ? item.streamingServices.map(service => (
                                                <a key={service.name} href={service.link} target="_blank" rel="noopener noreferrer">
                                                    <Badge variant="outline">{service.name}</Badge>
                                                </a>
                                            )) : <p className="text-xs text-muted-foreground">Not currently available for streaming.</p>}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                             <CardFooter>
                                <Button 
                                    className="w-full" 
                                    onClick={() => fetchStreamingServices(index)} 
                                    disabled={item.isFetchingServices || category === 'sports'}
                                >
                                    {item.isFetchingServices ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Video className="mr-2 h-4 w-4" />
                                    )}
                                    {item.isFetchingServices ? 'Checking...' : 'Find where to watch'}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </CardContent>
      </Card>
    </LayoutWrapper>
  );
}
