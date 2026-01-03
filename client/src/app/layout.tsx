import type { Metadata } from "next";
import "./globals.css";
import TerminalStream from "@/components/TerminalStream";

export const metadata: Metadata = {
  title: "The Lakeinator | Advanced OSINT Platform",
  description: "Next-generation all-in-one open-source intelligence platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className="antialiased selection:bg-green-500 selection:text-black"
      >
        <div className="scanline" />
        {children}
        <TerminalStream />
      </body>
    </html>
  );
}