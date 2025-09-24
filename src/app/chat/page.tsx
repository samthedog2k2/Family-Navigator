
import { ChatInterface } from "@/components/chat";
import { PageHeader } from "@/components/page-header";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ChatHistory } from "@/components/chat-history";

export default function ChatPage() {
  return (
    <SidebarProvider>
      <Sidebar>
        <ChatHistory />
      </Sidebar>
      <SidebarInset>
        <PageHeader
          title="Chat Agent"
          description="Chat with an AI to improve the app."
        />
        <ChatInterface />
      </SidebarInset>
    </SidebarProvider>
  );
}
