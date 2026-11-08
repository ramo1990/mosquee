import type { UserRole } from "@/lib/types";

export type DashboardModule =
  | "dashboard"
  | "members"
  | "committee"
  | "imams-teachers"
  | "contributions"
  | "donations"
  | "expenses"
  | "finance"
  | "activities"
  | "announcements"
  | "screens"
  | "mosque-settings"
  | "tasks"
  | "prayer-times"
  | "sermons"
  | "religious-announcements"
  | "islamic-calendar"
  | "religious-courses"
  | "ramadan"
  | "religious-events"
  | "classes"
  | "students"
  | "courses"
  | "learning-programs"
  | "attendance"
  | "student-progress"
  | "assignments"
  | "course-calendar"
  | "connected-screens"
  | "slides"
  | "display-schedule"
  | "display-prayer-times"
  | "media"
  | "screen-preview";

const ADMIN_MODULES: DashboardModule[] = [
  "dashboard",
  "members",
  "committee",
  "imams-teachers",
  "contributions",
  "donations",
  "expenses",
  "finance",
  "activities",
  "announcements",
  "screens",
  "mosque-settings",
  "tasks",
  "prayer-times",
  "sermons",
  "religious-announcements",
  "islamic-calendar",
  "religious-courses",
  "ramadan",
  "religious-events",
  
  "classes",
  "students",
  "courses",
  "learning-programs",
  "attendance",
  "student-progress",
  "assignments",
  "course-calendar",
  "connected-screens",
  "slides",
  "display-schedule",
  "display-prayer-times",
  "media",
  "screen-preview",
];

const COMMITTEE_MODULES: DashboardModule[] = [
  "dashboard",
  "finance",
  "contributions",
  "donations",
  "expenses",
  "activities",
  "tasks",
];

const IMAM_MODULES: DashboardModule[] = [
  "dashboard",
  "prayer-times",
  "sermons",
  "religious-announcements",
  "islamic-calendar",
  "religious-courses",
  "ramadan",
  "religious-events",
];

const TEACHER_MODULES: DashboardModule[] = [
  "dashboard",
  "classes",
  "students",
  "courses",
  "learning-programs",
  "attendance",
  "student-progress",
  "assignments",
  "course-calendar",
];

const SCREEN_MANAGER_MODULES: DashboardModule[] = [
  "dashboard",
  "connected-screens",
  "announcements",
  "slides",
  "display-schedule",
  "display-prayer-times",
  "media",
  "screen-preview",
];

export function canAccessModule(
  role: UserRole,
  module: DashboardModule
): boolean {
  if (role === "super_admin") return true;

  if (role === "mosque_admin") {
    return ADMIN_MODULES.includes(module);
  }

  if (role === "committee") {
    return COMMITTEE_MODULES.includes(module);
  }

  if (role === "imam") {
    return IMAM_MODULES.includes(module);
  }

  if (role === "teacher") {
    return TEACHER_MODULES.includes(module);
  }

  if (role === "screen_manager") {
    return SCREEN_MANAGER_MODULES.includes(module);
  }

  return false;
}

export function getDashboardModules(role: UserRole): DashboardModule[] {
  if (role === "super_admin") {
    return ADMIN_MODULES;
  }

  if (role === "mosque_admin") {
    return ADMIN_MODULES;
  }

  if (role === "committee") {
    return COMMITTEE_MODULES;
  }

  if (role === "imam") {
    return IMAM_MODULES;
  }

  if (role === "teacher") {
    return TEACHER_MODULES;
  }

  if (role === "screen_manager") {
    return SCREEN_MANAGER_MODULES;
  }

  return ["dashboard"];
}