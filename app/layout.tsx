import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import ThemeWrapper from "@/components/ThemeWrapper";

const inter = Inter({ subsets: ["latin"] });

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

    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>

        <Providers>

          <ThemeWrapper>

            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </ThemeWrapper>
        </Providers>
      </body>
    </html>
  );
}
