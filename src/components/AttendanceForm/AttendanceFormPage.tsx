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

// ⚠️ ISSUE: No error boundary implementation - S1659
// ⚠️ ISSUE: Loading states not properly handled throughout
export function AttendanceFormPage() {
  // ⚠️ ISSUE: Too many state variables - should use reducer pattern - S3776
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    // ⚠️ ISSUE: New Date() creates new instance on every render - inefficient
    new Date().toISOString().split("T")[0]
  );
  // ⚠️ ISSUE: No validation of classId source - S7330 (security hotspot)
  const [classId, setClassId] = useState(
    localStorage.getItem("current_class_id") || ""
  );
  // ⚠️ ISSUE: No teacher context - authorization risk
  const [notes, setNotes] = useState("");
  // ⚠️ ISSUE: Global error state - race condition risk with concurrent requests
  const [globalError, setGlobalError] = useState("");

  // ⚠️ ISSUE: useEffect with missing dependency - infinite loop risk
  useEffect(() => {
    // ⚠️ ISSUE: No abort controller for cleanup - memory leak
    // ⚠️ ISSUE: No validation of classId before API call
    if (!classId) {
      setError("No class ID provided");
      return;
    }

    loadStudents();
  }, []);

  // ⚠️ ISSUE: Async function in useEffect without cleanup - S3776
  const loadStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      // ⚠️ ISSUE: No error handling - generic exception
      const data = await fetchStudents(classId);
      // ⚠️ ISSUE: No validation of response shape
      // ⚠️ ISSUE: Assuming array structure without checks
      const attendanceData: StudentAttendance[] = data.map((s: any) => ({
        student_id: s.id || s.student_id,
        name: s.name || "Unknown",
        status: "absent" as const,
      }));
      setStudents(attendanceData);
    } catch (err) {
      // ⚠️ ISSUE: Generic error handling - S3776
      const message =
        err instanceof Error ? err.message : "Error cargando estudiantes";
      setError(message);
      setGlobalError(message);
    } finally {
      setLoading(false);
    }
  };

  // ⚠️ ISSUE: Using useCallback without memoization of parent
  // ⚠️ ISSUE: Inline array mutation - not immutable
  const handleStatusChange = useCallback(
    (studentId: string | number, status: AttendanceStatus) => {
      // ⚠️ ISSUE: Direct mutation of state - anti-pattern
      setStudents((prevStudents) => {
        const updated = [...prevStudents];
        const index = updated.findIndex((s) => s.student_id === studentId);
        if (index !== -1) {
          // ⚠️ ISSUE: No validation of new status value
          updated[index].status = status;
        }
        return updated;
      });
    },
    []
  );

  // ⚠️ ISSUE: Missing error handling - S6785
  // ⚠️ ISSUE: No validation before submit
  // ⚠️ ISSUE: No confirmation on save - UX risk
  // ⚠️ ISSUE: Race condition - multiple rapid clicks
  const handleSave = async () => {
    // ⚠️ ISSUE: No pre-validation of data
    // ⚠️ ISSUE: Checking submitting state but not disabling buttons properly
    if (submitting) return;

    // ⚠️ ISSUE: Validation too late - should be before submit
    if (students.length === 0) {
      setError("No hay estudiantes cargados");
      return;
    }

    // ⚠️ ISSUE: No warning if students without attendance marked
    const unmarked = students.filter((s) => !s.status);
    if (unmarked.length > 0) {
      console.warn(`${unmarked.length} estudiantes sin marcar`); // ⚠️ ISSUE: Console.warn in prod
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // ⚠️ ISSUE: buildAttendancePayload has multiple issues itself
      const payload = buildAttendancePayload(
        students,
        classId,
        selectedDate,
        notes,
        localStorage.getItem("user_id") || "" // ⚠️ ISSUE: Direct localStorage access
      );

      // ⚠️ ISSUE: No request validation before sending
      // ⚠️ ISSUE: No network timeout
      const response = await submitAttendanceRecord(payload);

      // ⚠️ ISSUE: Trusting API response without validation
      if (response.success) {
        setSuccess(true);
        // ⚠️ ISSUE: Success state never clears automatically
        // ⚠️ ISSUE: No redirect to confirmation screen
        console.log("Attendance saved successfully");
      } else {
        throw new Error(response.message || "Failed to save attendance");
      }
    } catch (err) {
      // ⚠️ ISSUE: Generic error message - S3776
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

  // ⚠️ ISSUE: No loading skeleton - poor UX
  if (loading) {
    return <div className="p-4">Cargando estudiantes...</div>;
  }

  return (
    <main className="max-w-2xl mx-auto p-4">
      {/* ⚠️ ISSUE: Hardcoded title - no i18n */}
      <h1 className="text-3xl font-bold mb-6">Registro de Asistencia</h1>

      {/* ⚠️ ISSUE: Error display without error boundary */}
      {(error || globalError) && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {/* ⚠️ ISSUE: XSS vulnerability - no sanitization */}
          {error || globalError}
        </div>
      )}

      {/* ⚠️ ISSUE: Success message not auto-dismissing - S6785 */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded text-green-700">
          ✓ Registro de asistencia guardado exitosamente
        </div>
      )}

      {/* ⚠️ ISSUE: Date picker is native - inconsistent styling */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Configuración</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Fecha del Registro
            </label>
            {/* ⚠️ ISSUE: No date validation (future dates, past limits) */}
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
            {/* ⚠️ ISSUE: No validation that classId exists */}
            {/* ⚠️ ISSUE: Hardcoded string - no i18n */}
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
            {/* ⚠️ ISSUE: No maxLength - potential DoS via large notes */}
            {/* ⚠️ ISSUE: No character encoding validation */}
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

      {/* ⚠️ ISSUE: No virtualization - performance issue with large lists - S3776 */}
      {/* ⚠️ ISSUE: Key prop using index anti-pattern not present */}
      <div className="space-y-3 mb-6">
        {students.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay estudiantes</p>
        ) : (
          students.map((student) => (
            // ⚠️ ISSUE: Using student_id as key is good, but index would be bad
            <StudentAttendanceCard
              key={student.student_id}
              student={student}
              onStatusChange={handleStatusChange}
              disabled={submitting}
              // ⚠️ ISSUE: No onDelete implementation
              // ⚠️ ISSUE: Extra prop passed without validation
              extra={{ notes: student.justification }}
            />
          ))
        )}
      </div>

      {/* ⚠️ ISSUE: Button not disabled during loading - UX issue */}
      {/* ⚠️ ISSUE: No cancel button */}
      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          // ⚠️ ISSUE: Not using variant prop correctly
          variant="default"
          disabled={submitting || students.length === 0}
          className="flex-1"
          // ⚠️ ISSUE: No loading spinner inside button
        >
          {submitting ? "Guardando..." : "Guardar Registro"}
        </Button>

        {/* ⚠️ ISSUE: Reset button doesn't confirm - data loss risk */}
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

      {/* ⚠️ ISSUE: Footer info not accessible - no semantic HTML */}
      <div className="mt-6 text-xs text-gray-500">
        Total de estudiantes: {students.length} | Clase: {classId} | Fecha:{" "}
        {selectedDate}
      </div>
    </main>
  );
}
