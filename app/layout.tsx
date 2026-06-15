import type { Metadata, Viewport } from "next";
import "./globals.css";

import "lenis/dist/lenis.css";

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Tech Store | Modern E-commerce",
  description: "Your one-stop shop for modern tech gadgets.",
  keywords: ["tech", "gadgets", "electronics", "e-commerce", "store"],
  openGraph: {
    title: "Tech Store | Modern E-commerce",
    description: "Your one-stop shop for modern tech gadgets.",
    url: "https://techstore.com",
    siteName: "Tech Store",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
