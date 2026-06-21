import type { Metadata } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AppProvider } from "@/lib/store";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CarbonSense — Personal Carbon Footprint Tracker",
  description:
    "Track, reduce, and share your carbon footprint with AI-powered insights. India-specific emission factors, gamified challenges, and personalized reduction plans.",
  keywords: [
    "carbon footprint",
    "sustainability",
    "climate action",
    "carbon tracker",
    "India",
    "CO2",
    "environment",
    "green living",
  ],
  openGraph: {
    title: "CarbonSense — Track. Reduce. Share.",
    description: "Your personal AI-powered carbon footprint tracker with India-specific data.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <AppProvider>
            {/* Ambient Aurora Background */}
            <div className="aurora-bg" aria-hidden="true" />
            {children}
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
