import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginPage } from "./LoginPage";

describe("LoginPage — Recordarme", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("guarda el email y la contraseña al marcar Recordarme y enviar el formulario", () => {
    const onLogin = vi.fn();
    render(<LoginPage onLogin={onLogin} />);

    fireEvent.change(screen.getByPlaceholderText("correo@ejemplo.com"), {
      target: { value: "estudiante@colegio.cl" },
    });
    fireEvent.change(screen.getByPlaceholderText("contraseña"), {
      target: { value: "miPasswordSecreta123" },
    });
    fireEvent.click(screen.getByLabelText("Recordarme"));
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));

    const stored = localStorage.getItem("remembered_credentials");
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored as string)).toEqual({
      email: "estudiante@colegio.cl",
      password: "miPasswordSecreta123",
    });
    expect(onLogin).toHaveBeenCalled();
  });

  it("precarga el email y la contraseña guardados al montar el componente", () => {
    localStorage.setItem(
      "remembered_credentials",
      JSON.stringify({ email: "apoderado@colegio.cl", password: "otraClave456" }),
    );

    render(<LoginPage onLogin={vi.fn()} />);

    expect(screen.getByPlaceholderText("correo@ejemplo.com")).toHaveValue(
      "apoderado@colegio.cl",
    );
    expect(screen.getByPlaceholderText("contraseña")).toHaveValue("otraClave456");
    expect(screen.getByLabelText("Recordarme")).toBeChecked();
  });
});
