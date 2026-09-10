import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import AppNavigation from "@/components/Navigation/AppNavigation";
import AuthGate from "@/components/AuthGate/AuthGate";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blog Web",
  description: "Aprenda, ensine e compartilhe conhecimento.",
  icons: {
    icon: "/favicon.svg",
  },
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

        <AuthGate>{children}</AuthGate>

      </body>
    </html>
  );
}