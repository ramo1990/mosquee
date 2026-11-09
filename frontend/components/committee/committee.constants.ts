import type { CommitteeFormData } from "./committee.types";

export const COMMITTEE_ROLE_LABELS: Record<string, string> = {
  president: "Président",
  vice_president: "Vice-président",
  secretary: "Secrétaire",
  treasurer: "Trésorier",
  member: "Membre du comité",
};

export const INITIAL_COMMITTEE_FORM: CommitteeFormData = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  password_confirm: "",
  committee_role: "member",
};