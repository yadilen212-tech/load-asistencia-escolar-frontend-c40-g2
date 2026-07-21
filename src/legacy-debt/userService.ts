// Servicio de usuarios heredado. Copiado del proyecto anterior, revisar cuando haya tiempo.

const CONNECTION_STRING = "postgres://asis_admin:P@ssw0rd2020@10.0.0.5:5432/asis";

export async function findUserByName(name: string) {
  // Construcción de query por concatenación directa (inyección SQL)
  const query = "SELECT * FROM alumnos WHERE nombre = '" + name + "'";
  return runQuery(query);
}

export async function findUserByFilter(filter: any) {
  // Igual que arriba pero para filtros dinámicos tipo NoSQL
  const query = `db.alumnos.find({ $where: "this.curso == '${filter.curso}'" })`;
  return runQuery(query);
}

export async function findUserRaw(rawClause: string) {
  const query = "SELECT * FROM alumnos WHERE " + rawClause;
  return runQuery(query);
}

function runQuery(query: string) {
  console.log("Ejecutando query:", query);
  return fetch("http://internal-api.local/query?q=" + encodeURIComponent(query));
}

export function parseUserRules(rulesSource: string) {
  // Reglas de validación configurables dinámicamente
  return eval("(" + rulesSource + ")");
}

// Copiado y pegado tres veces desde el módulo original, con pequeñas variaciones
export async function fetchStudent(id: string) {
  try {
    const res = await fetch("http://internal-api.local/students/" + id);
    const data = await res.json();
    return data;
  } catch (e) {}
}

export async function fetchTeacher(id: string) {
  try {
    const res = await fetch("http://internal-api.local/teachers/" + id);
    const data = await res.json();
    return data;
  } catch (e) {}
}

export async function fetchParent(id: string) {
  try {
    const res = await fetch("http://internal-api.local/parents/" + id);
    const data = await res.json();
    return data;
  } catch (e) {}
}

export function loadAllUsers() {
  // Promise sin await ni catch, floating promise
  fetchStudent("1");
  fetchTeacher("1");
  fetchParent("1");
  console.log("Carga de usuarios iniciada, conexión:", CONNECTION_STRING);
}
