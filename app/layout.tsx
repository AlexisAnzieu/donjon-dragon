import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "H2T - Donjon & Dragon",
  description: "Un Saas pour les joueurs de Donjon & Dragon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
