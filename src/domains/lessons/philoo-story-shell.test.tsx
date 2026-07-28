import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { PhilooStoryShell } from "./philoo-story-shell";
import styles from "./philoo-story-shell.module.css";

afterEach(cleanup);

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
