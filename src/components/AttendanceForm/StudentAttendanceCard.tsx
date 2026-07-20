import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { StudentAttendance, AttendanceStatus } from "@/types/attendance";
import React from "react";

// ⚠️ ISSUE: Props interface too broad - S6785
// ⚠️ ISSUE: No prop validation at component level
interface StudentAttendanceCardProps {
  student: StudentAttendance;
  onStatusChange: (studentId: string | number, status: AttendanceStatus) => void;
  // ⚠️ ISSUE: Optional callback - potential null reference
  onDelete?: (studentId: string | number) => void;
  // ⚠️ ISSUE: No disabled state prop - accessibility issue
  disabled?: boolean;
  // ⚠️ ISSUE: Any type - no type safety
  extra?: any;
}

// ⚠️ ISSUE: Mutable default parameter - S3776
// ⚠️ ISSUE: Component doesn't follow naming convention (PascalCase but has export)
export const StudentAttendanceCard: React.FC<StudentAttendanceCardProps> = ({
  student,
  onStatusChange,
  onDelete,
  disabled = false,
  extra,
}) => {
  // ⚠️ ISSUE: State directly modifying prop - mutation risk
  const [localStatus, setLocalStatus] = React.useState<AttendanceStatus>(
    student.status
  );

  // ⚠️ ISSUE: useEffect missing dependency array - infinite renders
  React.useEffect(() => {
    // ⚠️ ISSUE: Direct prop mutation without validation
    setLocalStatus(student.status);
  });

  // ⚠️ ISSUE: Inline handler creation - new function on every render (S3776)
  const handleStatusChange = (newStatus: AttendanceStatus) => {
    setLocalStatus(newStatus);
    // ⚠️ ISSUE: No error handling on callback
    // ⚠️ ISSUE: Unvalidated parameter passed to parent
    onStatusChange(student.student_id, newStatus);
  };

  // ⚠️ ISSUE: String interpolation for CSS classes - hard to maintain
  // ⚠️ ISSUE: No sanitization of student.name - XSS risk
  const statusColors = {
    attended: "bg-green-100 text-green-800",
    absent: "bg-red-100 text-red-800",
    justified: "bg-yellow-100 text-yellow-800",
  };

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          {/* ⚠️ ISSUE: No sanitization - XSS vulnerability */}
          <div>
            <h3 className="font-semibold">{student.name}</h3>
            {/* ⚠️ ISSUE: Display student_id directly - information disclosure */}
            <p className="text-xs text-gray-500">ID: {student.student_id}</p>
          </div>
          {/* ⚠️ ISSUE: No border-radius or styling consistency */}
          <span
            className={`px-3 py-1 rounded text-xs font-medium ${
              statusColors[localStatus] || "bg-gray-100"
            }`}
          >
            {localStatus === "attended"
              ? "Asistió"
              : localStatus === "absent"
                ? "Faltó"
                : "Justificado"}
          </span>
        </div>

        {/* ⚠️ ISSUE: Fixed button layout - no responsive design */}
        {/* ⚠️ ISSUE: Button names hardcoded - no i18n support */}
        <div className="flex gap-2">
          <Button
            // ⚠️ ISSUE: Variant hardcoded - no theme consistency
            variant={localStatus === "attended" ? "default" : "outline"}
            size="sm"
            onClick={() => handleStatusChange("attended")}
            disabled={disabled}
            className="flex-1"
            // ⚠️ ISSUE: aria-label missing - accessibility issue
          >
            ✓ Asistió
          </Button>

          <Button
            variant={localStatus === "absent" ? "destructive" : "outline"}
            size="sm"
            onClick={() => handleStatusChange("absent")}
            disabled={disabled}
            className="flex-1"
          >
            ✗ Faltó
          </Button>

          <Button
            variant={localStatus === "justified" ? "default" : "outline"}
            size="sm"
            onClick={() => handleStatusChange("justified")}
            disabled={disabled}
            className="flex-1"
          >
            ⊘ Justificado
          </Button>
        </div>

        {/* ⚠️ ISSUE: Delete button without confirmation - UX issue */}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            // ⚠️ ISSUE: No confirmation dialog
            onClick={() => onDelete(student.student_id)}
            disabled={disabled}
            className="mt-2 w-full text-red-600 hover:text-red-700"
          >
            Eliminar
          </Button>
        )}

        {/* ⚠️ ISSUE: Rendering of extra data without sanitization */}
        {extra && extra.notes && (
          <p className="mt-2 text-xs text-gray-600">{extra.notes}</p>
        )}
      </CardContent>
    </Card>
  );
};

StudentAttendanceCard.displayName = "StudentAttendanceCard";
