export type MosqueSettings = {
  id: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  opening_time?: string;
  closing_time?: string;
  capacity?: number | null;
  is_active: boolean;
};

export type MosqueSettingsForm = {
  name: string;
  description: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  opening_time: string;
  closing_time: string;
  capacity: string;
};

export const EMPTY_FORM: MosqueSettingsForm = {
  name: "",
  description: "",
  address: "",
  city: "",
  postal_code: "",
  country: "",
  phone: "",
  email: "",
  website: "",
  facebook_url: "",
  instagram_url: "",
  youtube_url: "",
  logo_url: "",
  primary_color: "#047857",
  secondary_color: "#065f46",
  opening_time: "",
  closing_time: "",
  capacity: "",
};