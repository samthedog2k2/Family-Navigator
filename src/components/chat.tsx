"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { chat, ChatInput } from "@/ai/flows/chat";
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
import { Loader2, User, Bot, PlusCircle } from "lucide-react";
import { useChatState } from "@/hooks/use-chat-state";
import { v4 as uuidv4 } from 'uuid';

const formSchema = z.object({
  message: z.string().min(1, "Message is required."),
});

type FormData = z.infer<typeof formSchema>;

export function ChatInterface() {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    addMessage,
    createNewConversation,
  } = useChatState();

  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [activeConversation?.messages, isLoading]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    let currentConversationId = activeConversationId;

    if (!currentConversationId) {
      const newConversation = createNewConversation(data.message);
      currentConversationId = newConversation.id;
    } else {
       addMessage(currentConversationId, {
         id: uuidv4(),
         role: "user",
         text: data.message,
       });
    }
    
    reset();

    try {
      const chatInput: ChatInput = { message: data.message };
      // If there are previous messages, add them to the input for context
      if (activeConversation && activeConversation.messages.length > 1) {
        chatInput.history = activeConversation.messages.slice(0, -1).map(m => ({
          role: m.role,
          parts: [{ text: m.text }],
        }));
      }

      const result = await chat(chatInput);
      addMessage(currentConversationId, {
        id: uuidv4(),
        role: "bot",
        text: result.message,
      });
    } catch (error) {
      console.error("Error with chat:", error);
      addMessage(currentConversationId, {
        id: uuidv4(),
        role: "bot",
        text: "Sorry, I encountered an error. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
  };

  return (
    <div className="relative h-[calc(100vh-12rem)] flex flex-col">
       <Button
        onClick={handleNewChat}
        className="absolute top-0 right-0"
        variant="outline"
        size="sm"
      >
        <PlusCircle className="mr-2" />
        New Chat
      </Button>
      <Card className="flex-1 flex flex-col mt-12">
        <CardHeader>
          <CardTitle>
            {activeConversation ? activeConversation.title : "New Chat"}
          </CardTitle>
          <CardDescription>
            Ask the AI for ideas on how to improve this application.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pr-4 -mr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {activeConversation?.messages.map((message) => (
                <div
                  key={message.id}
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
                    className={`rounded-lg p-3 text-sm max-w-[80%] whitespace-pre-wrap ${
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
               {!activeConversation && !isLoading && (
                <div className="text-center text-muted-foreground pt-12">
                  Start a new conversation by typing a message below.
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
              disabled={isLoading}
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
