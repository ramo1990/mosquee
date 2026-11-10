
export type MediaType = "image" | "video";

export type MediaItem = {
  id: number;
  title: string;
  media_type: MediaType;
  file_url?: string;
  category?: string;
  description?: string;
  is_published: boolean;
};

export type MediaForm = {
  title: string;
  media_type: MediaType;
  file_url: string;
  file: File | null;
  category: string;
  description: string;
};

export type MediaFormField = keyof MediaForm;

export type MediaStatusFilter =
  | "all"
  | "published"
  | "draft";

export const EMPTY_FORM: MediaForm = {
  title: "",
  media_type: "image",
  file_url: "",
  file: null,
  category: "",
  description: "",
};

export const TYPE_LABELS: Record<MediaType, string> = {
  image: "Image",
  video: "Vidéo",
};