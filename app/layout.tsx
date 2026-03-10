import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RealTech Tools - AI-Powered Micro-Tools",
  description: "A collection of small useful tools built as part of the RealTech AI Tool Factory experiments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {children}
      </body>
    </html>
  );
}
