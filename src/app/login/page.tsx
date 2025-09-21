"use client";


import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/header";
import { Logo } from "@/components/logo";
import { toast } from "@/hooks/use-toast";
import { signInWithGoogle } from "@/services/auth-service";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase-client";

export default function LoginPage() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      router.push("/");
    } catch (error) {
      console.error("Google sign-in error", error);
      toast({
        title: "Login Failed",
        description: "Could not sign in with Google. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (loading || user) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background items-center justify-center">
            <p>Loading...</p>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
               <Logo className="h-10 w-10" />
            </div>
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <CardDescription>
              Sign in with Google to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button onClick={handleLogin} className="w-full mt-2">
              Sign in with Google
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
