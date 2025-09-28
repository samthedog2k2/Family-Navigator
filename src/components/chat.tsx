"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { chat, ChatInput } from "@/ai/flows/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, User, Bot, ChevronDown, Folder, Sparkles } from "lucide-react";
import { useChatState } from "@/hooks/use-chat-state";
import { v4 as uuidv4 } from 'uuid';
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const formSchema = z.object({
  message: z.string().min(1, "Message is required."),
});

type FormData = z.infer<typeof formSchema>;

const llms = [
    { name: 'ChatGPT 5', default: true },
    { name: 'Gemini', default: false },
    { name: 'Claude', default: false },
    { name: 'Grok', default: false },
]

export function ChatInterface() {
  const {
    conversations,
    activeConversationId,
    addMessage,
    createNewConversation,
  } = useChatState();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('ChatGPT 5');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
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
      const chatInput: ChatInput = {
        message: data.message,
        history: [],
      };

      const conversationForHistory = conversations.find(c => c.id === currentConversationId);
      if (conversationForHistory && conversationForHistory.messages.length > 1) {
         chatInput.history = conversationForHistory.messages.slice(0, -1).map(m => {
            if (m.role === 'user') return { user: m.text };
            return { bot: m.text };
         });
      }
      
      const result = await chat(chatInput);
      
      if(currentConversationId) {
        addMessage(currentConversationId, {
            id: uuidv4(),
            role: "bot",
            text: result.message || "Response received",
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      if (currentConversationId) {
        addMessage(currentConversationId, {
          id: uuidv4(),
          role: "bot",
          text: "Sorry, I encountered an error. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-full flex flex-col pt-16">
        {/* Top Model Selector Bar */}
        <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-start px-4">
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                        <Folder className="w-5 h-5 text-muted-foreground"/>
                        <span className="text-lg font-medium">{selectedModel}</span>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {llms.map(llm => (
                        <DropdownMenuItem key={llm.name} onSelect={() => setSelectedModel(llm.name)}>
                           {llm.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
             </DropdownMenu>
        </div>

        {/* Chat Messages Area */}
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
             <div className="max-w-3xl mx-auto py-8">
                <div className="space-y-6">
                {(!activeConversation || activeConversation.messages.length === 0) && !isLoading && (
                    <div className="text-center pt-12">
                        <div className="inline-block p-4 bg-primary/10 rounded-full">
                            <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="mt-4 text-2xl font-bold">How can I help you today?</h2>
                    </div>
                )}
                {activeConversation?.messages.map((message) => (
                    <div
                    key={message.id}
                    className={cn("flex items-start gap-4", message.role === "user" && "justify-end")}
                    >
                    {message.role === "bot" && (
                        <div className="p-2 bg-primary/10 rounded-full">
                           <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                    )}
                    <div
                        className={cn(
                            "rounded-lg p-3 text-sm max-w-[80%] whitespace-pre-wrap",
                            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}
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
                    <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div className="rounded-lg p-3 text-sm bg-muted flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Thinking...
                    </div>
                    </div>
                )}
                </div>
            </div>
        </ScrollArea>
        
        {/* Chat Input */}
        <div className="px-4 pb-4">
            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="relative">
                    <Input
                    id="message"
                    placeholder="Type your message..."
                    {...register("message")}
                    autoComplete="off"
                    disabled={isLoading}
                    className="h-12 rounded-full pr-14"
                    />
                    <Button type="submit" disabled={isLoading} size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full">
                        <User size={20} />
                    </Button>
                </form>
                 <p className="text-xs text-center text-muted-foreground mt-2">Family Navigator can make mistakes. Consider checking important information.</p>
            </div>
        </div>
    </div>
  );
}
