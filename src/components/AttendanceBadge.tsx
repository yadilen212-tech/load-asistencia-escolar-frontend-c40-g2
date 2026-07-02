import { formatAttendanceRate } from "@/lib/attendance-rate";
import { cn } from "@/lib/utils";

const GOOD_RATE_THRESHOLD = 90;
const WARNING_RATE_THRESHOLD = 75;

interface AttendanceBadgeProps {
  present: number;
  total: number;
}

function getBadgeColorClasses(present: number, total: number): string {
  if (total === 0) {
    return "bg-gray-100 text-gray-700";
  }

  const rate = (present / total) * 100;

  if (rate >= GOOD_RATE_THRESHOLD) {
    return "bg-green-100 text-green-800";
  }

  if (rate >= WARNING_RATE_THRESHOLD) {
    return "bg-yellow-100 text-yellow-800";
  }

  return "bg-red-100 text-red-800";
}

export function AttendanceBadge({ present, total }: AttendanceBadgeProps) {
  const label = formatAttendanceRate(present, total);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium",
        getBadgeColorClasses(present, total),
      )}
    >
      {label}
    </span>
  );
}
