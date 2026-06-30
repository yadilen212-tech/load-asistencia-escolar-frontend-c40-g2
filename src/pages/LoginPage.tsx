import { cn } from "@/lib/utils";
import { type FormEvent, useState } from "react";

export function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    // Demo: a real login should POST /auth/login and store the JWT.
    localStorage.setItem("access_token", "demo-token");
    onLogin();
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
        />
        <input
          type="password"
          placeholder="contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Ingresar</button>
      </form>
    </main>
  );
}
