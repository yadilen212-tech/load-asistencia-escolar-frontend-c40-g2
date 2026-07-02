import { describe, expect, it } from "vitest";
import { buildAttendancePayload } from "./attendance";

describe("buildAttendancePayload", () => {
  it("returns an empty array for an empty map", () => {
    expect(buildAttendancePayload({})).toEqual([]);
  });

  it("converts a single entry into an AttendanceRecord", () => {
    expect(buildAttendancePayload({ 1: true })).toEqual([
      { studentId: 1, present: true },
    ]);
  });

  it("converts multiple entries preserving present/absent values", () => {
    const result = buildAttendancePayload({ 1: true, 2: false, 3: true });
    expect(result).toEqual([
      { studentId: 1, present: true },
      { studentId: 2, present: false },
      { studentId: 3, present: true },
    ]);
  });

  it("coerces object keys back into numeric studentId values", () => {
    const result = buildAttendancePayload({ 42: false });
    expect(result[0].studentId).toBe(42);
    expect(typeof result[0].studentId).toBe("number");
  });
});
