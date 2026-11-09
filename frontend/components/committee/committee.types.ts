export type CommitteeMember = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  role: string;
  committee_role?: string;
  committee_role_label?: string;
  is_active: boolean;
  mosque?: number | null;
};

export type CommitteeFormData = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  password_confirm: string;
  committee_role: string;
};

export type CommitteeRole =
  | "president"
  | "vice_president"
  | "secretary"
  | "treasurer"
  | "member";