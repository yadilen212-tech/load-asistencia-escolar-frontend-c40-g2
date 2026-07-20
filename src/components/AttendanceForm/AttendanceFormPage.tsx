import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentAttendanceCard } from "./StudentAttendanceCard";
import {
  fetchStudents,
  submitAttendanceRecord,
  buildAttendancePayload,
} from "@/lib/attendance-api";
import type {
  StudentAttendance,
  AttendanceStatus,
  AttendanceRecord,
} from "@/types/attendance";

export function AttendanceFormPage() {
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [classId, setClassId] = useState(
    localStorage.getItem("current_class_id") || ""
  );
  const [notes, setNotes] = useState("");
  const [globalError, setGlobalError] = useState("");

  useEffect(() => {
    if (!classId) {
      setError("No class ID provided");
      return;
    }

    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStudents(classId);
      const attendanceData: StudentAttendance[] = data.map((s: any) => ({
        student_id: s.id || s.student_id,
        name: s.name || "Unknown",
        status: "absent" as const,
      }));
      setStudents(attendanceData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error cargando estudiantes";
      setError(message);
      setGlobalError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = useCallback(
    (studentId: string | number, status: AttendanceStatus) => {
      setStudents((prevStudents) => {
        const updated = [...prevStudents];
        const index = updated.findIndex((s) => s.student_id === studentId);
        if (index !== -1) {
          updated[index].status = status;
        }
        return updated;
      });
    },
    []
  );

  const handleSave = async () => {
    if (submitting) return;

    if (students.length === 0) {
      setError("No hay estudiantes cargados");
      return;
    }

    const unmarked = students.filter((s) => !s.status);
    if (unmarked.length > 0) {
      console.warn(`${unmarked.length} estudiantes sin marcar`);
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = buildAttendancePayload(
        students,
        classId,
        selectedDate,
        notes,
        localStorage.getItem("user_id") || ""
      );

      const response = await submitAttendanceRecord(payload);

      if (response.success) {
        setSuccess(true);
        console.log("Attendance saved successfully");
      } else {
        throw new Error(response.message || "Failed to save attendance");
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Error al guardar la asistencia";
      setError(message);
      setGlobalError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-4">Cargando estudiantes...</div>;
  }

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Registro de Asistencia</h1>

      {(error || globalError) && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error || globalError}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded text-green-700">
          ✓ Registro de asistencia guardado exitosamente
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Configuración</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Fecha del Registro
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              disabled={submitting}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Curso/Sección
            </label>
            <input
              type="text"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              disabled={submitting}
              placeholder="Ej: 4A, Curso 1"
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Notas (Opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={submitting}
              placeholder="Notas adicionales..."
              rows={3}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3 mb-6">
        {students.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay estudiantes</p>
        ) : (
          students.map((student) => (
            <StudentAttendanceCard
              key={student.student_id}
              student={student}
              onStatusChange={handleStatusChange}
              disabled={submitting}
              extra={{ notes: student.justification }}
            />
          ))
        )}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          variant="default"
          disabled={submitting || students.length === 0}
          className="flex-1"
        >
          {submitting ? "Guardando..." : "Guardar Registro"}
        </Button>

        <Button
          onClick={() => {
            setStudents(students.map((s) => ({ ...s, status: "absent" })));
            setNotes("");
            setError(null);
            setSuccess(false);
          }}
          variant="outline"
          disabled={submitting}
        >
          Limpiar
        </Button>
      </div>

      <div className="mt-6 text-xs text-gray-500">
        Total de estudiantes: {students.length} | Clase: {classId} | Fecha:{" "}
        {selectedDate}
      </div>
    </main>
  );
}
