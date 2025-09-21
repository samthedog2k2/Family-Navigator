import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { PT_Sans } from 'next/font/google'
import { CalendarProvider } from "@/hooks/use-calendar";
import { cookies } from "next/headers";

const ptSans = PT_Sans({ 
  subsets: ['latin'], 
  weight: ['400', '700'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: "Family Navigator",
  description: "Your compass for family life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const layout = cookies().get("react-resizable-panels:layout");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${ptSans.variable} font-sans antialiased bg-background text-foreground flex flex-col min-h-screen`}>
        <CalendarProvider>
          <div className="flex-1">
            {children}
          </div>
        </CalendarProvider>
        <Toaster />
        <footer className="py-4 text-center text-sm text-muted-foreground">
          Your compass for family life.
        </footer>
      </body>
    </html>
  );
}
