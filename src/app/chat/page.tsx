
import { ChatInterface } from "@/components/chat";
import { PageHeader } from "@/components/page-header";
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ChatHistory } from "@/components/chat-history";
import { Header } from "@/components/header";

export default function ChatPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <div className="flex flex-1">
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <ChatHistory />
            </SidebarContent>
          </Sidebar>
          <SidebarInset className="p-4 sm:p-6 flex flex-col flex-1">
            <PageHeader
              title="Chat Agent"
              description="Chat with an AI to improve the app."
            />
            <ChatInterface />
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}
