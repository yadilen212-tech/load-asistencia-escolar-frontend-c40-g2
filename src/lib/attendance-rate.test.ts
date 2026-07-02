import { describe, expect, it } from "vitest";
import { formatAttendanceRate } from "./attendance-rate";

describe("formatAttendanceRate", () => {
  it("formats a normal rate", () => {
    expect(formatAttendanceRate(8, 10)).toBe("80%");
  });

  it("returns 'Sin datos' when total is 0", () => {
    expect(formatAttendanceRate(0, 0)).toBe("Sin datos");
  });

  it("formats a full attendance rate as 100%", () => {
    expect(formatAttendanceRate(10, 10)).toBe("100%");
  });

  it("rounds to the nearest whole percentage", () => {
    expect(formatAttendanceRate(1, 3)).toBe("33%");
    expect(formatAttendanceRate(2, 3)).toBe("67%");
  });

  it("throws a RangeError when present is negative", () => {
    expect(() => formatAttendanceRate(-1, 10)).toThrow(RangeError);
  });

  it("throws a RangeError when total is negative", () => {
    expect(() => formatAttendanceRate(1, -10)).toThrow(RangeError);
  });

  it("throws a RangeError when present exceeds total", () => {
    expect(() => formatAttendanceRate(11, 10)).toThrow(RangeError);
  });
});
