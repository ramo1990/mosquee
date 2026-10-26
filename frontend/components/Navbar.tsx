
import Link from "next/link";

const navigation = [
  { href: "/", label: "Accueil" },
  { href: "/annonces", label: "Annonces" },
  { href: "/horaires", label: "Horaires" },
  { href: "/evenements", label: "Événements" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <header className="bg-emerald-800 text-white shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="w-fit rounded-sm text-xl font-bold tracking-tight transition-colors hover:text-emerald-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          aria-label="Mosquée — Accueil"
        >
          Mosquée
        </Link>

        <nav
          aria-label="Navigation principale"
          className="-mx-1 overflow-x-auto px-1 pb-1 sm:mx-0 sm:px-0 sm:pb-0"
        >
          <ul className="flex w-max items-center gap-1 sm:w-auto sm:flex-wrap sm:gap-2">
            {navigation.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-emerald-700 hover:text-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}