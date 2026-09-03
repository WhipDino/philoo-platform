import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { PhilooStoryShell } from "./philoo-story-shell";
import styles from "./philoo-story-shell.module.css";

afterEach(() => {
  cleanup();
  router.push.mockReset();
});

const router = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => router,
}));

it("asks before leaving the lesson and stays when the student says no", () => {
  render(
    <PhilooStoryShell
      backHref="/before"
      currentBeat={1}
      totalBeats={2}
      labelledBy="scene-title"
      phase="idle"
    >
      <h1 id="scene-title">Cena</h1>
    </PhilooStoryShell>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Sair" }));
  expect(
    screen.getByRole("dialog", {
      name: "Tem certeza que deseja sair da lição?",
    }),
  ).toBeVisible();

  fireEvent.click(screen.getByRole("button", { name: "Não" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(router.push).not.toHaveBeenCalled();
});

it("returns to Meu caminho when the student confirms leaving", () => {
  render(
    <PhilooStoryShell
      backHref="/before"
      currentBeat={1}
      totalBeats={2}
      labelledBy="scene-title"
      phase="idle"
    >
      <h1 id="scene-title">Cena</h1>
    </PhilooStoryShell>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Sair" }));
  fireEvent.click(screen.getByRole("button", { name: "Sim" }));
  expect(router.push).toHaveBeenCalledWith("/inicio?view=journey");
});

it("uses an in-scene back action before leaving the current chapter", () => {
  const onBack = vi.fn();

  render(
    <PhilooStoryShell
      backHref="/before"
      onBack={onBack}
      currentBeat={1}
      totalBeats={2}
      labelledBy="scene-title"
      phase="idle"
    >
      <h1 id="scene-title">Cena</h1>
    </PhilooStoryShell>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Voltar" }));
  expect(onBack).toHaveBeenCalledOnce();
  expect(screen.queryByRole("link", { name: "Voltar" })).not.toBeInTheDocument();
});

it("mounts the journey story surface inside its stable sizing slot immediately", () => {
  const { container } = render(
    <PhilooStoryShell
      backHref="/before"
      currentBeat={1}
      totalBeats={2}
      labelledBy="scene-title"
      phase="idle"
      journey={{
        lessonTitle: "As Sombras",
        currentSceneId: "scene",
        storageKey: "test:journey",
        stages: [
          {
            id: "stage",
            label: "Cena",
            shortLabel: "Cena",
            href: "/scene",
            sceneIds: ["scene"],
            icon: "story",
          },
        ],
      }}
    >
      <h1 id="scene-title">Cena</h1>
    </PhilooStoryShell>,
  );

  const shell = container.querySelector("[data-philoo-story-shell]");
  const motionSlot = container.querySelector(
    "[data-philoo-story-motion-slot]",
  );

  expect(shell).toBeInTheDocument();
  expect(shell).toHaveClass(styles.storySurface);
  expect(motionSlot).toBeInTheDocument();
  expect(motionSlot).toHaveClass(styles.storyMotionSlot);
});

it("remounts the story slot when navigation changes the active scene", () => {
  const journey = {
    lessonTitle: "As Sombras",
    storageKey: "test:route-isolation",
    stages: [
      {
        id: "stage-one",
        label: "Primeira cena",
        shortLabel: "Primeira",
        href: "/scene-one",
        sceneIds: ["scene-one"],
        icon: "story" as const,
      },
      {
        id: "stage-two",
        label: "Segunda cena",
        shortLabel: "Segunda",
        href: "/scene-two",
        sceneIds: ["scene-two"],
        icon: "lesson" as const,
      },
    ],
  };
  const { container, rerender } = render(
    <PhilooStoryShell
      backHref="/before"
      currentBeat={1}
      totalBeats={2}
      labelledBy="scene-title"
      phase="idle"
      journey={{ ...journey, currentSceneId: "scene-one" }}
    >
      <h1 id="scene-title">Primeira cena</h1>
    </PhilooStoryShell>,
  );
  const firstSlot = container.querySelector(
    "[data-philoo-story-motion-slot]",
  );

  rerender(
    <PhilooStoryShell
      backHref="/before"
      currentBeat={2}
      totalBeats={2}
      labelledBy="scene-title"
      phase="idle"
      journey={{ ...journey, currentSceneId: "scene-two" }}
    >
      <h1 id="scene-title">Segunda cena</h1>
    </PhilooStoryShell>,
  );

  const secondSlot = container.querySelector(
    "[data-philoo-story-motion-slot]",
  );
  expect(secondSlot).not.toBe(firstSlot);
  expect(secondSlot).toHaveAttribute("data-philoo-scene-id", "scene-two");
});
