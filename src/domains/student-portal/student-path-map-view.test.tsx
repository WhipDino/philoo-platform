import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { pathMapTrails } from "./student-path-map-content";
import { StudentPathMapView } from "./student-path-map-view";

afterEach(cleanup);

describe("StudentPathMapView", () => {
  it("shows one module map with the current checkpoint focused", () => {
    render(
      <StudentPathMapView trailId="saindo-da-caverna" onBack={() => {}} />,
    );

    expect(
      screen.getByRole("heading", { name: /saindo da caverna/i, level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /selecionar encontro: as sombras/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /as sombras/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /continuar lição/i })).toHaveAttribute(
      "href",
      "/aula/as-sombras/doxa",
    );
  });

  it("opens presocratic module map with Tales detail and start link", () => {
    render(
      <StudentPathMapView trailId="primeiros-pensadores" onBack={() => {}} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /selecionar encontro: tales de mileto/i }));
    expect(screen.getByRole("heading", { name: /tales de mileto/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /iniciar/i })).toHaveAttribute("href", "/aula/tales/ola");
  });

  it("calls onBack from the library breadcrumb", () => {
    const onBack = vi.fn();
    render(<StudentPathMapView trailId="saindo-da-caverna" onBack={onBack} />);

    fireEvent.click(screen.getByRole("button", { name: /voltar à biblioteca/i }));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it("shows presocratic banner art on the module map", () => {
    render(
      <StudentPathMapView trailId="primeiros-pensadores" onBack={() => {}} />,
    );

    expect(
      screen.getByRole("img", {
        name: /tales, heráclito e parmênides — três pensadores pré-socráticos/i,
      }),
    ).toBeInTheDocument();
  });
});

describe("pathMapTrails", () => {
  it("defines three trails with presocratic folio checkpoints", () => {
    expect(pathMapTrails).toHaveLength(3);
    expect(pathMapTrails[0].checkpoints).toHaveLength(3);
    expect(pathMapTrails[1].checkpoints).toHaveLength(10);
    expect(pathMapTrails[1].bannerImage).toContain("presocratics-trail-banner");
  });
});
