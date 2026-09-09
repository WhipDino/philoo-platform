import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StudentNextStepView } from "./student-next-step-view";

afterEach(cleanup);

describe("StudentNextStepView", () => {
  it("shows continue, sequence, and where you are", () => {
    render(<StudentNextStepView onOpenModuleMap={() => {}} onOpenLibrary={() => {}} />);

    expect(screen.getByRole("heading", { name: /olá, ana/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /as sombras/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /continuar aula/i })).toHaveAttribute(
      "href",
      "/aula/as-sombras/doxa",
    );
    expect(screen.getByText(/67%/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /3 dias seguidos/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /onde você está/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /^agenda$/i })).not.toBeInTheDocument();
  });

  it("turns sequence and place into tappable icons on compact screens", () => {
    render(
      <StudentNextStepView
        compact
        onOpenModuleMap={() => {}}
        onOpenLibrary={() => {}}
      />,
    );

    expect(screen.getByRole("navigation", { name: /acesso rápido/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /3 dias seguidos/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /sequência/i }));
    expect(screen.getByRole("dialog", { name: /3 dias seguidos/i })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: /dias da sequência/i })).toBeInTheDocument();
  });
});
