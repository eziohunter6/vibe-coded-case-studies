import type { Metadata } from "next";
import "./globals.css";
import { SkipLink } from "@/components/SkipLink";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { EasterEgg } from "@/components/EasterEgg";
import { SmoothCursor } from "@/components/SmoothCursor";
import { CommandPalette } from "@/components/CommandPalette";
import { VoiceAgent } from "@/components/VoiceAgent";
import { ThemeScript } from "@/components/ThemeToggle";
import { site } from "@/content/portfolio";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://utk-folio.vercel.app";

export const metadata: Metadata = {
  title: {
    default: `${site.name} · ${site.title}`,
    template: `%s · ${site.name}`,
  },
  description: site.metaDescription,
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: `${site.name} · ${site.title}`,
    description: site.metaDescription,
    type: "website",
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · ${site.title}`,
    description: site.metaDescription,
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
        {/* Apply theme before first paint to prevent flash */}
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col antialiased bg-[var(--bg)] text-[var(--text)]">
        <SkipLink />
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <EasterEgg />
        <SmoothCursor />
        <CommandPalette />
        <VoiceAgent />
      </body>
    </html>
  );
}
