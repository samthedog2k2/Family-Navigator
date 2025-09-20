import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans',})

export const metadata: Metadata = {
  title: "Family Navigator",
  description: "Your compass for family life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground flex flex-col min-h-screen`}>
        <div className="flex-1">
          {children}
        </div>
        <Toaster />
        <footer className="py-4 text-center text-sm text-muted-foreground">
          Your compass for family life.
        </footer>
      </body>
    </html>
  );
}
