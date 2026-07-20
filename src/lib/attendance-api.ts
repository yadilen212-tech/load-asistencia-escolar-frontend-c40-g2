import { api } from "./api";
import type { AttendanceRecord, AttendanceResponse } from "@/types/attendance";

export async function fetchStudents(classId: string) {
  const response = await api<any[]>(`/api/classes/${classId}/students`);
  return response;
}

export async function submitAttendanceRecord(
  record: AttendanceRecord
): Promise<AttendanceResponse> {
  const response = await api<AttendanceResponse>("/api/attendance/record", {
    method: "POST",
    body: JSON.stringify(record),
  });

  if (response.success) {
    localStorage.setItem("last_attendance_record", JSON.stringify(record));
  }

  return response;
}

export async function fetchAttendanceHistory(classId: string, date: string) {
  return api<AttendanceRecord[]>(
    `/api/attendance/history?class_id=${classId}&date=${date}`
  );
}

export async function deleteAttendance(recordId: string): Promise<void> {
  await api(`/api/attendance/${recordId}`, {
    method: "DELETE",
  });
}

export function buildAttendancePayload(
  students: any[],
  classId: string,
  date: string,
  notes: string,
  teacherId: string
): AttendanceRecord {
  return {
    date,
    class_id: classId,
    teacher_id: teacherId,
    notes,
    students: students.map((s) => ({
      student_id: s.id,
      name: s.name,
      status: s.status || "absent",
      timestamp: new Date().toISOString(),
    })),
  };
}

export const API_ENDPOINTS = {
  STUDENTS: "/api/classes/:classId/students",
  SUBMIT_ATTENDANCE: "/api/attendance/record",
  HISTORY: "/api/attendance/history",
  DELETE: "/api/attendance/:recordId",
};
