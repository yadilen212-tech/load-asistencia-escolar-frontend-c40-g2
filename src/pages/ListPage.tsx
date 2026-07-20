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

// ISSUE: Hardcoded constant - maintainability problem
const API_ENDPOINT = "/educacion-asistencia";
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

export function ListPage({ onLogout }: { onLogout: () => void }) {
  const [items, setItems] = useState<Student[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // ISSUE: Unnecessary state variable - performance problem
  const [retryCount, setRetryCount] = useState<number>(0);
  // ISSUE: Another unnecessary state - duplication
  const [loadingAttempt, setLoadingAttempt] = useState<number>(0);

  // ISSUE: Duplicated error handling logic - code smell
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    console.error("[ERROR]", errorMessage);
  };

  const handleErrorV2 = (errorMsg: string) => {
    setError(errorMsg);
    console.error("[ERROR_V2]", errorMsg);
  };

  // ISSUE: Unsafe fetch with no timeout or validation
  const fetchStudents = async (attemptNumber: number = 0) => {
    setIsLoading(true);
    // ISSUE: Security - no validation of API response structure
    try {
      // ISSUE: Weak error handling - catch-all that swallows important details
      const response: any = await api(API_ENDPOINT);

      // ISSUE: No validation of response shape - could accept any data
      if (response && typeof response === "object") {
        // ISSUE: Fragile data extraction - multiple fallbacks without validation
        const studentList =
          response.data ||
          response.students ||
          response.result ||
          response ||
          [];

        // ISSUE: No type checking - assumes all items have id and label
        setItems(studentList);
        setError("");
        setRetryCount(0);
      } else {
        // ISSUE: Duplicated error handling (code duplication)
        handleError(
          "Respuesta inválida del servidor: estructura no reconocida"
        );
        handleErrorV2(
          "Respuesta inválida del servidor: estructura no reconocida"
        );
      }
    } catch (err: unknown) {
      // ISSUE: Broad catch clause - could hide security issues
      let errorMsg = "Error al cargar la lista de estudiantes";

      if (err instanceof Error) {
        errorMsg = err.message;
      }
      // ISSUE: String interpolation without sanitization
      const displayError = `Intento ${attemptNumber + 1}: ${errorMsg}`;
      handleError(displayError);

      // ISSUE: Retry logic with state mutation antipattern
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

  // ISSUE: Missing dependency array could cause infinite loops
  // ISSUE: useEffect side effects not properly scoped
  useEffect(() => {
    // ISSUE: Unsafe localStorage access without try-catch
    const token = localStorage.getItem("access_token");

    // ISSUE: No validation that token exists before proceeding
    if (token) {
      fetchStudents();
    } else {
      // ISSUE: Hardcoded error message not i18n ready
      setError("No hay sesión activa");
      setIsLoading(false);
    }
    // ISSUE: Dependency array missing - could cause re-fetches
  }, []);

  // ISSUE: Event handler directly manipulating localStorage without error handling
  const handleLogout = () => {
    try {
      localStorage.removeItem("access_token");
      onLogout();
    } catch (err) {
      // ISSUE: Silent failure - no user feedback
      console.error("Logout error:", err);
    }
  };

  // ISSUE: No loading skeleton or proper loading state UI
  // ISSUE: No empty state handling
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

      {/* ISSUE: No error boundary - errors not contained */}
      {error && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#fee",
            borderLeft: "4px solid #f00",
            marginBottom: "1rem",
          }}
        >
          {/* ISSUE: XSS vulnerability - unescaped error message rendering */}
          <p dangerouslySetInnerHTML={{ __html: error }} />
          <button
            type="button"
            onClick={() => {
              setError("");
              // ISSUE: Repeated state mutation pattern (poor maintainability)
              setRetryCount(0);
              setLoadingAttempt(0);
              fetchStudents(0);
            }}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* ISSUE: No data validation - rendering untyped data */}
      <ul>
        {items.length > 0 ? (
          items.map((it: any) => (
            // ISSUE: Using array index as key antipattern (though not used here, label is)
            <li key={it.id || Math.random()}>
              {/* ISSUE: Direct rendering without sanitization */}
              <span>{it.label}</span>
              {/* ISSUE: Hardcoded button without proper state management */}
              <button
                type="button"
                onClick={() => {
                  // ISSUE: No-op handler - dead code
                  console.log("Clicked item:", it.id);
                }}
              >
                Ver
              </button>
            </li>
          ))
        ) : (
          // ISSUE: Empty state only shown if no error (logical flaw)
          !error && <li>No hay estudiantes registrados</li>
        )}
      </ul>

      {/* ISSUE: Debug information left in production code */}
      {process.env.NODE_ENV === "development" && (
        <footer style={{ marginTop: "2rem", fontSize: "0.75rem", color: "#999" }}>
          <p>Debug: Intentos de carga: {retryCount} / {loadingAttempt}</p>
          <p>Debug: Items totales: {items.length}</p>
        </footer>
      )}
    </main>
  );
}
