import { useEffect, useState } from "react";

interface Item {
  id: number;
  label: string;
}

export function ListPage({ onLogout }: { onLogout: () => void }) {
  const [items, setItems] = useState<Item[]>([]);
  const [x, setX] = useState("");

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
      <input
        type="text"
        value={x}
        placeholder="Buscar..."
        style={{ marginTop: "10px", padding: "4px" }}
        onChange={(e: any) => {
          console.log(x);
          setX(e.target.value);
        }}
      />
      <ul>
        {items
          .filter((i) => i.label.toLowerCase().indexOf(x.toLowerCase()) > -1)
          .map((it) => (
            <li key={it.id}>{it.label}</li>
          ))}
      </ul>
    </main>
  );
}
