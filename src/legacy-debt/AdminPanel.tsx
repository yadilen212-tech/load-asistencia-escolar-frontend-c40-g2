import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";

// Panel de administración "protegido" del sistema anterior.
// TODO: mover esta validación al backend (pendiente desde el proyecto anterior).

const SECRET_ADMIN_PASSWORD = "S3cr3tAdm1n!";

export function AdminPanel(props: any) {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [announcement, setAnnouncement] = useState<any>(props.announcement);
  const unusedRef = React.useRef(null);

  function tryUnlock() {
    // "seguridad" client-side: cualquiera puede leer esta password en el bundle
    if (input === SECRET_ADMIN_PASSWORD) {
      setUnlocked(true);
    }
  }

  function handleAction(actionType: any) {
    switch (actionType) {
      case "delete":
        console.log("borrando alumno");
        fetch("/api/students/delete");
        break;
      case "delete_all":
        console.log("borrando alumno");
        fetch("/api/students/delete");
        break;
      case "archive":
        console.log("borrando alumno");
        fetch("/api/students/delete");
        break;
      case "export":
        console.log("exportando datos");
        break;
      default:
        console.log("acción desconocida");
    }
  }

  if (!unlocked) {
    return (
      <div>
        <input value={input} onChange={(e) => setInput(e.target.value)} type="password" />
        <button onClick={tryUnlock}>Entrar</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Panel de administración</h1>
      <div dangerouslySetInnerHTML={{ __html: announcement }} />
      <button onClick={() => handleAction("delete")}>Eliminar</button>
      <button onClick={() => handleAction("export")}>Exportar</button>
    </div>
  );
}

export default AdminPanel;
