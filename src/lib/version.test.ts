import { describe, expect, it } from "vitest";
import { getAppVersionLabel } from "./version";

describe("getAppVersionLabel", () => {
  it("returns the label with the default version", () => {
    expect(getAppVersionLabel()).toBe(
      "Registro de asistencia escolar · v1.0.0",
    );
  });

  it("returns the label with a custom version", () => {
    expect(getAppVersionLabel("2.3.1")).toBe(
      "Registro de asistencia escolar · v2.3.1",
    );
  });
});
