import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import GooeyNav from "@/components/Navigation/GooeyNav";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Blog",
  description: "My personal blog",
};

const items = [
  { label: "Home", href: "/" },
  { label: "My posts", href: "/my-posts" },
  { label: "Contact", href: "/contact" },
];

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#6f1d1b]">
        
        <header className="flex justify-center py-8">
          <GooeyNav
            items={items}
            particleCount={15}
            particleDistances={[90, 10]}
            particleR={100}
            initialActiveIndex={0}
            animationTime={600}
            timeVariance={300}
            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
          />
        </header>

        <main className="flex-1">
          {children}
        </main>

      </body>
    </html>
  );
}