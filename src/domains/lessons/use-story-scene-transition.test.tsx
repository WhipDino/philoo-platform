import {
  cleanup,
  createEvent,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { useStorySceneTransition } from "./use-story-scene-transition";

const { pushMock } = vi.hoisted(() => {
  Object.defineProperty(window, "AnimationEvent", {
    configurable: true,
    value: window.Event,
  });

  return { pushMock: vi.fn() };
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

const originalMatchMedia = window.matchMedia;

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  window.matchMedia = originalMatchMedia;
});

beforeEach(() => {
  pushMock.mockClear();
  window.matchMedia = createMatchMedia(false);
});

it("waits for the scene exit before navigating", () => {
  render(<TransitionHarness />);
  fireEvent.click(screen.getByRole("link", { name: "Continue" }));

  expect(screen.getByTestId("scene")).toHaveAttribute(
    "data-phase",
    "leaving",
  );
  expect(pushMock).not.toHaveBeenCalled();

  fireEvent.animationEnd(screen.getByTestId("scene"));

  expect(pushMock).toHaveBeenCalledOnce();
  expect(pushMock).toHaveBeenCalledWith("/next");
});

it("navigates immediately for reduced motion", () => {
  window.matchMedia = createMatchMedia(true);
  render(<TransitionHarness />);

  fireEvent.click(screen.getByRole("link", { name: "Continue" }));

  expect(pushMock).toHaveBeenCalledOnce();
  expect(pushMock).toHaveBeenCalledWith("/next");
  expect(screen.getByTestId("scene")).toHaveAttribute("data-phase", "idle");
});

it("ignores repeated activation while leaving", () => {
  render(<TransitionHarness />);
  const link = screen.getByRole("link", { name: "Continue" });

  fireEvent.click(link);
  fireEvent.click(link);
  fireEvent.animationEnd(screen.getByTestId("scene"));

  expect(pushMock).toHaveBeenCalledOnce();
});

it("navigates when the scene exit exceeds its duration", () => {
  vi.useFakeTimers();
  render(<TransitionHarness durationMs={240} />);

  fireEvent.click(screen.getByRole("link", { name: "Continue" }));
  vi.advanceTimersByTime(240);

  expect(pushMock).toHaveBeenCalledOnce();
  expect(pushMock).toHaveBeenCalledWith("/next");
});

it("cancels pending navigation when the scene unmounts", () => {
  vi.useFakeTimers();
  const view = render(<TransitionHarness durationMs={240} />);

  fireEvent.click(screen.getByRole("link", { name: "Continue" }));
  view.unmount();
  vi.advanceTimersByTime(240);

  expect(pushMock).not.toHaveBeenCalled();
});

it("cancels a stale exit and returns to idle when its destination changes", () => {
  vi.useFakeTimers();
  const view = render(
    <TransitionHarness href="/first" durationMs={240} />,
  );

  fireEvent.click(screen.getByRole("link", { name: "Continue" }));
  expect(screen.getByTestId("scene")).toHaveAttribute(
    "data-phase",
    "leaving",
  );

  view.rerender(<TransitionHarness href="/second" durationMs={240} />);
  expect(screen.getByTestId("scene")).toHaveAttribute("data-phase", "idle");

  vi.advanceTimersByTime(240);
  expect(pushMock).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole("link", { name: "Continue" }));
  fireEvent.animationEnd(screen.getByTestId("scene"));
  expect(pushMock).toHaveBeenCalledWith("/second");
});

it("waits for the wrapper animation rather than a child animation", () => {
  render(<TransitionHarness withAnimatedChild />);
  fireEvent.click(screen.getByRole("link", { name: "Continue" }));

  fireEvent.animationEnd(screen.getByTestId("child"));

  expect(pushMock).not.toHaveBeenCalled();

  fireEvent.animationEnd(screen.getByTestId("scene"));

  expect(pushMock).toHaveBeenCalledOnce();
});

it("leaves modified clicks to the anchor's native behavior", () => {
  const defaultPreventions: boolean[] = [];
  render(
    <TransitionHarness
      onLinkClick={(event) => defaultPreventions.push(event.defaultPrevented)}
      suppressBrowserNavigation
    />,
  );
  const click = createEvent.click(
    screen.getByRole("link", { name: "Continue" }),
    { ctrlKey: true },
  );

  fireEvent(screen.getByRole("link", { name: "Continue" }), click);

  expect(defaultPreventions).toEqual([false]);
  expect(screen.getByTestId("scene")).toHaveAttribute("data-phase", "idle");
  expect(pushMock).not.toHaveBeenCalled();
});

it("leaves non-default link targets to the anchor's native behavior", () => {
  const defaultPreventions: boolean[] = [];
  render(
    <TransitionHarness
      onLinkClick={(event) => defaultPreventions.push(event.defaultPrevented)}
      suppressBrowserNavigation
      target="_blank"
    />,
  );
  const click = createEvent.click(
    screen.getByRole("link", { name: "Continue" }),
  );

  fireEvent(screen.getByRole("link", { name: "Continue" }), click);

  expect(defaultPreventions).toEqual([false]);
  expect(screen.getByTestId("scene")).toHaveAttribute("data-phase", "idle");
  expect(pushMock).not.toHaveBeenCalled();
});

function TransitionHarness({
  durationMs = 240,
  href = "/next",
  onLinkClick,
  suppressBrowserNavigation = false,
  target,
  withAnimatedChild = false,
}: {
  durationMs?: number;
  href?: string;
  onLinkClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  suppressBrowserNavigation?: boolean;
  target?: string;
  withAnimatedChild?: boolean;
}) {
  const { beginNavigation, completeExit, phase } = useStorySceneTransition({
    href,
    durationMs,
  });

  return (
    <div
      data-phase={phase}
      data-testid="scene"
      onAnimationEnd={completeExit}
    >
      <a
        href={href}
        onClick={(event) => {
          beginNavigation(event);
          onLinkClick?.(event);

          if (suppressBrowserNavigation) {
            event.preventDefault();
          }
        }}
        target={target}
      >
        Continue
      </a>
      {withAnimatedChild ? <div data-testid="child" /> : null}
    </div>
  );
}

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
