import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/layout/Footer";

import { ClientThemeProvider } from "@/components/providers/ClientThemeProvider";

const fontSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kita",
  description: "Create your own personal page.",
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(fontSans.className, "antialiased bg-background min-h-screen text-foreground flex flex-col")}>
        <ClientThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  );
}
