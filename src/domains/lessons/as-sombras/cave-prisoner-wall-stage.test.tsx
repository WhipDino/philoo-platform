import { act, cleanup, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { CavePrisonerWallStage } from "./cave-prisoner-wall-stage";

type TestMotionEllipseProps = ComponentProps<"ellipse"> & {
  animate?: unknown;
  initial?: unknown;
  transition?: { duration?: number };
};

vi.mock("motion/react-m", async (importOriginal) => {
  const original = await importOriginal<typeof import("motion/react-m")>();

  return {
    ...original,
    ellipse: ({
      animate: _animate,
      initial: _initial,
      transition,
      ...props
    }: TestMotionEllipseProps) => (
      <ellipse
        {...props}
        data-transition-duration={transition?.duration}
      />
    ),
  };
});

const originalMatchMedia = window.matchMedia;

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  window.matchMedia = originalMatchMedia;
});

it("updates the inquiry path and reveals immediately for reduced motion", () => {
  vi.useFakeTimers();
  window.matchMedia = createMatchMedia(true);
  const { container, rerender } = render(
    <CavePrisonerWallStage beat={0} />,
  );
  const inquiryPath = container.querySelector<SVGPathElement>(
    'path[d^="M850 664"]',
  );
  const wallGlow = container.querySelector<SVGEllipseElement>(
    'ellipse[cx="642"]',
  );

  rerender(<CavePrisonerWallStage beat={2} />);
  act(() => vi.advanceTimersByTime(16));

  expect(inquiryPath).toHaveAttribute("stroke-dasharray", "1 1");
  expect(wallGlow).toHaveAttribute("data-transition-duration", "0");
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
