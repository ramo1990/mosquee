// src/types/index.ts
export type Announcement = {
  id: number;
  mosque?: string | null;
  title: string;
  body: string;
  priority: "low" | "normal" | "high";
  image?: string | null;
  is_active: boolean;
  show_on_screen: boolean;
  starts_at: string;
  ends_at?: string | null;
  target_type: "all" | "group" | "screen";
  target_group?: number | null;
  target_screen?: number | null;
  created_at: string;
  updated_at: string;
};

export type AnnouncementCreatePayload = {
  mosque?: string | null;
  target_type: "all" | "group" | "screen";
  target_group?: number | null;
  target_screen?: number | null;
  title: string;
  body: string;
  priority: "low" | "normal" | "high";
  image?: File | null;
  is_active: boolean;
  show_on_screen: boolean;
  starts_at: string;
  ends_at?: string | null;
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

export type QuranVerse = {
  id: number;
  arabic: string;
  translation: string;
  reference: string;
  is_active: boolean;
  order: number;
  target_type: "all" | "selected";
  target_screens: number[];
};

export type ContactMessagePayload = {
  full_name: string;
  phone?: string;
  email?: string;
  subject: string;
  message: string;
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
  slug: string;
  slogan?: string | null;
  description: string;
  address: string;
  city: string;
  latitude?: string | null;
  longitude?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  facebook?: string | null;
  youtube?: string | null;
  logo?: string | null;
  cover_image?: string | null;
};

export type NewsArticle = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  body: string;
  image?: string | null;
  is_published: boolean;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type GalleryAlbum = {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  event?: number | null;
  created_at: string;
  images: GalleryImage[];
};

export type GalleryImage = {
  id: number;
  album: number;
  image: string;
  caption?: string | null;
  uploaded_at: string;
};

export type Screen = {
  id: number;
  mosque?: string | null;
  name: string;
  slug: string;
  location?: string | null;
  pairing_code?: string | null;
  is_online?: boolean;
  last_seen_at?: string | null;
  announcement_duration?: number;
  verse_duration?: number;
  night_mode_start?: string | null;
  night_mode_end?: string | null;
  group?: number | null;
  contents?: ScreenContent[];
  is_active?: boolean;
};

export type ScreenContent = {
  id: number;
  screen: number;
  title: string;
  body?: string | null;
  image?: string | null;
  order: number;
  is_active: boolean;
};

export type DonationCampaign = {
  id: number;
  mosque?: string | null;
  title: string;
  slug: string;
  description: string;
  goal_amount?: string | null;
  total_raised?: string;
  is_active: boolean;
  starts_at: string;
  ends_at?: string | null;
};

export type RamadanSchedule = {
  id: number;
  mosque?: string | null;
  date: string;
  suhoor_end?: string | null;
  iftar: string;
  tarawih?: string | null;
  note?: string | null;
};