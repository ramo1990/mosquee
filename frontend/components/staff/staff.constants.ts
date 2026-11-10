
import type { StaffForm, StaffRole } from "./staff.types";

export const ROLE_LABELS: Record<StaffRole, string> = {
  imam: "Imam",
  teacher: "Enseignant",
};

export const EMPTY_STAFF_FORM: StaffForm = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  password_confirm: "",
  role: "imam",
};
