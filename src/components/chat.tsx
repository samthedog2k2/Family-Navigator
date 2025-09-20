"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { chat } from "@/ai/flows/chat";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, User, Bot } from "lucide-react";

const formSchema = z.object({
  message: z.string().min(1, "Message is required."),
});

type FormData = z.infer<typeof formSchema>;

interface Message {
  role: "user" | "bot";
  text: string;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    const userMessage: Message = { role: "user", text: data.message };
    setMessages((prev) => [...prev, userMessage]);
    reset();

    try {
      const result = await chat({ message: data.message });
      const botMessage: Message = { role: "bot", text: result.message };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error with chat:", error);
      const errorMessage: Message = {
        role: "bot",
        text: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
          <CardDescription>
            Ask the AI for ideas on how to improve this application.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pr-4 -mr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.role === "user" ? "justify-end" : ""
                  }`}
                >
                  {message.role === "bot" && (
                    <div className="p-2 bg-primary rounded-full text-primary-foreground">
                      <Bot size={20} />
                    </div>
                  )}
                  <div
                    className={`rounded-lg p-3 text-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.text}
                  </div>
                   {message.role === "user" && (
                    <div className="p-2 bg-muted rounded-full">
                      <User size={20} />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary rounded-full text-primary-foreground">
                      <Bot size={20} />
                    </div>
                    <div className="rounded-lg p-3 text-sm bg-muted">
                       <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                 </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="flex w-full gap-2">
            <Input
              id="message"
              placeholder="Type your message..."
              {...register("message")}
              autoComplete="off"
            />
            <Button type="submit" disabled={isLoading}>
              Send
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
