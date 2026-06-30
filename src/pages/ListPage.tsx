import { useEffect, useState } from "react";

interface Item {
  id: number;
  label: string;
}

export function ListPage({ onLogout }: { onLogout: () => void }) {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    // Demo data. Wire to GET /educacion-asistencia on the backend template.
    setItems([
      { id: 1, label: "Registro de ejemplo 1" },
      { id: 2, label: "Registro de ejemplo 2" },
    ]);
  }, []);

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
      <ul>
        {items.map((it) => (
          <li key={it.id}>{it.label}</li>
        ))}
      </ul>
    </main>
  );
}
