import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StudentProfileView } from "./student-profile-view";

afterEach(() => {
  cleanup();
});

describe("StudentProfileView", () => {
  it("shows who Ana is and keeps the Caderno page slot", () => {
    render(
      <StudentProfileView
        largerText={false}
        quietMotion={false}
        nightRoom={false}
        setLargerText={vi.fn()}
        setQuietMotion={vi.fn()}
        setNightRoom={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { name: /^perfil$/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/sua sala · philoo/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /ana nascimento/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByText(/2º ano b/i)).toBeInTheDocument();
    expect(screen.getByText(/colégio horizonte/i)).toBeInTheDocument();
    expect(screen.getByText(/profª marina alves/i)).toBeInTheDocument();
    expect(screen.getByText(/ana\.nascimento@aluno\.philoo/i)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /na philoo agora/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("offers reading, motion, and night-room settings", () => {
    const setLargerText = vi.fn();
    const setQuietMotion = vi.fn();
    const setNightRoom = vi.fn();

    render(
      <StudentProfileView
        largerText={false}
        quietMotion={false}
        nightRoom={false}
        setLargerText={setLargerText}
        setQuietMotion={setQuietMotion}
        setNightRoom={setNightRoom}
      />,
    );

    expect(screen.getByRole("heading", { name: /^configurações$/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox", { name: /texto um pouco maior/i }));
    fireEvent.click(screen.getByRole("checkbox", { name: /movimentos mais tranquilos/i }));
    fireEvent.click(screen.getByRole("switch", { name: /sala à noite/i }));

    expect(setLargerText).toHaveBeenCalledWith(true);
    expect(setQuietMotion).toHaveBeenCalledWith(true);
    expect(setNightRoom).toHaveBeenCalledWith(true);
  });
});
