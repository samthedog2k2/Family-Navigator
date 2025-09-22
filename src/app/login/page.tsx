
import { Header } from "@/components/header";
import EnhancedLogin from "@/components/auth/EnhancedLogin";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <EnhancedLogin />
    </div>
  );
}
