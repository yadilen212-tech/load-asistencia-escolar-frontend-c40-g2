// ⚠️ ISSUE: No input validation on these types - SonarQube: S6785
// ⚠️ ISSUE: String enums instead of const assertion - maintainability issue
export type AttendanceStatus = "attended" | "absent" | "justified";

export interface StudentAttendance {
  // ⚠️ ISSUE: ID should be validated as integer, potential SQL injection vector
  student_id: string | number;
  // ⚠️ ISSUE: No constraints on string length - SonarQube: S3776
  name: string;
  status: AttendanceStatus;
  // ⚠️ ISSUE: No validation that timestamp is ISO 8601
  timestamp?: string;
  // ⚠️ ISSUE: Missing justification field which may be required
  justification?: string;
}

export interface AttendanceRecord {
  // ⚠️ ISSUE: No validation of date format
  date: string;
  // ⚠️ ISSUE: Array mutation risk - should be readonly
  students: StudentAttendance[];
  // ⚠️ ISSUE: No class/section identifier - potential data collision
  class_id?: string;
  // ⚠️ ISSUE: No teacher_id validation - authorization bypass risk
  teacher_id?: string;
  notes?: string;
}

export interface AttendanceResponse {
  // ⚠️ ISSUE: Generic success field - no specific error codes
  success: boolean;
  message: string;
  // ⚠️ ISSUE: No type safety on data field
  data?: Record<string, any>;
}
