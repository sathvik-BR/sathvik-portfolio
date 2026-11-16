import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { PreloaderProvider } from "@/components/ui/PreloaderContext";
import { profile } from "@/data/content";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://sathvik-br.github.io/sathvik-portfolio";
const SITE_TITLE = `${profile.name} — ${profile.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: SITE_TITLE,
  description: profile.summary,
  authors: [{ name: profile.name, url: profile.github }],
  keywords: [
    "AI/ML Engineer",
    "Computer Vision",
    "Deep Learning",
    "NLP",
    "RAG Pipelines",
    "Portfolio",
    profile.name,
  ],
  openGraph: {
    type: "website",
    url: `${SITE_URL}/`,
    title: SITE_TITLE,
    description: profile.summary,
    siteName: profile.name,
    images: [
      {
        url: `${SITE_URL}/og.png`,
        width: 1200,
        height: 630,
        alt: `${profile.name} portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: profile.summary,
    images: [`${SITE_URL}/og.png`],
  },
};

export const viewport: Viewport = {
  themeColor: "#05060A",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} dark selection:bg-accent/30 selection:text-text`}
    >
      <body className="bg-background text-text font-sans antialiased overflow-x-hidden min-h-screen">
        <PreloaderProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </PreloaderProvider>
      </body>
    </html>
  );
}