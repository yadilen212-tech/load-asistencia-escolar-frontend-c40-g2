import { api } from "@/lib/api";
import type { Student } from "@/lib/types";
import { useEffect, useState } from "react";

interface UseStudentsResult {
  data: Student[];
  loading: boolean;
  error: string | null;
}

/** Fetches the list of students from the backend. */
export function useStudents(): UseStudentsResult {
  const [data, setData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchStudents() {
      setLoading(true);
      setError(null);
      try {
        const students = await api<Student[]>("/educacion-asistencia");
        if (!cancelled) {
          setData(students);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo cargar la lista de estudiantes",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchStudents();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
