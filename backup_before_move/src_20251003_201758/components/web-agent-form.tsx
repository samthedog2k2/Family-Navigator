"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { secureWebsiteAgent } from "@/ai/flows/secure-website-agent";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  request: z.string().min(10, "Please enter a detailed request."),
});

type FormData = z.infer<typeof formSchema>;

export function SecureAgentForm() {
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setAnswer("");
    try {
      const result = await secureWebsiteAgent(data);
      setAnswer(result.response);
    } catch (error) {
      console.error("Error with Secure Agent:", error);
      toast({
        title: "Error",
        description: "Failed to get an answer from the website. The headless browser might have been blocked or the website structure changed.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Secure Agent Request</CardTitle>
            <CardDescription>
              Ask the AI to log into a supported site and perform a task.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="request">Your Request</Label>
              <Textarea
                id="request"
                placeholder={'e.g., "Log into Hulu.com and find the account holder\'s name."'}
                {...register("request")}
                rows={3}
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
            <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
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
  );
}