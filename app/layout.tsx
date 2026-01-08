import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kita - Your Personal Bento",
  description: "Create your own bento-like personal page.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(nunito.className, "antialiased bg-[#FDFCF8] min-h-screen text-stone-800")}>
        {children}
      </body>
    </html>
  );
}
