
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  MapPin,
  Search,
  Users,
  BookOpen,
  Heart,
  Moon,
  ChevronRight,
  CalendarCheck,
  Sparkles,
} from "lucide-react";

type EventCategory =
  | "Tous"
  | "Religieux"
  | "Enseignement"
  | "Communautaire"
  | "Ramadan";

type MosqueEvent = {
  id: number;
  title: string;
  description: string;
  category: Exclude<EventCategory, "Tous">;
  date: string;
  time: string;
  location: string;
  participants: string;
  featured?: boolean;
};

const EVENTS: MosqueEvent[] = [
  {
    id: 1,
    title: "Conférence sur les valeurs de l'Islam",
    description:
      "Un moment de partage et de réflexion autour des valeurs fondamentales de notre religion.",
    category: "Religieux",
    date: "2026-11-20",
    time: "18:30",
    location: "Grande salle de prière",
    participants: "Ouvert à tous",
    featured: true,
  },
  {
    id: 2,
    title: "Cours de Coran",
    description:
      "Apprentissage et perfectionnement de la lecture du Saint Coran avec nos enseignants.",
    category: "Enseignement",
    date: "2026-11-22",
    time: "10:00",
    location: "Salle de cours",
    participants: "Adultes et enfants",
  },
  {
    id: 3,
    title: "Rencontre communautaire",
    description:
      "Un moment convivial pour renforcer les liens entre les membres de notre communauté.",
    category: "Communautaire",
    date: "2026-11-25",
    time: "15:00",
    location: "Salle polyvalente",
    participants: "Ouvert à tous",
  },
  {
    id: 4,
    title: "Préparation du programme Ramadan",
    description:
      "Organisation des activités et préparation collective du prochain mois de Ramadan.",
    category: "Ramadan",
    date: "2026-12-01",
    time: "17:00",
    location: "Salle de réunion",
    participants: "Membres de la communauté",
  },
];

const CATEGORIES: EventCategory[] = [
  "Tous",
  "Religieux",
  "Enseignement",
  "Communautaire",
  "Ramadan",
];

const CATEGORY_STYLES: Record<
  Exclude<EventCategory, "Tous">,
  string
> = {
  Religieux: "bg-emerald-100 text-emerald-800",
  Enseignement: "bg-blue-100 text-blue-800",
  Communautaire: "bg-amber-100 text-amber-800",
  Ramadan: "bg-purple-100 text-purple-800",
};

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function EvenementsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState<EventCategory>("Tous");

  const filteredEvents = useMemo(() => {
    return EVENTS.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "Tous" || event.category === category;

      return matchesSearch && matchesCategory;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [search, category]);

  const featuredEvent = EVENTS.find((event) => event.featured);

  return (
    <main className="min-h-screen bg-gray-50">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950 px-4 py-16 text-white sm:py-20">
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-emerald-100">
              <Sparkles size={15} />
              La vie de notre communauté
            </span>

            <h1 className="mt-6 text-4xl font-extrabold sm:text-5xl">
              Événements de la mosquée
            </h1>

            <p className="mt-5 text-base leading-relaxed text-emerald-100 sm:text-lg">
              Découvrez les activités, conférences, cours religieux
              et rencontres organisés par votre mosquée.
              Participez à la vie de notre communauté.
            </p>

            <a
              href="#liste-evenements"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 font-bold text-emerald-950 transition hover:bg-amber-300"
            >
              Découvrir les événements
              <ChevronRight size={18} />
            </a>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-20 -top-24 h-96 w-96 rounded-full border-[40px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-40 right-40 h-96 w-96 rounded-full border-[30px] border-white/5" />
      </section>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">

        {/* ÉVÉNEMENT À LA UNE */}
        {featuredEvent && (
          <section>
            <div className="mb-5 flex items-center gap-2">
              <Sparkles className="text-amber-500" size={21} />
              <h2 className="text-xl font-extrabold text-gray-900">
                À la une
              </h2>
            </div>

            <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
              <div className="grid lg:grid-cols-[1.2fr_1fr]">
                <div className="flex min-h-64 items-center justify-center bg-gradient-to-br from-emerald-700 to-emerald-950 p-10 text-white">
                  <div className="text-center">
                    <CalendarDays size={65} className="mx-auto text-amber-300" />
                    <p className="mt-5 text-sm font-bold uppercase tracking-widest text-emerald-200">
                      Prochain rendez-vous
                    </p>
                    <p className="mt-2 text-2xl font-extrabold">
                      {formatDate(featuredEvent.date)}
                    </p>
                  </div>
                </div>

                <div className="p-7 sm:p-9">
                  <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800">
                    {featuredEvent.category}
                  </span>

                  <h3 className="mt-5 text-2xl font-extrabold text-gray-900">
                    {featuredEvent.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {featuredEvent.description}
                  </p>

                  <div className="mt-6 space-y-3 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <Clock size={17} className="text-emerald-700" />
                      {featuredEvent.time}
                    </p>

                    <p className="flex items-center gap-2">
                      <MapPin size={17} className="text-emerald-700" />
                      {featuredEvent.location}
                    </p>

                    <p className="flex items-center gap-2">
                      <Users size={17} className="text-emerald-700" />
                      {featuredEvent.participants}
                    </p>
                  </div>

                  <a
                    href="#liste-evenements"
                    className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
                  >
                    Voir les événements
                    <ChevronRight size={17} />
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* LISTE */}
        <section id="liste-evenements">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900">
              Tous les événements
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Retrouvez les prochains rendez-vous de votre communauté.
            </p>
          </div>

          {/* RECHERCHE */}
          <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un événement..."
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* CATÉGORIES */}
            <div className="mt-4 flex flex-wrap gap-2">
              {CATEGORIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                    category === item
                      ? "bg-emerald-800 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-800"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* CARTES */}
          {filteredEvents.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
              <CalendarDays className="mx-auto text-gray-300" size={42} />
              <h3 className="mt-4 font-bold text-gray-900">
                Aucun événement trouvé
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Essayez une autre recherche ou catégorie.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <article
                  key={event.id}
                  className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${CATEGORY_STYLES[event.category]}`}>
                      {event.category}
                    </span>

                    <CalendarCheck size={21} className="text-emerald-700" />
                  </div>

                  <h3 className="mt-5 text-lg font-extrabold text-gray-900">
                    {event.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-500">
                    {event.description}
                  </p>

                  <div className="mt-6 space-y-3 border-t border-gray-100 pt-5 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={17} className="text-emerald-700" />
                      <span className="capitalize">{formatDate(event.date)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock size={17} className="text-emerald-700" />
                      {event.time}
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={17} className="text-emerald-700" />
                      {event.location}
                    </div>

                    <div className="flex items-center gap-2">
                      <Users size={17} className="text-emerald-700" />
                      {event.participants}
                    </div>
                  </div>

                  <Link
                    href={`/evenements/${event.id}`}
                    className="mt-6 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-800 hover:text-white"
                  >
                    Voir les détails
                    <ChevronRight size={17} />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* INVITATION */}
        <section className="rounded-3xl bg-amber-50 p-7 sm:p-9">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <Heart size={27} />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-extrabold text-gray-900">
                Participez à la vie de votre mosquée
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Votre présence et votre participation contribuent
                à faire grandir notre communauté.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
            >
              Nous contacter
              <ChevronRight size={17} />
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}