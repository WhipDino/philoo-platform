import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { AS_SOMBRAS_JOURNEY_STAGES } from "./as-sombras/as-sombras-journey";
import { PhilooLessonJourneyRail } from "./philoo-lesson-journey-rail";

afterEach(cleanup);

it("identifies the current lesson stage and lets the learner collapse the journey", () => {
  const onExpandedChange = vi.fn();

  render(
    <PhilooLessonJourneyRail
      lessonTitle="As Sombras"
      stages={AS_SOMBRAS_JOURNEY_STAGES}
      currentSceneId="so-a-parede"
      furthestVisitedStageIndex={2}
      expanded
      onExpandedChange={onExpandedChange}
    />,
  );

  expect(
    screen.getByRole("complementary", {
      name: "Sua jornada em As Sombras",
    }),
  ).toBeInTheDocument();
  expect(screen.getByText("Mais fundo")).toHaveAttribute(
    "aria-current",
    "step",
  );
  expect(
    screen.getByRole("link", { name: "O começo da história" }),
  ).toHaveAttribute("href", "/aula/as-sombras/primeira-tela");
  expect(screen.getByRole("link", { name: "A descida" })).toHaveAttribute(
    "href",
    "/aula/as-sombras/a-descida",
  );
  expect(
    screen.queryByRole("link", { name: "O mundo na parede" }),
  ).not.toBeInTheDocument();
  expect(screen.getByText("O mundo na parede").closest("li")).toHaveAttribute(
    "data-state",
    "upcoming",
  );

  fireEvent.click(
    screen.getByRole("button", { name: "Recolher jornada" }),
  );

  expect(onExpandedChange).toHaveBeenCalledWith(false);
});

it("keeps the current position available to assistive technology when collapsed", () => {
  render(
    <PhilooLessonJourneyRail
      lessonTitle="As Sombras"
      stages={AS_SOMBRAS_JOURNEY_STAGES}
      currentSceneId="so-a-parede"
      furthestVisitedStageIndex={2}
      expanded={false}
      onExpandedChange={() => undefined}
    />,
  );

  const toggle = screen.getByRole("button", { name: "Abrir jornada" });

  expect(toggle).toHaveAttribute("aria-controls");
  expect(
    screen.getByText("Etapa 3 de 5: Mais fundo"),
  ).toBeInTheDocument();
});
