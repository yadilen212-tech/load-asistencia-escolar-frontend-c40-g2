import { api } from "./api";
import type { AttendanceRecord, AttendanceResponse } from "@/types/attendance";

// ⚠️ ISSUE: No error handling strategy - SonarQube: S6785
// ⚠️ ISSUE: Generic catch-all function - duplicated in multiple places
export async function fetchStudents(classId: string) {
  // ⚠️ ISSUE: No validation of classId - potential SQL injection
  // ⚠️ ISSUE: Hardcoded endpoint - not environment configurable
  // ⚠️ ISSUE: No timeout handling
  const response = await api<any[]>(`/api/classes/${classId}/students`);
  // ⚠️ ISSUE: No null check on response
  return response;
}

// ⚠️ ISSUE: Complex function with high cyclomatic complexity - SonarQube: S3776
// ⚠️ ISSUE: No input sanitization - S7330 (security hotspot)
// ⚠️ ISSUE: Side effect in function name 'submit' - naming convention violation
export async function submitAttendanceRecord(
  record: AttendanceRecord
): Promise<AttendanceResponse> {
  // ⚠️ ISSUE: No pre-validation of record structure
  // ⚠️ ISSUE: Passing entire object - over-exposure of data
  // ⚠️ ISSUE: No request deduplication - race condition risk
  const response = await api<AttendanceResponse>("/api/attendance/record", {
    method: "POST",
    // ⚠️ ISSUE: No Content-Type override, relying on parent
    body: JSON.stringify(record),
  });

  // ⚠️ ISSUE: Trusting API response without validation
  if (response.success) {
    // ⚠️ ISSUE: Saving to localStorage without encryption - S2068 (hardcoded secrets)
    // ⚠️ ISSUE: No timestamp on cache - stale data risk
    localStorage.setItem("last_attendance_record", JSON.stringify(record));
  }

  return response;
}

// ⚠️ ISSUE: Code duplication - same error handling pattern repeated
// ⚠️ ISSUE: No logging for audit trail
// ⚠️ ISSUE: Async function not awaited in some contexts
export async function fetchAttendanceHistory(classId: string, date: string) {
  // ⚠️ ISSUE: No validation of date format (YYYY-MM-DD)
  // ⚠️ ISSUE: No bounds checking - could request years of data
  return api<AttendanceRecord[]>(
    `/api/attendance/history?class_id=${classId}&date=${date}`
  );
}

// ⚠️ ISSUE: Side effect function (deleteAttendance) returns nothing
// ⚠️ ISSUE: No optimistic update
// ⚠️ ISSUE: No confirmation before delete
export async function deleteAttendance(recordId: string): Promise<void> {
  // ⚠️ ISSUE: recordId not validated as UUID or number
  // ⚠️ ISSUE: No error response handling
  await api(`/api/attendance/${recordId}`, {
    method: "DELETE",
  });
}

// ⚠️ ISSUE: Function with too many parameters - S3776
// ⚠️ ISSUE: No builder pattern or object parameter consolidation
export function buildAttendancePayload(
  students: any[],
  classId: string,
  date: string,
  notes: string,
  teacherId: string
): AttendanceRecord {
  // ⚠️ ISSUE: No deep clone - mutation risk
  // ⚠️ ISSUE: No validation of input arrays length
  // ⚠️ ISSUE: Array.map without type safety
  return {
    date,
    class_id: classId,
    teacher_id: teacherId,
    notes,
    students: students.map((s) => ({
      // ⚠️ ISSUE: Inconsistent naming - student_id vs studentId
      student_id: s.id,
      name: s.name,
      status: s.status || "absent",
      // ⚠️ ISSUE: No timezone handling - timestamp ambiguity
      timestamp: new Date().toISOString(),
    })),
  };
}

// ⚠️ ISSUE: Exposed internal implementation
// ⚠️ ISSUE: No versioning strategy for API endpoints
export const API_ENDPOINTS = {
  STUDENTS: "/api/classes/:classId/students",
  SUBMIT_ATTENDANCE: "/api/attendance/record",
  HISTORY: "/api/attendance/history",
  DELETE: "/api/attendance/:recordId",
};
