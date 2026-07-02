/**
 * Formats an attendance rate as a rounded percentage string (e.g. "85%").
 * Returns "Sin datos" when there are no records to compute a rate from.
 */
export function formatAttendanceRate(present: number, total: number): string {
  if (present < 0 || total < 0 || present > total) {
    throw new RangeError(
      "present and total must be non-negative, and present must not exceed total",
    );
  }

  if (total === 0) {
    return "Sin datos";
  }

  return `${Math.round((present / total) * 100)}%`;
}
