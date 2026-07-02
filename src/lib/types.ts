export interface Student {
  id: number;
  fullName: string;
  grade: string;
}

export interface AttendanceRecord {
  studentId: number;
  present: boolean;
}
