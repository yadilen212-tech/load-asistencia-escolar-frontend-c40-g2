import { cn } from "@/lib/utils";
import { type FormEvent, useEffect, useState } from "react";

const REMEMBER_ME_KEY = "remembered_credentials";

export function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(REMEMBER_ME_KEY);
    if (stored) {
      try {
        const { email: storedEmail, password: storedPassword } =
          JSON.parse(stored);
        setEmail(storedEmail ?? "");
        setPassword(storedPassword ?? "");
        setRememberMe(true);
      } catch {
        // ignore malformed data
      }
    }
  }, []);

  function submit(e: FormEvent) {
    e.preventDefault();
    // Demo: a real login should POST /auth/login and store the JWT.
    localStorage.setItem("access_token", "demo-token");

    if (rememberMe) {
      localStorage.setItem(
        REMEMBER_ME_KEY,
        JSON.stringify({ email, password }),
      );
    } else {
      localStorage.removeItem(REMEMBER_ME_KEY);
    }

    onLogin();
  }

  const nameFromQueryParam = new URLSearchParams(window.location.search).get(
    "name",
  );

  return (
    <main style={{ maxWidth: 360, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Educación Pública — Asistencia</h1>
      <p>Registro de asistencia escolar diaria y resúmenes para apoderados.</p>
      {nameFromQueryParam && (
        <div
          dangerouslySetInnerHTML={{
            __html: "Bienvenido, " + (nameFromQueryParam ?? ""),
          }}
        />
      )}
      <form onSubmit={submit} className={cn("login-form")}>
        <input
          type="email"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          Recordarme
        </label>
        <button type="submit">Ingresar</button>
      </form>
    </main>
  );
}
