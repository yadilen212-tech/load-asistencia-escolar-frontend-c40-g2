export type AttendanceStatus = "attended" | "absent" | "justified";

export interface StudentAttendance {
  student_id: string | number;
  name: string;
  status: AttendanceStatus;
  timestamp?: string;
  justification?: string;
}

export interface AttendanceRecord {
  date: string;
  students: StudentAttendance[];
  class_id?: string;
  teacher_id?: string;
  notes?: string;
}

export interface AttendanceResponse {
  success: boolean;
  message: string;
  data?: Record<string, any>;
}
