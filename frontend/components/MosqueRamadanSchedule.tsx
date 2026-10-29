import { apiGet } from "@/lib/api";
import type { RamadanSchedule } from "@/lib/types";


async function getRamadanSchedule(
  mosqueSlug: string
): Promise<RamadanSchedule | null> {
  try {
    return await apiGet<RamadanSchedule>(
      `/ramadan/mosquee/${mosqueSlug}/today/`
    );
  } catch {
    return null;
  }
}


export default async function MosqueRamadanSchedule({
  mosqueSlug,
}: {
  mosqueSlug: string;
}) {
  const schedule = await getRamadanSchedule(mosqueSlug);

  if (!schedule) {
    return (
      <p className="text-sm text-gray-500">
        Aucun programme Ramadan disponible pour cette mosquée.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Info
        title="Fin du Suhoor"
        value={schedule.suhoor_end?.slice(0, 5)}
      />

      <Info
        title="Iftar"
        value={schedule.iftar?.slice(0, 5)}
      />

      <Info
        title="Tarawih"
        value={schedule.tarawih?.slice(0, 5)}
      />

      {schedule.note && (
        <p className="sm:col-span-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
          {schedule.note}
        </p>
      )}
    </div>
  );
}

function Info({
  title,
  value,
}: {
  title: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold tabular-nums text-gray-950">
        {value ?? "--:--"}
      </p>
    </div>
  );
}