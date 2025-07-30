import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "TubeSpark - AI Video Idea Generator for YouTubers",
    template: "%s | TubeSpark",
  },
  description:
    "Generate viral video ideas for your YouTube channel using AI. Analyze trends, competitors, and optimize for SEO automatically.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
