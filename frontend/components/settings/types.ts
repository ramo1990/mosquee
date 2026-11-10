export type Settings = {
  mosque_name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  language: string;
  timezone: string;
  currency: string;
  theme: "light" | "dark" | "system";
  default_screen_group: string;
  show_prayer_times: boolean;
  show_announcements: boolean;
  show_events: boolean;
  show_donations: boolean;
  auto_refresh_interval: string;
};

export const EMPTY_SETTINGS: Settings = {
  mosque_name: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  language: "fr",
  timezone: "Europe/Paris",
  currency: "EUR",
  theme: "system",
  default_screen_group: "",
  show_prayer_times: true,
  show_announcements: true,
  show_events: true,
  show_donations: true,
  auto_refresh_interval: "60",
};