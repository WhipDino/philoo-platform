import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StudentTrailView } from "./student-trail-view";

afterEach(cleanup);

describe("StudentTrailView", () => {
  it("renders a Duolingo-style vertical path with philosopher coins", () => {
    render(
      <StudentTrailView
        trailId="saindo-da-caverna"
        onSwitchTrail={() => {}}
        onOpenLibrary={() => {}}
        onOpenNotebook={() => {}}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /saindo da caverna/i, level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText(/você está aqui/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /continuar as sombras/i })).toHaveAttribute(
      "href",
      "/aula/as-sombras/doxa",
    );
    expect(screen.getByRole("list", { name: /encontros de saindo da caverna/i })).toBeInTheDocument();
    expect(screen.getByText(/moedas da trilha/i)).toBeInTheDocument();
  });

  it("stacks both playable trails without a filter tablist", () => {
    render(
      <StudentTrailView
        trailId="saindo-da-caverna"
        onSwitchTrail={() => {}}
        onOpenLibrary={() => {}}
        onOpenNotebook={() => {}}
      />,
    );

    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(screen.getByText(/o retorno/i)).toBeInTheDocument();
    expect(screen.getByText(/tales de mileto/i)).toBeInTheDocument();
    expect(document.querySelector("[class*='sectionBreak']")).toBeTruthy();
  });

  it("restarts the S-wave on each trail so the path can contour again", () => {
    const { container } = render(
      <StudentTrailView
        trailId="saindo-da-caverna"
        onSwitchTrail={() => {}}
        onOpenLibrary={() => {}}
        onOpenNotebook={() => {}}
      />,
    );

    const caveWaves = [
      ...container.querySelectorAll("[data-trail-section='saindo-da-caverna'] [data-wave]"),
    ].map((item) => item.getAttribute("data-wave"));
    const presocraticWaves = [
      ...container.querySelectorAll("[data-trail-section='primeiros-pensadores'] [data-wave]"),
    ].map((item) => item.getAttribute("data-wave"));

    expect(caveWaves).toEqual(["0", "1", "2"]);
    expect(presocraticWaves).toEqual(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
    expect(presocraticWaves[6]).not.toBe(presocraticWaves[7]);
  });

  it("places Thales and Heraclitus companions on the presocratic trail", () => {
    const { container } = render(
      <StudentTrailView
        trailId="primeiros-pensadores"
        onSwitchTrail={() => {}}
        onOpenLibrary={() => {}}
        onOpenNotebook={() => {}}
      />,
    );

    expect(container.querySelector("[data-slot='upper']")).toBeTruthy();
    expect(container.querySelector("[data-slot='lower']")).toBeTruthy();
    expect(
      container.querySelector('img[src="/images/portal/trail/thales-trail-water-v1.png"]'),
    ).toBeTruthy();
    expect(
      container.querySelector('img[src="/images/portal/trail/heraclitus-trail-fire-v1.png"]'),
    ).toBeTruthy();
  });

  it("opens the student notebook from the banner", () => {
    const onOpenNotebook = vi.fn();
    render(
      <StudentTrailView
        trailId="saindo-da-caverna"
        onSwitchTrail={() => {}}
        onOpenLibrary={() => {}}
        onOpenNotebook={onOpenNotebook}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /abrir caderno/i }));
    expect(onOpenNotebook).toHaveBeenCalledOnce();
  });
});
