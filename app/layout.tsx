import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "NexusBridge DX | AI-Accelerated Legacy Modernization",
  description: "Enterprise consulting framework for legacy system modernization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-[hsl(222,47%,6%)]`}>
        {children}
      </body>
    </html>
  );
}

