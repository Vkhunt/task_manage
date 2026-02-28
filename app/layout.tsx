// ============================================================
// app/layout.tsx
// ROOT LAYOUT — wraps every page in the app.
//
// Providers added here:
//   1. ThemeProvider  (Context API — UI preferences, theme)
//   2. Redux Provider (global task state)
//
// The <html> tag gets a data-theme attribute from the ThemeContext
// so CSS can style differently based on theme:
//   html[data-theme="dark"]  { background: #111; color: #fff; }
//   html[data-theme="light"] { background: #fff; color: #111; }
// ============================================================

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers"; // Redux Provider
import ThemeWrapper from "@/components/ThemeWrapper"; // Applies data-theme to <html>

// Load Inter font from Google Fonts
const inter = Inter({ subsets: ["latin"] });

// SEO metadata for the entire app
export const metadata: Metadata = {
  title: "TaskManager — Full-Stack Task Management System",
  description:
    "A full-stack task management app built with Next.js 14, TypeScript, Redux Toolkit, and React Context API.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The <html> tag does NOT have data-theme here directly —
    // it is set dynamically by ThemeWrapper (a client component)
    // because it reads from localStorage/Context (browser-only)
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        {/*
          Providers nested order (innermost wraps the outermost):
          1. ThemeWrapper  → reads ThemeContext → sets data-theme on <html>
          2. Providers     → Redux store
          Both are "use client" components.
        */}
        <Providers>
          {/* ThemeWrapper reads ThemeContext and applies data-theme to <html> */}
          <ThemeWrapper>
            {/* Navbar appears on every page */}
            <Navbar />
            {/* Page content renders here */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </ThemeWrapper>
        </Providers>
      </body>
    </html>
  );
}
