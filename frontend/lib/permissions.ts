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
  | "screen-preview"
  | "my-donations"
  | "my-contributions"
  | "my-activities"
  | "my-profile"
  | "notifications"
  | "settings";

const ADMIN_MODULES: DashboardModule[] = [
  "dashboard", "members", "committee", "imams-teachers",
  "contributions", "donations", "expenses", "finance",
  "activities", "announcements", "screens", "mosque-settings",
  "tasks", "prayer-times", "sermons", "religious-announcements",
  "islamic-calendar", "religious-courses", "ramadan",
  "religious-events", "classes", "students", "courses",
  "learning-programs", "attendance", "student-progress",
  "assignments", "course-calendar", "connected-screens",
  "slides", "display-schedule", "display-prayer-times",
  "media", "screen-preview", "notifications", "settings"
];

const COMMITTEE_MODULES: DashboardModule[] = [
  "dashboard",
  "finance",
  "contributions",
  "donations",
  "expenses",
  "activities",
  "tasks",
  "members",
  "announcements",
  "notifications",
  "settings"
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
  "notifications",
  "settings"
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
  "notifications",
  "settings"
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
  "notifications",
  "settings"
];

const MEMBER_MODULES: DashboardModule[] = [
  "dashboard",
  "my-donations",
  "my-contributions",
  "my-activities",
  "my-profile",
  "prayer-times",
  "islamic-calendar",
  "religious-events",
  "announcements",
  "notifications",
];

const ROLE_MODULES: Record<UserRole, DashboardModule[]> = {
  super_admin: ADMIN_MODULES,
  mosque_admin: ADMIN_MODULES,
  committee: COMMITTEE_MODULES,
  imam: IMAM_MODULES,
  teacher: TEACHER_MODULES,
  screen_manager: SCREEN_MANAGER_MODULES,
  member: MEMBER_MODULES
};

export function canAccessModule(
  role: UserRole,
  module: DashboardModule
): boolean {
  return ROLE_MODULES[role]?.includes(module) ?? false;
}

export function getDashboardModules(
  role: UserRole
): DashboardModule[] {
  return ROLE_MODULES[role] ?? [];
}