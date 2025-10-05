
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { PageHeader } from '@/components/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { secureWebsiteAgent, SecureWebsiteAgentInput } from '@/ai/flows/secure-website-agent';

const formSchema = z.object({
  request: z.string().min(10, 'Please enter a detailed request.'),
  huluUsername: z.string().email('Please enter a valid Hulu email.'),
  huluPassword: z.string().min(1, 'Please enter your Hulu password.'),
});

type FormData = z.infer<typeof formSchema>;

export default function HuluAgentPage() {
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      request: "Log into Hulu.com and find the account holder's name.",
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setAnswer('');

    const agentInput: SecureWebsiteAgentInput = {
        request: data.request,
        username: data.huluUsername,
        password: data.huluPassword,
    };

    try {
      const result = await secureWebsiteAgent(agentInput);
      setAnswer(result.response);
    } catch (error) {
      console.error('Error with Secure Agent:', error);
      toast({
        title: 'Agent Error',
        description: 'Failed to get an answer from the website. The headless browser might have been blocked or the website structure changed.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LayoutWrapper>
      <PageHeader
        title="Hulu Secure Agent"
        description="Ask an AI agent to securely log into Hulu and retrieve information for you."
      />
       <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Secure Agent Request</CardTitle>
              <CardDescription>
                Your credentials are used only for this request and are not stored.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="huluUsername">Hulu Email</Label>
                  <Input id="huluUsername" type="email" {...register('huluUsername')} placeholder="Your Hulu email" autoComplete="username" />
                  {errors.huluUsername && <p className="text-sm text-destructive">{errors.huluUsername.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="huluPassword">Hulu Password</Label>
                  <Input id="huluPassword" type="password" {...register('huluPassword')} placeholder="Your Hulu password" autoComplete="current-password" />
                  {errors.huluPassword && <p className="text-sm text-destructive">{errors.huluPassword.message}</p>}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="request">Your Request</Label>
                <Textarea
                  id="request"
                  {...register('request')}
                  rows={3}
                  name="request"
                />
                {errors.request && <p className="text-sm text-destructive">{errors.request.message}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Dispatch Secure Agent
              </Button>
            </CardFooter>
          </form>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Agent Response</CardTitle>
            <CardDescription>
              The information retrieved by the agent.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="font-semibold">Agent is running...</p>
                <p className="text-sm">Launching headless browser and performing login.</p>
                <p className="text-xs mt-2">(This may take up to a minute)</p>
              </div>
            )}
            {answer && (
              <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap rounded-md bg-muted p-4">
                <p>{answer}</p>
              </div>
            )}
            {!isLoading && !answer && (
              <div className="text-center text-muted-foreground py-12">
                The agent's response will appear here.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </LayoutWrapper>
  );
}
