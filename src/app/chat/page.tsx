
import { ChatInterface } from "@/components/chat";
import { PageHeader } from "@/components/page-header";
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ChatHistory } from "@/components/chat-history";
import { LayoutWrapper } from "@/components/layout-wrapper";

export default function ChatPage() {
  return (
    <LayoutWrapper fullHeight>
      <SidebarProvider>
        <Sidebar>
          <ChatHistory />
        </Sidebar>
        <SidebarInset className="p-4 sm:p-6">
          <PageHeader
            title="Chat Agent"
            description="Chat with an AI to improve the app."
          />
          <ChatInterface />
        </SidebarInset>
      </SidebarProvider>
    </LayoutWrapper>
  );
}
