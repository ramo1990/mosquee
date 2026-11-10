
export type Slide = {
  id: number;
  title: string;
  content?: string;
  image_url?: string;
  video_url?: string;
  screen_group?: string;
  display_order: number;
  duration_seconds: number;
  is_published: boolean;
};

export type SlideForm = {
  title: string;
  content: string;
  image_url: string;
  video_url: string;
  screen_group: string;
  display_order: string;
  duration_seconds: string;
};

export const EMPTY_FORM: SlideForm = {
  title: "",
  content: "",
  image_url: "",
  video_url: "",
  screen_group: "",
  display_order: "1",
  duration_seconds: "10",
};

export type SlideStats = {
  total: number;
  published: number;
  drafts: number;
  groups: number;
};