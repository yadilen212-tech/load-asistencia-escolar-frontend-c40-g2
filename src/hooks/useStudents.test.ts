import { api } from "@/lib/api";
import type { Student } from "@/lib/types";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useStudents } from "./useStudents";

vi.mock("@/lib/api", () => ({
  api: vi.fn(),
}));

const mockedApi = vi.mocked(api);

describe("useStudents", () => {
  beforeEach(() => {
    mockedApi.mockReset();
  });

  it("starts in a loading state and then resolves with data", async () => {
    const students: Student[] = [
      { id: 1, fullName: "Ana Pérez", grade: "1A" },
      { id: 2, fullName: "Luis Gómez", grade: "2B" },
    ];
    mockedApi.mockResolvedValueOnce(students);

    const { result } = renderHook(() => useStudents());

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(students);
    expect(result.current.error).toBeNull();
    expect(mockedApi).toHaveBeenCalledWith("/educacion-asistencia");
  });

  it("exposes an error message when the request fails", async () => {
    mockedApi.mockRejectedValueOnce(new Error("API 500"));

    const { result } = renderHook(() => useStudents());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("API 500");
    expect(result.current.data).toEqual([]);
  });

  it("falls back to a generic error message for non-Error rejections", async () => {
    mockedApi.mockRejectedValueOnce("boom");

    const { result } = renderHook(() => useStudents());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe(
      "No se pudo cargar la lista de estudiantes",
    );
  });
});
