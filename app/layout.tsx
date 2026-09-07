import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import AppNavigation from "@/components/Navigation/AppNavigation";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Blog",
  description: "My personal blog",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#6f1d1b]">
        
        <header className="flex justify-center py-8">
          <AppNavigation />
        </header>

        <main className="flex-1">
          {children}
        </main>

      </body>
    </html>
  );
}