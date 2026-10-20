import type { Metadata, Viewport } from "next";
import { Geist, Newsreader } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const newsreaderSerif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Memento Mori Machine — Your Life in Weeks",
  description:
    "An immersive, privacy-first life visualization experience. See your life in weeks, remember each one matters, and archive the moments worth keeping.",
  keywords: ["memento mori", "life in weeks", "calendar", "reflection", "mindfulness", "perspective"],
  authors: [{ name: "Memento Mori Machine" }],
  openGraph: {
    title: "Memento Mori Machine — Your Life in Weeks",
    description: "Your life is made of weeks. Every square is a small piece of your finite time.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#090909",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${newsreaderSerif.variable} dark`}>
      <body className="min-h-screen bg-[#090909] text-[#F2F0EA] font-sans selection:bg-[#D49B4B]/30 selection:text-[#F2F0EA] antialiased">
        {children}
      </body>
    </html>
  );
}
