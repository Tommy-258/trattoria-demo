import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { restaurant, siteUrl } from "@/config/restaurant";
import { StructuredData } from "@/components/StructuredData";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ogAlt = `${restaurant.name}, a Neapolitan trattoria in Brooklyn, NY`;
const title = `${restaurant.name} | Neapolitan Trattoria in Brooklyn, NY`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description: restaurant.description,
  applicationName: restaurant.name,
  keywords: [
    "Italian restaurant Brooklyn",
    "Neapolitan pizza",
    "wood-fired pizza",
    "handmade pasta",
    "Cobble Hill restaurant",
    "trattoria",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: restaurant.name,
    title,
    description: restaurant.description,
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: ogAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: restaurant.description,
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#fbf6ee",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
