
import { apiGet } from "@/lib/api";
import type { PrayerTime } from "@/lib/types";

const PRAYERS = [
  {
    key: "fajr",
    label: "Fajr",
    name: "Prière de l’aube",
    icon: "☀",
  },
  {
    key: "dhuhr",
    label: "Dhuhr",
    name: "Prière de midi",
    icon: "◉",
  },
  {
    key: "asr",
    label: "Asr",
    name: "Prière de l’après-midi",
    icon: "◷",
  },
  {
    key: "maghrib",
    label: "Maghrib",
    name: "Prière du coucher du soleil",
    icon: "☾",
  },
  {
    key: "isha",
    label: "Isha",
    name: "Prière de la nuit",
    icon: "☽",
  },
] as const satisfies ReadonlyArray<{
  key: keyof PrayerTime;
  label: string;
  name: string;
  icon: string;
}>;

function PrayerTimesSkeleton() {
  return (
    <div
      role="status"
      aria-label="Chargement des horaires de prière"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
    >
      <span className="sr-only">Chargement des horaires...</span>

      {PRAYERS.map((prayer) => (
        <div
          key={prayer.key}
          className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4"
        >
          <div className="mx-auto h-4 w-16 rounded bg-gray-200" />
          <div className="mx-auto mt-4 h-7 w-20 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

function PrayerTimesError() {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center"
    >
      <p className="font-semibold text-amber-950">
        Horaires temporairement indisponibles
      </p>
      <p className="mt-2 text-sm text-amber-800">
        Impossible de récupérer les horaires de prière.
        Veuillez réessayer dans quelques instants.
      </p>
    </div>
  );
}

export default async function PrayerTimesToday() {
  let prayerTime: PrayerTime;

  try {
    prayerTime = await apiGet<PrayerTime>("/horaires-prieres/today/");
  } catch (error) {
    console.error("Erreur lors du chargement des horaires de prière :", error);
    return <PrayerTimesError />;
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Les cinq prières quotidiennes
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Horaires communiqués par votre mosquée
          </p>
        </div>

        <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 sm:mt-0">
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-emerald-600"
          />
          Horaires du jour
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {PRAYERS.map((prayer) => {
          const time = prayerTime[prayer.key];

          return (
            <article
              key={prayer.key}
              className="group rounded-2xl border border-gray-200 bg-white p-4 text-center transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
            >
              <div
                aria-hidden="true"
                className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-800 transition-colors group-hover:bg-emerald-100"
              >
                {prayer.icon}
              </div>

              <h3 className="mt-3 font-semibold text-gray-900">
                {prayer.label}
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                {prayer.name}
              </p>

              <p className="mt-3 text-2xl font-bold tabular-nums tracking-tight text-emerald-800">
                {time || "—"}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export { PrayerTimesSkeleton };
