
export type DisplayPrayerTime = {
  id: number;
  date: string;
  screen_group?: string;
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
  is_published: boolean;
};

export type DisplayPrayerTimeForm = {
  date: string;
  screen_group: string;
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

export const EMPTY_FORM: DisplayPrayerTimeForm = {
  date: "",
  screen_group: "",
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

export type PrayerStatusFilter =
  | "all"
  | "published"
  | "draft";