export type MemberStatus = "active" | "inactive" | "pending";

export type Member = {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  member_number?: string;
  address?: string;
  status?: MemberStatus;
  mosque?: number;
};

export type MemberForm = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  status: MemberStatus;
  mosque: string;
};

export type Mosque = {
  id: number;
  name: string;
};