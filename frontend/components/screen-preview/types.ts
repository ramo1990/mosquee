
export type Screen = {
  id: number;
  name: string;
  location?: string;
  screen_group?: string;
  is_online: boolean;
};

export type ScreenContent = {
  id: number;
  title: string;
  content?: string;
  media_url?: string;
  media_type?: "image" | "video";
  priority: number;
  start_datetime: string;
  end_datetime: string;
};

export type PrayerTimes = {
  fajr?: string;
  dhuhr?: string;
  asr?: string;
  maghrib?: string;
  isha?: string;
  jumua_time?: string;
};