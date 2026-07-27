import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { CaveStoryProgress } from "./cave-story-progress";

afterEach(cleanup);

it("marks completed, current, and future Cave story beats", () => {
  const { container } = render(
    <CaveStoryProgress currentBeat={2} totalBeats={10} />,
  );

  const progress = screen.getByRole("progressbar", {
    name: "Cena 2 de 10",
  });
  expect(progress).toHaveAttribute("aria-valuenow", "2");
  expect(progress).toHaveAttribute("aria-valuemax", "10");
  expect(
    container.querySelectorAll('[data-state="complete"]'),
  ).toHaveLength(1);
  expect(
    container.querySelectorAll('[data-state="current"]'),
  ).toHaveLength(1);
  expect(
    container.querySelectorAll('[data-state="future"]'),
  ).toHaveLength(8);
});
