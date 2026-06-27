import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sagar Constructions - The Sanctuary Builders | Bhandara",
  description: "Family-owned construction company in Bhandara, Maharashtra since 2005. Specializing in home construction, renovations, plumbing, tile fitting, and property assistance.",
  keywords: ["Sagar Constructions", "Bhandara construction", "home builder Bhandara", "renovation Bhandara", "property assistance Maharashtra", "Mr. Natthuji Sonewane"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-cream text-text-charcoal font-body selection:bg-accent-terracotta selection:text-white">
        {children}
      </body>
    </html>
  );
}
