import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LightCut } from "./light-cut";

afterEach(cleanup);

describe("LightCut", () => {
  it("offers an equivalent button path to the draggable reveal", () => {
    render(<LightCut initialReveal={50} />);

    fireEvent.click(screen.getByRole("button", { name: /ver pistas/i }));

    expect(
      screen.getByText(/pistas em primeiro plano/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: /posição do corte de luz/i }),
    ).toHaveValue("100");
  });

  it("returns to the appearance with the equivalent button", () => {
    render(<LightCut initialReveal={100} />);

    fireEvent.click(screen.getByRole("button", { name: /ver aparência/i }));

    expect(
      screen.getByText(/aparência em primeiro plano/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: /posição do corte de luz/i }),
    ).toHaveValue("0");
  });

  it("updates the current view when the learner drags the range", () => {
    render(<LightCut initialReveal={20} />);
    const slider = screen.getByRole("slider", {
      name: /posição do corte de luz/i,
    });

    fireEvent.change(slider, { target: { value: "72" } });

    expect(slider).toHaveValue("72");
    expect(slider).toHaveAttribute("aria-valuetext", "72% de pistas visíveis");
    expect(
      screen.getByText(/pistas em primeiro plano/i),
    ).toBeInTheDocument();
  });
});
