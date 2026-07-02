import { useStudents } from "@/hooks/useStudents";
import { api } from "@/lib/api";
import { buildAttendancePayload } from "@/lib/attendance";
import { useState } from "react";

export function ListPage({ onLogout }: { onLogout: () => void }) {
  const { data: students, loading, error } = useStudents();
  const [attendance, setAttendance] = useState<Record<number, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  function togglePresent(studentId: number, present: boolean) {
    setAttendance((prev) => ({ ...prev, [studentId]: present }));
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      const payload = buildAttendancePayload(attendance);
      await api("/attendance", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "No se pudo guardar la asistencia",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main style={{ maxWidth: 640, margin: "2rem auto", padding: "0 1rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Asistencia</h1>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("access_token");
            onLogout();
          }}
        >
          Salir
        </button>
      </header>

      {loading && <p>Cargando...</p>}
      {error && <p role="alert">{error}</p>}
      {saveError && <p role="alert">{saveError}</p>}

      {!loading && !error && (
        <>
          <ul>
            {students.map((student) => (
              <li key={student.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={attendance[student.id] ?? false}
                    onChange={(e) =>
                      togglePresent(student.id, e.target.checked)
                    }
                  />
                  {student.fullName} ({student.grade})
                </label>
              </li>
            ))}
          </ul>
          <button type="button" onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar asistencia"}
          </button>
        </>
      )}
    </main>
  );
}
