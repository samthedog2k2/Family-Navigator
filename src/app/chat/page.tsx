
import { ChatInterface } from "@/components/chat";
import { LayoutWrapper } from "@/components/layout-wrapper";
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
        <LayoutWrapper>
          <PageHeader
            title="Chat Agent"
            description="Chat with an AI to improve the app."
          />
          <ChatInterface />
        </LayoutWrapper>
      </SidebarInset>
    </SidebarProvider>
  );
}
