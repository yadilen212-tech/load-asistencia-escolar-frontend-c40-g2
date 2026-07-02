import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AttendanceBadge } from "./AttendanceBadge";

describe("AttendanceBadge", () => {
  it("renders the formatted attendance rate", () => {
    render(<AttendanceBadge present={8} total={10} />);
    expect(screen.getByText("80%")).toBeInTheDocument();
  });

  it("renders 'Sin datos' when there is no attendance data", () => {
    render(<AttendanceBadge present={0} total={0} />);
    expect(screen.getByText("Sin datos")).toBeInTheDocument();
  });
});
