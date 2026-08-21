import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
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
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9570612062032014"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={fontSans.className}>{children}</body>
    </html>
  );
}
