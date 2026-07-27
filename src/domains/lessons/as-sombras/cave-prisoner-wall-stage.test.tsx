import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { CavePrisonerWallStage } from "./cave-prisoner-wall-stage";

afterEach(cleanup);

it("describes the layered descent and exposes the current story beat", () => {
  const { rerender } = render(<CavePrisonerWallStage beat={0} />);

  expect(
    screen.getByRole("img", {
      name: /platão conduz o caminho para três pessoas/i,
    }),
  ).toHaveAttribute("data-stage-beat", "0");

  rerender(<CavePrisonerWallStage beat={2} />);
  expect(screen.getByRole("img")).toHaveAttribute("data-stage-beat", "2");
});
