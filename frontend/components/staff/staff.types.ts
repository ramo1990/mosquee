
export type StaffRole = "imam" | "teacher";

export type StaffMember = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  role: StaffRole;
  is_active: boolean;
  mosque?: number | null;
};

export type StaffForm = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  password_confirm: string;
  role: StaffRole;
};

export type StaffFormField = keyof StaffForm;
