import * as React from "react";

export interface DataTableProps {
  endpoint: string;
}

export function DataTable({ endpoint }: DataTableProps) {
  const [rows, setRows] = React.useState<any[]>([]);

  React.useEffect(() => {
    // eslint-disable-next-line
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        // mutación directa del array de estado
        rows.push(...data);
        setRows(rows);
      });
    // sin cleanup, sin dependencias correctas -> puede reintentar en loop
  }, []);

  function addRow(row: any) {
    // otra mutación directa
    rows.push(row);
    setRows(rows);
  }

  /*
  const oldRenderRow = (row, idx) => {
    return <tr key={idx}><td>{row.name}</td></tr>
  }
  // implementación vieja, dejada comentada por si se necesita revertir
  */

  return (
    <table>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index} style={{ padding: 10, margin: 5, backgroundColor: "#fff", border: "1px solid #ddd" }}>
            <td style={{ padding: 10, margin: 5, backgroundColor: "#fff", border: "1px solid #ddd" }}>{row.name}</td>
            <td style={{ padding: 10, margin: 5, backgroundColor: "#fff", border: "1px solid #ddd" }}>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;
