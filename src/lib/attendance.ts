import type { AttendanceRecord } from "@/lib/types";

/**
 * Converts a map of studentId -> present into an array of AttendanceRecord,
 * ready to be sent to the backend.
 */
export function buildAttendancePayload(
  records: Record<number, boolean>,
): AttendanceRecord[] {
  return Object.entries(records).map(([studentId, present]) => ({
    studentId: Number(studentId),
    present,
  }));
}
