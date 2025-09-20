"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { websiteIntegrationRAG } from "@/ai/flows/website-integration-rag";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  url: z.string().url("Please enter a valid URL."),
  query: z.string().min(3, "Please enter a query."),
});

type FormData = z.infer<typeof formSchema>;

export function WebAgentForm() {
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
      const result = await websiteIntegrationRAG(data);
      setAnswer(result.answer);
    } catch (error) {
      console.error("Error with Web Agent:", error);
      toast({
        title: "Error",
        description: "Failed to get an answer from the website. Please check the URL and try again.",
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
            <CardTitle>Website Query</CardTitle>
            <CardDescription>
              Enter a URL and ask a question about its content.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                placeholder="https://example.com"
                {...register("url")}
              />
              {errors.url && <p className="text-sm text-destructive">{errors.url.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="query">Your Question</Label>
              <Textarea
                id="query"
                placeholder="e.g., What is the main product offered?"
                {...register("query")}
              />
              {errors.query && <p className="text-sm text-destructive">{errors.query.message}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ask AI Agent
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>AI Answer</CardTitle>
          <CardDescription>
            The answer based on the website's content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {answer && (
            <div className="prose prose-sm max-w-none text-foreground">
              <p>{answer}</p>
            </div>
          )}
          {!isLoading && !answer && (
            <div className="text-center text-muted-foreground py-12">
              The AI's answer will appear here.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
