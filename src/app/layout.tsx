import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ParticleCanvas from "@/components/layout/ParticleCanvas";
import BackToTop from "@/components/ui/BackToTop";
import { SITE_CONFIG } from "@/types";
import "@/styles/globals.css";

// ============================================================
//  Fonts (self-hosted via next/font)
// ============================================================

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// ============================================================
//  Metadata
// ============================================================

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.url),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    types: {
      "application/rss+xml": "/api/rss",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

// ============================================================
//  Root Layout
// ============================================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang={SITE_CONFIG.language}
      className={`dark ${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body bg-black text-ink-primary antialiased min-h-screen flex flex-col">
        {/* Particle background — renders behind everything */}
        <ParticleCanvas />

        {/* Header */}
        <Header />

        {/* Main content — Server Components render here without client boundary */}
        <main className="flex-1 relative z-10 pt-16">{children}</main>

        {/* Footer */}
        <Footer />

        {/* Floating UI */}
        <BackToTop />
      </body>
    </html>
  );
}
