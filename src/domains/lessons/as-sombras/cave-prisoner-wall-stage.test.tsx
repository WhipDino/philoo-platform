import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { CavePrisonerWallStage } from "./cave-prisoner-wall-stage";

const originalMatchMedia = window.matchMedia;

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  window.matchMedia = originalMatchMedia;
});

it("updates the inquiry path immediately when reduced motion is enabled", () => {
  vi.useFakeTimers();
  window.matchMedia = createMatchMedia(true);
  const { container, rerender } = render(
    <CavePrisonerWallStage beat={0} />,
  );
  const inquiryPath = container.querySelector<SVGPathElement>(
    'path[d^="M850 664"]',
  );

  rerender(<CavePrisonerWallStage beat={2} />);
  act(() => vi.advanceTimersByTime(16));

  expect(inquiryPath).toHaveAttribute("stroke-dasharray", "1 1");
});

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

function createMatchMedia(matches: boolean) {
  return vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}
