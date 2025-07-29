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
  keywords: [
    "YouTube",
    "AI",
    "video ideas",
    "content creation",
    "viral videos",
    "SEO optimization",
    "creator tools",
  ],
  authors: [{ name: "TubeSpark Team" }],
  creator: "TubeSpark",
  publisher: "TubeSpark",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://tubespark.ai"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tubespark.ai",
    title: "TubeSpark - AI Video Idea Generator for YouTubers",
    description: "Generate viral video ideas for your YouTube channel using AI",
    siteName: "TubeSpark",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TubeSpark - AI Video Idea Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TubeSpark - AI Video Idea Generator for YouTubers",
    description: "Generate viral video ideas for your YouTube channel using AI",
    images: ["/og-image.png"],
    creator: "@tubespark",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
