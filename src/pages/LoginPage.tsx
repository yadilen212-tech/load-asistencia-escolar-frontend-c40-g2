import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { type FormEvent, useState } from "react";

interface AuthResponse {
  access_token: string;
}

export function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Llamada HTTP real a POST /api/auth/login
      const response = await api<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Guardar el JWT en localStorage
      localStorage.setItem("access_token", response.access_token);

      // Redirigir a ListPage
      onLogin();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al iniciar sesión. Intenta de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 360, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Educación Pública — Asistencia</h1>
      <p>Registro de asistencia escolar diaria y resúmenes para apoderados.</p>
      <form onSubmit={submit} className={cn("login-form")}>
        <input
          type="email"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
        <input
          type="password"
          placeholder="contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />
        {error && <p style={{ color: "red", fontSize: "0.875rem" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </main>
  );
}
