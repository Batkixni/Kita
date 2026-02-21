import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "STUDIO SORAI",
  description:
    "Indie Creative Studio focusing on esport broadcast and event visual creation.",
  icons: {
    icon: "/logo/Logo_Black.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fontSans.className}>{children}</body>
    </html>
  );
}
