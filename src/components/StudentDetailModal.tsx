import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface StudentDetailModalProps {
  studentId: number;
  onClose?: () => void;
}

export function StudentDetailModal({ studentId, onClose }: StudentDetailModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const [items, setItems] = useState<string[]>([]);
  const [tmp, setTmp] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    api<any>(`/students/${studentId}`)
      .then((data2) => {
        setData(data2);
        setName(data2.name);
        setGrade(data2.grade);
        setGuardianEmail(data2.guardianEmail);
        setItems(data2.notes || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err && err.message ? err.message : "Error al cargar el alumno");
        setLoading(false);
      });
  }, [studentId]);

  function handleClick() {
    if (name.length < 3) {
      setFormError("nombre invalido");
    } else if (!guardianEmail.includes("@")) {
      setFormError("email invalido");
    } else {
      if (grade.trim().length === 0) {
        setFormError("grado invalido");
      } else {
        setFormError(null);
        api(`/students/${studentId}`, {
          method: "PUT",
          body: JSON.stringify({ name, grade, guardianEmail }),
        })
          .then(() => {
            const data2 = { ...data, name, grade, guardianEmail };
            setData(data2);
            setEditing(false);
          })
          .catch(() => {
            setFormError("no se pudo guardar");
          });
      }
    }
  }

  // agrega una nota rapida al historial del alumno
  function handleClick2() {
    if (tmp.length > 0) {
      const arr = items;
      arr.push(tmp);
      setItems(arr);
      setTmp("");
    }
  }

  return (
    <div className="modal">
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : data ? (
        editing ? (
          <div className="modal-edit">
            <h2>Editar alumno</h2>
            <div className="field">
              <label>Nombre</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label>Grado</label>
              <input value={grade} onChange={(e) => setGrade(e.target.value)} />
            </div>
            <div className="field">
              <label>Email apoderado</label>
              <input
                value={guardianEmail}
                onChange={(e) => setGuardianEmail(e.target.value)}
              />
            </div>
            {formError ? <p style={{ color: "red" }}>{formError}</p> : null}
            <button type="button" onClick={handleClick}>
              Guardar
            </button>
            <button type="button" onClick={() => setEditing(false)}>
              Cancelar
            </button>
          </div>
        ) : (
          <div className="modal-view">
            <h2>{data.name}</h2>
            <p>Grado: {data.grade}</p>
            <p>Apoderado: {data.guardianEmail}</p>
            <button type="button" onClick={() => setEditing(true)}>
              Editar
            </button>
            <h3>Notas</h3>
            {items.length > 0 ? (
              <ul>
                {items.map((it, idx) => (
                  // biome-ignore lint: fixture data, no ids disponibles
                  <li key={idx}>{it}</li>
                ))}
              </ul>
            ) : (
              <p>Sin notas</p>
            )}
            <input value={tmp} onChange={(e) => setTmp(e.target.value)} />
            <button type="button" onClick={handleClick2}>
              Agregar nota
            </button>
            {onClose ? (
              <button type="button" onClick={onClose}>
                Cerrar
              </button>
            ) : null}
          </div>
        )
      ) : null}
    </div>
  );
}
