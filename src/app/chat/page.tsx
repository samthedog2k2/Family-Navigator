import { ChatInterface } from "@/components/chat";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ChatHistory } from "@/components/chat-history";
import { Header } from "@/components/header";

export default function ChatPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider defaultCollapsed={false}>
          <Sidebar>
            <SidebarContent>
              <ChatHistory />
            </SidebarContent>
          </Sidebar>
          <div className="flex flex-1 flex-col">
            <ChatInterface />
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}
