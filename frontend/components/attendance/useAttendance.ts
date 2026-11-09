
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost } from "@/lib/api";

import {
  Student,
  Classroom,
  AttendanceEntry,
  AttendanceRecord,
  AttendanceStatus,
  AttendanceState,
  AttendanceCounts,
  EMPTY_COUNTS,
} from "./types";

function getLocalDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function useAttendance() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  const [attendance, setAttendance] = useState<AttendanceState>({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedDate, setSelectedDate] = useState(getLocalDate());
  const [selectedClassroom, setSelectedClassroom] = useState("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAttendanceData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [studentsData, classroomsData] = await Promise.all([
        apiGetList<Student[]>("/students/"),
        apiGetList<Classroom[]>("/classrooms/"),
      ]);

      setStudents(studentsData);
      setClassrooms(classroomsData);

      setAttendance((current) => {
        const next: AttendanceState = {};

        studentsData.forEach((student) => {
          next[student.id] = current[student.id] ?? {
            studentId: student.id,
            studentName: `${student.first_name} ${student.last_name}`,
            status: "present",
            note: "",
          };
        });

        return next;
      });
    } catch (err) {
      console.error("Erreur chargement des présences :", err);
      setStudents([]);
      setClassrooms([]);
      setError("Impossible de charger les élèves pour le moment.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAttendanceData();
  }, [loadAttendanceData]);

  const filteredStudents = useMemo(() => {
    return students.filter(
      (student) =>
        selectedClassroom === "all" ||
        String(student.classroom) === selectedClassroom
    );
  }, [students, selectedClassroom]);

  const statusCounts = useMemo(() => {
    return filteredStudents.reduce((counts, student) => {
      const entry = attendance[student.id];

      if (entry) {
        counts[entry.status] += 1;
      }

      return counts;
    }, { ...EMPTY_COUNTS } as AttendanceCounts);
  }, [filteredStudents, attendance]);

  const updateAttendance = useCallback(
    (
      studentId: number,
      field: "status" | "note",
      value: string
    ) => {
      setAttendance((current) => ({
        ...current,
        [studentId]: {
          ...current[studentId],
          [field]: value,
        },
      }));
    },
    []
  );

  const setAllStatus = useCallback(
    (status: AttendanceStatus) => {
      setAttendance((current) => {
        const next = { ...current };

        filteredStudents.forEach((student) => {
          next[student.id] = {
            ...next[student.id],
            status,
          };
        });

        return next;
      });
    },
    [filteredStudents]
  );

  const saveAttendance = useCallback(async () => {
    setError("");
    setSuccess("");

    if (filteredStudents.length === 0) {
      setError("Sélectionnez une classe contenant des élèves.");
      return;
    }

    setSaving(true);

    const records: AttendanceRecord[] = filteredStudents.map(
      (student) => ({
        student: student.id,
        status: attendance[student.id].status,
        note: attendance[student.id].note.trim() || undefined,
      })
    );

    try {
      await apiPost("/attendance/bulk-create/", {
        date: selectedDate,
        classroom:
          selectedClassroom === "all"
            ? null
            : Number(selectedClassroom),
        records,
      });

      setSuccess("Présences enregistrées avec succès.");
    } catch (err) {
      console.error("Erreur enregistrement des présences :", err);
      setError("Impossible d'enregistrer les présences.");
    } finally {
      setSaving(false);
    }
  }, [filteredStudents, attendance, selectedDate, selectedClassroom]);

  return {
    students,
    classrooms,
    attendance,
    loading,
    saving,
    selectedDate,
    selectedClassroom,
    error,
    success,
    filteredStudents,
    statusCounts,
    setSelectedDate,
    setSelectedClassroom,
    setError,
    setSuccess,
    loadAttendanceData,
    updateAttendance,
    setAllStatus,
    saveAttendance,
  };
}
