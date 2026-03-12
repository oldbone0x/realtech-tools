import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Database Schema Visualizer - RealTech Tools",
  description: "Paste SQL DDL and get instant ERD diagrams. Zero configuration, free, and runs in your browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
