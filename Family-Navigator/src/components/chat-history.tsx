"use client";

import { Archive, FileText, Trash2, Edit, Search, Image, User, Settings2 } from "lucide-react";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarMenuAction,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useChatState } from "@/hooks/use-chat-state";
import { ScrollArea } from "./ui/scroll-area";
import { Logo } from "./logo";
import { Button } from "./ui/button";

export function ChatHistory() {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    archiveConversation,
    deleteConversation,
    createNewConversation
  } = useChatState();

  const activeConversations = conversations.filter((c) => !c.archived);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      <SidebarHeader className="flex items-center justify-between p-2 h-16 border-b">
         <div className="group-data-[state=expanded]:opacity-100 opacity-0 transition-opacity">
            <Logo />
         </div>
         <SidebarTrigger />
      </SidebarHeader>

      {/* Main navigation icons */}
      <div className="p-2 border-b">
         <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="New Chat" onClick={() => createNewConversation("New Chat")}>
                    <Edit />
                    <span>New Chat</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton tooltip="Search">
                    <Search />
                    <span>Search</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton tooltip="Gallery">
                    <Image />
                    <span>Gallery</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </div>

      <ScrollArea className="flex-1">
        <SidebarContent>
          <SidebarMenu>
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
        </SidebarContent>
      </ScrollArea>
       <SidebarFooter className="p-2 border-t">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Settings">
                        <Settings2 />
                        <span>Settings</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton tooltip="User Profile">
                        <User />
                        <span>User Profile</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </div>
  );
}
