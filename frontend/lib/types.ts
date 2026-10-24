// src/types/index.ts
export type Announcement = {
  id: number;
  title: string;
  body: string;
  priority: "low" | "normal" | "high";
  image: string | null;
  starts_at: string;
  ends_at: string | null;
};

export type PrayerTime = {
  id: number;
  date: string;
  fajr: string;
  sunrise: string | null;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  fajr_iqama: string | null;
  dhuhr_iqama: string | null;
  asr_iqama: string | null;
  maghrib_iqama: string | null;
  isha_iqama: string | null;
  jumuah_time: string | null;
  jumuah_khateeb: string | null;
};

export type Event = {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string | null;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  status: string;
};

export type MosqueProfile = {
  id: number;
  name: string;
  slogan: string | null;
  description: string;
  address: string;
  city: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  facebook: string | null;
  youtube: string | null;
};