import type { MemberForm, MemberStatus } from "./members.types";

export const EMPTY_FORM: MemberForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  address: "",
  status: "active",
  mosque: "",
};

export const STATUS_LABELS: Record<MemberStatus, string> = {
  active: "Actif",
  inactive: "Inactif",
  pending: "En attente",
};