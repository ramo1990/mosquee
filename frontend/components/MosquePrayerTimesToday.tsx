
import { apiGet } from "@/lib/api";
import type { PrayerTime } from "@/lib/types";

import PrayerTimesToday from "./PrayerTimesToday";

async function getMosquePrayerTimes(
  mosqueSlug: string
): Promise<PrayerTime | null> {
  try {
    const data = await apiGet<PrayerTime>(
      `/horaires-prieres/mosque/${mosqueSlug}/today/`
    );

    // Vérifier qu'au moins un horaire de prière est renseigné.
    const hasPrayerTime =
      data &&
      ["fajr", "dhuhr", "asr", "maghrib", "isha"].some(
        (key) => {
          const value = data[key as keyof PrayerTime];

          return (
            typeof value === "string" &&
            value.trim() !== ""
          );
        }
      );

    return hasPrayerTime ? data : null;
  } catch (error) {
    console.warn(
      "Aucun horaire spécifique pour cette mosquée.",
      error
    );

    return null;
  }
}

async function getGeneralPrayerTimes(): Promise<PrayerTime | null> {
  try {
    const data = await apiGet<PrayerTime>(
      "/horaires-prieres/today/"
    );

    return data ?? null;
  } catch (error) {
    console.error(
      "Erreur chargement horaires généraux :",
      error
    );

    return null;
  }
}

export default async function MosquePrayerTimesToday({
  mosqueSlug,
}: {
  mosqueSlug: string;
}) {
  // 1. Récupérer les horaires spécifiques.
  let prayerTime = await getMosquePrayerTimes(mosqueSlug);

  // 2. Utiliser les horaires généraux si nécessaire.
  let isGeneral = false;

  if (!prayerTime) {
    prayerTime = await getGeneralPrayerTimes();
    isGeneral = true;
  }

  // 3. Aucun horaire disponible.
  if (!prayerTime) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
        <p className="font-bold text-amber-950">
          Horaires indisponibles
        </p>

        <p className="mt-2 text-sm text-amber-800">
          Aucun horaire spécifique ou général n&apos;est disponible.
        </p>
      </div>
    );
  }

  // 4. Afficher les horaires.
  return (
    <PrayerTimesToday
      initialPrayerTime={prayerTime}
      isGeneral={isGeneral}
    />
  );
}