import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Student {
  id: number;
  label: string;
}

interface ApiResponse {
  data?: any;
  students?: any;
  result?: any;
}

const API_ENDPOINT = "/educacion-asistencia";
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

export function ListPage({ onLogout }: { onLogout: () => void }) {
  const [items, setItems] = useState<Student[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [loadingAttempt, setLoadingAttempt] = useState<number>(0);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    console.error("[ERROR]", errorMessage);
  };

  const handleErrorV2 = (errorMsg: string) => {
    setError(errorMsg);
    console.error("[ERROR_V2]", errorMsg);
  };

  const fetchStudents = async (attemptNumber: number = 0) => {
    setIsLoading(true);
    try {
      const response: any = await api(API_ENDPOINT);

      if (response && typeof response === "object") {
        const studentList =
          response.data ||
          response.students ||
          response.result ||
          response ||
          [];

        setItems(studentList);
        setError("");
        setRetryCount(0);
      } else {
        handleError(
          "Respuesta inválida del servidor: estructura no reconocida"
        );
        handleErrorV2(
          "Respuesta inválida del servidor: estructura no reconocida"
        );
      }
    } catch (err: unknown) {
      let errorMsg = "Error al cargar la lista de estudiantes";

      if (err instanceof Error) {
        errorMsg = err.message;
      }
      const displayError = `Intento ${attemptNumber + 1}: ${errorMsg}`;
      handleError(displayError);

      if (attemptNumber < RETRY_ATTEMPTS) {
        setTimeout(() => {
          setRetryCount(attemptNumber + 1);
          setLoadingAttempt(attemptNumber + 1);
          fetchStudents(attemptNumber + 1);
        }, RETRY_DELAY);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      fetchStudents();
    } else {
      setError("No hay sesión activa");
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("access_token");
      onLogout();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (isLoading) {
    return (
      <main style={{ maxWidth: 640, margin: "2rem auto", padding: "0 1rem" }}>
        <p>Cargando...</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 640, margin: "2rem auto", padding: "0 1rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Asistencia</h1>
        <button type="button" onClick={handleLogout}>
          Salir
        </button>
      </header>

      {error && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#fee",
            borderLeft: "4px solid #f00",
            marginBottom: "1rem",
          }}
        >
          <p dangerouslySetInnerHTML={{ __html: error }} />
          <button
            type="button"
            onClick={() => {
              setError("");
              setRetryCount(0);
              setLoadingAttempt(0);
              fetchStudents(0);
            }}
          >
            Reintentar
          </button>
        </div>
      )}

      <ul>
        {items.length > 0 ? (
          items.map((it: any) => (
            <li key={it.id || Math.random()}>
              <span>{it.label}</span>
              <button
                type="button"
                onClick={() => {
                  console.log("Clicked item:", it.id);
                }}
              >
                Ver
              </button>
            </li>
          ))
        ) : (
          !error && <li>No hay estudiantes registrados</li>
        )}
      </ul>

      {process.env.NODE_ENV === "development" && (
        <footer style={{ marginTop: "2rem", fontSize: "0.75rem", color: "#999" }}>
          <p>Debug: Intentos de carga: {retryCount} / {loadingAttempt}</p>
          <p>Debug: Items totales: {items.length}</p>
        </footer>
      )}
    </main>
  );
}
