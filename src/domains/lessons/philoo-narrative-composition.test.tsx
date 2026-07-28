import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { PhilooNarrativeComposition } from "./philoo-narrative-composition";

afterEach(cleanup);

it("renders dialogue before the philosopher when there is no illustration", () => {
  const { container } = render(
    <PhilooNarrativeComposition
      dialogue={<p>Diálogo</p>}
      guide={<div>Filósofo</div>}
    />,
  );

  const composition = container.querySelector(
    "[data-philoo-narrative-composition]",
  );
  expect(composition).toHaveAttribute("data-has-illustration", "false");
  expect(composition).toHaveAttribute("data-guide-side", "end");
  expect(
    Array.from(
      composition?.querySelectorAll("[data-narrative-slot]") ?? [],
    ).map((slot) => slot.getAttribute("data-narrative-slot")),
  ).toEqual(["dialogue", "guide"]);
});

it("keeps image, dialogue, and philosopher in narrow-screen reading order", () => {
  const { container } = render(
    <PhilooNarrativeComposition
      illustration={
        // eslint-disable-next-line @next/next/no-img-element -- a native image verifies the supplied illustration node's accessible contract.
        <img src="/scene.png" alt="A cena" />
      }
      dialogue={<p>Diálogo</p>}
      guide={<div>Filósofo</div>}
      guideSide="start"
    />,
  );

  const composition = container.querySelector(
    "[data-philoo-narrative-composition]",
  );
  expect(composition).toHaveAttribute("data-has-illustration", "true");
  expect(composition).toHaveAttribute("data-guide-side", "start");
  expect(
    Array.from(
      composition?.querySelectorAll("[data-narrative-slot]") ?? [],
    ).map((slot) => slot.getAttribute("data-narrative-slot")),
  ).toEqual(["illustration", "dialogue", "guide"]);
  expect(screen.getByRole("img", { name: "A cena" })).toBeInTheDocument();
});
