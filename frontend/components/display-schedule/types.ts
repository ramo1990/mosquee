
export type DisplaySchedule = {
  id: number;
  title: string;
  content?: string;
  screen_group?: string;
  start_datetime: string;
  end_datetime: string;
  priority: number;
  is_active: boolean;
};

export type ScheduleForm = {
  title: string;
  content: string;
  screen_group: string;
  start_datetime: string;
  end_datetime: string;
  priority: string;
};

export type ScheduleFormField = keyof ScheduleForm;

export type ScheduleStatusFilter = "all" | "active" | "inactive";

export const EMPTY_FORM: ScheduleForm = {
  title: "",
  content: "",
  screen_group: "",
  start_datetime: "",
  end_datetime: "",
  priority: "1",
};