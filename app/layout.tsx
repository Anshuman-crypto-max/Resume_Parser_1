import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Resume Parser | AI Recruiting Intelligence",
    template: "%s | Resume Parser"
  },
  description: "AI-powered resume parsing, candidate search, ATS scoring, analytics, and exports for modern hiring teams.",
  openGraph: {
    title: "Resume Parser",
    description: "Extract structured candidate intelligence from resumes and search your talent database with AI.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume Parser",
    description: "AI-powered resume parsing and ATS intelligence for hiring teams."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
