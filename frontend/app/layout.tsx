import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: "Mosquée | Côte d’Ivoire",
    template: "%s | Mosquée",
  },
  description:
    "Retrouvez les annonces, les horaires de prière, les événements et les informations de contact de notre mosquée en Côte d’Ivoire.",
  openGraph: {
    title: "Mosquée | Côte d’Ivoire",
    description:
      "Annonces, horaires de prière et événements de notre mosquée.",
    locale: "fr_CI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="fr" className={cn("font-sans", geist.variable)}>
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}