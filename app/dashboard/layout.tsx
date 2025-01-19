import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import LeftNavbar from "./LeftNavbar";

export const metadata: Metadata = {
  title: "D&D craft",
  description: "Un Saas pour les joueurs de Donjon & Dragon",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      <div className="flex min-h-screen">
        <LeftNavbar />
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </>
  );
}
