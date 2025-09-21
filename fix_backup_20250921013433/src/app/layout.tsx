import "./globals.css";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Family Navigator",
  description: "Simplify your family’s life",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const layoutCookie = cookieStore.get("react-resizable-panels:layout");
  const defaultLayout = layoutCookie ? JSON.parse(layoutCookie.value) : undefined;

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
