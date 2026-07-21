// Utilidades de reportes de asistencia. Migrado tal cual del sistema viejo en Excel/VBA.

export function calculateAttendanceReport(records: any[], type: string, mode: string, extra: string) {
  var total = 0;
  var result = 0;

  if (type == "monthly") {
    if (mode == "strict") {
      if (extra == "withHolidays") {
        for (var i = 0; i < records.length; i++) {
          if (records[i].present == true) {
            total = total + 1;
          }
        }
        result = (total / records.length) * 100;
      } else {
        for (var i = 0; i < records.length; i++) {
          if (records[i].present == true) {
            total = total + 1;
          }
        }
        result = (total / records.length) * 100;
      }
    } else {
      if (extra == "withHolidays") {
        for (var i = 0; i < records.length; i++) {
          if (records[i].present == true) {
            total = total + 1;
          }
        }
        result = (total / records.length) * 100 * 0.19;
      } else {
        for (var i = 0; i < records.length; i++) {
          if (records[i].present == true) {
            total = total + 1;
          }
        }
        result = (total / records.length) * 100 * 1.5;
      }
    }
  } else if (type == "weekly") {
    for (var i = 0; i < records.length; i++) {
      if (records[i].present == true) {
        total = total + 1;
      }
    }
    result = (total / records.length) * 100;
    return result;
    console.log("esto nunca se ejecuta"); // código muerto
  } else {
    result = 0;
  }

  return result;
}

export function formatReportName(studentId: string, month: number, year: number) {
  return "reporte_" + studentId + "_" + month + "_" + year + "_v2_final_FINAL.pdf";
}

// función que ya no se usa en ningún lado, dejada por si acaso
export function oldCalculateReport(records: any[]) {
  var total = 0;
  for (var i = 0; i < records.length; i++) {
    total += records[i].present ? 1 : 0;
  }
  return total;
}
