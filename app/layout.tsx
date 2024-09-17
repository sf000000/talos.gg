import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "./components/navbar";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "talos.gg",
  description: "Discover and download games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("antialiased", inter.className)}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
