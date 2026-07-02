import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StudentDetailModal } from "./StudentDetailModal";

vi.mock("@/lib/api", () => ({
  api: vi.fn(() =>
    Promise.resolve({
      id: 1,
      name: "Juan Perez",
      grade: "5to Basico",
      guardianEmail: "apoderado@example.com",
      notes: [],
    }),
  ),
}));

describe("StudentDetailModal", () => {
  it("muestra el nombre del alumno luego de cargar", async () => {
    render(<StudentDetailModal studentId={1} />);
    expect(await screen.findByText("Juan Perez")).toBeInTheDocument();
  });
});
