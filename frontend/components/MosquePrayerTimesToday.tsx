import { apiGet } from "@/lib/api";
import type { PrayerTime } from "@/lib/types";

import PrayerTimesToday from "./PrayerTimesToday";


async function getMosquePrayerTimes(
  mosqueSlug: string
): Promise<PrayerTime | null> {
  try {
    return await apiGet<PrayerTime>(
      `/horaires-prieres/mosque/${mosqueSlug}/today/`
    );
  } catch {
    return null;
  }
}


export default async function MosquePrayerTimesToday({
  mosqueSlug,
}: {
  mosqueSlug: string;
}) {
  const prayerTime = await getMosquePrayerTimes(mosqueSlug);

  if (!prayerTime) {
    return (
      <p className="text-sm text-gray-500">
        Horaires de prière indisponibles pour cette mosquée.
      </p>
    );
  }

  return <PrayerTimesToday prayerTime={prayerTime} />;
}