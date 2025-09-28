"use client";

import { Archive, FileText, Trash2 } from "lucide-react";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarMenuAction,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useChatState } from "@/hooks/use-chat-state";
import { ScrollArea } from "./ui/scroll-area";
import { useState } from "react";

export function ChatHistory() {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    archiveConversation,
    deleteConversation,
    updateConversationTitle,
  } = useChatState();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const handleTitleUpdate = (id: string, currentTitle: string) => {
    if (editingId === id) {
      updateConversationTitle(id, newTitle);
      setEditingId(null);
    } else {
      setEditingId(id);
      setNewTitle(currentTitle);
    }
  };

  const activeConversations = conversations.filter((c) => !c.archived);
  const archivedConversations = conversations.filter((c) => c.archived);

  return (
    <div className="flex flex-col h-full">
      <SidebarHeader className="flex items-center justify-between">
        <h2 className="text-lg font-semibold group-data-[state=collapsed]:hidden">Chat History</h2>
        <SidebarTrigger />
      </SidebarHeader>
      <ScrollArea className="flex-1">
        <SidebarContent>
          <SidebarMenu>
            <p className="px-2 text-xs font-semibold text-muted-foreground group-data-[state=collapsed]:hidden">
              Active
            </p>
            {activeConversations.map((convo) => (
              <SidebarMenuItem key={convo.id}>
                <SidebarMenuButton
                  isActive={convo.id === activeConversationId}
                  onClick={() => setActiveConversationId(convo.id)}
                  tooltip={convo.title}
                >
                  <FileText />
                  <span>{convo.title}</span>
                </SidebarMenuButton>
                <SidebarMenuAction
                  onClick={() => archiveConversation(convo.id)}
                  title="Archive"
                >
                  <Archive />
                </SidebarMenuAction>
                <SidebarMenuAction
                  onClick={() => deleteConversation(convo.id)}
                  title="Delete"
                  className="right-8"
                >
                  <Trash2 />
                </SidebarMenuAction>
              </SidebarMenuItem>
            ))}
            {activeConversations.length === 0 && (
              <p className="p-2 text-sm text-muted-foreground group-data-[state=collapsed]:hidden">
                No active chats.
              </p>
            )}
          </SidebarMenu>
          <SidebarMenu>
            <p className="px-2 text-xs font-semibold text-muted-foreground group-data-[state=collapsed]:hidden">
              Archived
            </p>
            {archivedConversations.map((convo) => (
              <SidebarMenuItem key={convo.id}>
                <SidebarMenuButton
                  isActive={convo.id === activeConversationId}
                  onClick={() => setActiveConversationId(convo.id)}
                   tooltip={convo.title}
                >
                  <FileText />
                  <span>{convo.title}</span>
                </SidebarMenuButton>
                 <SidebarMenuAction
                  onClick={() => archiveConversation(convo.id, false)}
                  title="Unarchive"
                >
                  <Archive />
                </SidebarMenuAction>
                <SidebarMenuAction
                  onClick={() => deleteConversation(convo.id)}
                  title="Delete"
                  className="right-8"
                >
                  <Trash2 />
                </SidebarMenuAction>
              </SidebarMenuItem>
            ))}
            {archivedConversations.length === 0 && (
              <p className="p-2 text-sm text-muted-foreground group-data-[state=collapsed]:hidden">
                No archived chats.
              </p>
            )}
          </SidebarMenu>
        </SidebarContent>
      </ScrollArea>
    </div>
  );
}
