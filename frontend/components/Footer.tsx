
import Link from "next/link";
import CurrentYear from "./CurrentYear";


const footerLinks = [
  { href: "/", label: "Accueil" },
  { href: "/about", label: "À propos" },
  { href: "/horaires", label: "Horaires de prière" },
  { href: "/annonces", label: "Annonces" },
  { href: "/evenements", label: "Événements" },
  { href: "/contact", label: "Contact" },
] as const;

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-amber-500/20 bg-gray-950 text-gray-400">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12">
        {/* Identité et navigation */}
        <div className="grid gap-8 sm:grid-cols-2 sm:items-start lg:grid-cols-[1fr_auto] lg:gap-12">
          <div className="max-w-md text-center sm:text-left">
            <Link
              href="/"
              aria-label="Mosquée — Accueil"
              className="inline-flex rounded-sm text-xl font-bold tracking-tight text-white transition-colors hover:text-amber-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
            >
              Mosquée<span className="text-amber-400">.</span>
            </Link>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Un lieu de foi, de paix et de fraternité en Côte d’Ivoire.
            </p>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Au service de la communauté et du vivre-ensemble.
            </p>
          </div>

          <nav
            aria-label="Navigation de pied de page"
            className="sm:justify-self-start lg:justify-self-end"
          >
            <h2 className="mb-4 text-sm font-semibold text-white">
              Navigation
            </h2>

            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              {footerLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-flex rounded-sm transition-colors hover:text-amber-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Séparateur */}
        <div
          aria-hidden="true"
          className="my-8 border-t border-white/10"
        />

        {/* Mentions de bas de page */}
        <div className="flex flex-col items-center gap-3 text-center text-xs leading-5 sm:flex-row sm:justify-between sm:text-left">
          <p>
            © <CurrentYear /> Mosquée — Côte d’Ivoire. Tous droits réservés.
          </p>

          <p className="text-gray-500">
            Qu’Allah bénisse notre communauté.
          </p>
        </div>
      </div>
    </footer>
  );
}
