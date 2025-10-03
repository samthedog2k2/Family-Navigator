"use client";

import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

export interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  archived: boolean;
}

const STORAGE_KEY = "chat-conversations";

function useChatState() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedConversations = localStorage.getItem(STORAGE_KEY);
      if (storedConversations) {
        setConversations(JSON.parse(storedConversations));
        const activeId = localStorage.getItem(`${STORAGE_KEY}-active`);
        const storedActive = activeId ? JSON.parse(activeId) : null;
        const activeExists = JSON.parse(storedConversations).find((c: Conversation) => c.id === storedActive);
        if (activeExists) {
             setActiveConversationId(storedActive);
        } else {
            setActiveConversationId(null);
        }
      }
    } catch (error) {
      console.error("Failed to load conversations from local storage", error);
    }
  }, []);

  useEffect(() => {
    try {
      if (conversations.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error("Failed to save conversations to local storage", error);
    }
  }, [conversations]);

  useEffect(() => {
    try {
        if(activeConversationId) {
            localStorage.setItem(`${STORAGE_KEY}-active`, JSON.stringify(activeConversationId));
        } else {
            localStorage.removeItem(`${STORAGE_KEY}-active`);
        }
    } catch (error) {
        console.error("Failed to save active conversation ID", error);
    }
  }, [activeConversationId]);

  const createNewConversation = useCallback((firstMessageText: string) => {
    const userMessage: Message = { id: uuidv4(), role: "user", text: firstMessageText };
    const newConversation: Conversation = {
      id: uuidv4(),
      title: firstMessageText.substring(0, 30),
      messages: [userMessage],
      createdAt: new Date().toISOString(),
      archived: false,
    };
    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    return newConversation;
  }, []);

  const addMessage = useCallback(
    (conversationId: string, message: Message) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? { ...c, messages: [...c.messages, message] }
            : c
        )
      );
    },
    []
  );

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  }, [activeConversationId]);

  const archiveConversation = useCallback((id: string, archive = true) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, archived: archive } : c))
    );
  }, []);
  
  const updateConversationTitle = useCallback((id: string, title: string) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, title } : c));
  }, []);


  return {
    conversations,
    activeConversationId,
    setActiveConversationId,
    createNewConversation,
    addMessage,
    deleteConversation,
    archiveConversation,
    updateConversationTitle,
  };
}

export { useChatState };
