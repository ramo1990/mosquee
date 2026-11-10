
export type AttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "excused";

export type Student = {
  id: number;
  first_name: string;
  last_name: string;
  classroom?: number | null;
  classroom_name?: string;
};

export type Classroom = {
  id: number;
  name: string;
};

export type AttendanceRecord = {
  student: number;
  status: AttendanceStatus;
  note?: string;
};

export type AttendanceEntry = {
  studentId: number;
  studentName: string;
  status: AttendanceStatus;
  note: string;
};

export type AttendanceState = Record<number, AttendanceEntry>;

export type AttendanceCounts = Record<AttendanceStatus, number>;

export const STATUS_OPTIONS: AttendanceStatus[] = [
  "present",
  "absent",
  "late",
  "excused",
];

export const STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: "Présent",
  absent: "Absent",
  late: "Retard",
  excused: "Absence justifiée",
};

export const STATUS_COLORS: Record<AttendanceStatus, string> = {
  present: "bg-emerald-100 text-emerald-800",
  absent: "bg-red-100 text-red-700",
  late: "bg-amber-100 text-amber-800",
  excused: "bg-blue-100 text-blue-800",
};

export const EMPTY_COUNTS: AttendanceCounts = {
  present: 0,
  absent: 0,
  late: 0,
  excused: 0,
};
