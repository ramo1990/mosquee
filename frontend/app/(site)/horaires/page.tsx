import { Suspense } from "react";
import PrayerTimesToday from "@/components/PrayerTimesToday";

export default function PrayerTimesPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Horaires de prière</h1>

      <Suspense fallback={<p className="text-gray-500">Chargement...</p>}>
        <PrayerTimesToday />
      </Suspense>
    </div>
  );
}