import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import {
  PhilooFolioStage,
  PhilooFolioVoice,
} from "./philoo-folio-stage";

afterEach(cleanup);

it("presents lesson content inside the shared folio frame", () => {
  const { container } = render(
    <PhilooFolioStage
      eyebrow="Cena 1 · História"
      title="O começo"
      titleId="folio-title"
      context="Siga o filósofo"
      currentMoment={1}
      totalMoments={3}
      action={<button type="button">Continuar</button>}
    >
      <PhilooFolioVoice speaker="Platão">
        <p>Venha comigo.</p>
      </PhilooFolioVoice>
    </PhilooFolioStage>,
  );

  expect(
    screen.getByRole("heading", { name: "O começo", level: 1 }),
  ).toHaveAttribute("id", "folio-title");
  expect(screen.getByText("Cena 1 · História")).toBeInTheDocument();
  expect(screen.getByText("Siga o filósofo")).toBeInTheDocument();
  expect(screen.getByText("Platão")).toBeInTheDocument();
  expect(screen.getByText("Momento 1 de 3")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Continuar" })).toBeInTheDocument();
  expect(container.querySelector("[data-philoo-folio-stage]")).toHaveAttribute(
    "data-has-path",
    "false",
  );
  expect(container.querySelector("[data-philoo-folio-stage]")).toHaveAttribute(
    "data-folio-moment",
    "story",
  );
});

it("marks the named-concept insert with the concept tone", () => {
  const { container } = render(
    <PhilooFolioStage
      eyebrow="Momento da palavra"
      title="Periagōgē"
      titleId="concept-title"
      moment="concept"
    >
      <PhilooFolioVoice speaker="Platão" tone="concept">
        <p>Virar o olhar.</p>
      </PhilooFolioVoice>
    </PhilooFolioStage>,
  );

  expect(container.querySelector("[data-philoo-folio-stage]")).toHaveAttribute(
    "data-folio-moment",
    "concept",
  );
  expect(container.querySelector("[data-philoo-folio-voice]")).toHaveAttribute(
    "data-tone",
    "concept",
  );
});
