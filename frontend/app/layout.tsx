import type { Metadata } from "next";
import Link from "next/link";
import { cacheLife } from "next/cache";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mosquée | Côte d’Ivoire",
  description:
    "Site officiel de la mosquée : annonces, horaires de prière et événements.",
};

async function getCurrentYear() {
  "use cache";
  cacheLife("max");

  return new Date().getFullYear();
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentYear = await getCurrentYear();

  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-emerald-700 text-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-xl font-bold">
              Mosquée
            </Link>

            <nav className="flex gap-4 text-sm font-medium">
              <Link href="/" className="hover:text-emerald-200">
                Accueil
              </Link>
              <Link href="/annonces" className="hover:text-emerald-200">
                Annonces
              </Link>
              <Link href="/horaires" className="hover:text-emerald-200">
                Horaires
              </Link>
              <Link href="/evenements" className="hover:text-emerald-200">
                Événements
              </Link>
              <Link href="/contact" className="hover:text-emerald-200">
                Contact
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

        <footer className="mt-12 bg-gray-900 py-6 text-center text-sm text-gray-400">
          © {currentYear} Mosquée — Côte d’Ivoire
        </footer>
      </body>
    </html>
  );
}