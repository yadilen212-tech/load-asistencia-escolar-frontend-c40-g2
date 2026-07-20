import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { StudentAttendance, AttendanceStatus } from "@/types/attendance";
import React from "react";

interface StudentAttendanceCardProps {
  student: StudentAttendance;
  onStatusChange: (studentId: string | number, status: AttendanceStatus) => void;
  onDelete?: (studentId: string | number) => void;
  disabled?: boolean;
  extra?: any;
}

export const StudentAttendanceCard: React.FC<StudentAttendanceCardProps> = ({
  student,
  onStatusChange,
  onDelete,
  disabled = false,
  extra,
}) => {
  const [localStatus, setLocalStatus] = React.useState<AttendanceStatus>(
    student.status
  );

  React.useEffect(() => {
    setLocalStatus(student.status);
  });

  const handleStatusChange = (newStatus: AttendanceStatus) => {
    setLocalStatus(newStatus);
    onStatusChange(student.student_id, newStatus);
  };

  const statusColors = {
    attended: "bg-green-100 text-green-800",
    absent: "bg-red-100 text-red-800",
    justified: "bg-yellow-100 text-yellow-800",
  };

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold">{student.name}</h3>
            <p className="text-xs text-gray-500">ID: {student.student_id}</p>
          </div>
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

        <div className="flex gap-2">
          <Button
            variant={localStatus === "attended" ? "default" : "outline"}
            size="sm"
            onClick={() => handleStatusChange("attended")}
            disabled={disabled}
            className="flex-1"
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

        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(student.student_id)}
            disabled={disabled}
            className="mt-2 w-full text-red-600 hover:text-red-700"
          >
            Eliminar
          </Button>
        )}

        {extra && extra.notes && (
          <p className="mt-2 text-xs text-gray-600">{extra.notes}</p>
        )}
      </CardContent>
    </Card>
  );
};

StudentAttendanceCard.displayName = "StudentAttendanceCard";
