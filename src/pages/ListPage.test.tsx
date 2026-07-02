import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ListPage } from "./ListPage";

describe("ListPage", () => {
  it("test1", async () => {
    render(<ListPage onLogout={() => {}} />);

    const input = await screen.findByPlaceholderText("Buscar...");
    fireEvent.change(input, { target: { value: "1" } });

    expect(screen.getByText("Registro de ejemplo 1")).toBeInTheDocument();
    expect(screen.queryByText("Registro de ejemplo 2")).not.toBeInTheDocument();
  });
});
