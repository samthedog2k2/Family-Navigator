import { Chat } from "@/components/chat";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";

export default function ChatPage() {
  return (
    <LayoutWrapper>
      <PageHeader
        title="Chat Agent"
        description="Chat with an AI to improve the app."
      />
      <Chat />
    </LayoutWrapper>
  );
}
