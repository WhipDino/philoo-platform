import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { pathMapTrails } from "./student-path-map-content";
import { StudentPathMapView } from "./student-path-map-view";

afterEach(cleanup);

describe("StudentPathMapView", () => {
  it("shows trail grid and opens horizontal checkpoints then lesson briefing", () => {
    render(<StudentPathMapView />);

    expect(
      screen.getByRole("heading", { name: /escolha uma trilha para explorar/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /saindo da caverna/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /os primeiros pensadores/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /abrir trilha saindo da caverna/i }));
    expect(screen.getByRole("heading", { name: /saindo da caverna/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /abrir briefing: as sombras/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /abrir briefing: as sombras/i }));
    expect(screen.getByRole("heading", { name: /as sombras/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /continuar lição/i })).toHaveAttribute(
      "href",
      "/aula/as-sombras/doxa",
    );
  });

  it("opens presocratic trail with Tales briefing and start link", () => {
    render(<StudentPathMapView />);

    fireEvent.click(screen.getByRole("button", { name: /abrir trilha os primeiros pensadores/i }));

    fireEvent.click(screen.getByRole("button", { name: /abrir briefing: tales de mileto/i }));
    expect(screen.getByRole("heading", { name: /a hipótese da água/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /iniciar/i })).toHaveAttribute("href", "/aula/tales/ola");
  });
});

describe("pathMapTrails", () => {
  it("defines three trails with presocratic folio checkpoints", () => {
    expect(pathMapTrails).toHaveLength(3);
    expect(pathMapTrails[0].checkpoints).toHaveLength(3);
    expect(pathMapTrails[1].checkpoints).toHaveLength(10);
  });
});
