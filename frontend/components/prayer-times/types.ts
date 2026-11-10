
export type PrayerTime = {
  id: number;
  date: string;
  fajr?: string;
  dhuhr?: string;
  asr?: string;
  maghrib?: string;
  isha?: string;
  fajr_iqama?: string;
  dhuhr_iqama?: string;
  asr_iqama?: string;
  maghrib_iqama?: string;
  isha_iqama?: string;
  jumua_time?: string;
  jumua_khutbah_time?: string;
  notes?: string;
  is_active: boolean;
};

export type PrayerTimeForm = {
  date: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  fajr_iqama: string;
  dhuhr_iqama: string;
  asr_iqama: string;
  maghrib_iqama: string;
  isha_iqama: string;
  jumua_time: string;
  jumua_khutbah_time: string;
  notes: string;
};

export type PrayerStatusFilter = "all" | "active" | "inactive";

export const EMPTY_FORM: PrayerTimeForm = {
  date: new Date().toISOString().slice(0, 10),
  fajr: "",
  dhuhr: "",
  asr: "",
  maghrib: "",
  isha: "",
  fajr_iqama: "",
  dhuhr_iqama: "",
  asr_iqama: "",
  maghrib_iqama: "",
  isha_iqama: "",
  jumua_time: "",
  jumua_khutbah_time: "",
  notes: "",
};

export const PRAYER_FIELDS = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
] as const;

export const PRAYER_LABELS: Record<
  (typeof PRAYER_FIELDS)[number],
  string
> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};