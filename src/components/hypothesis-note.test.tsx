import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { HypothesisNote } from "./hypothesis-note";

afterEach(cleanup);

it("lets the learner register and revise a provisional hypothesis", () => {
  render(<HypothesisNote />);
  const note = screen.getByRole("textbox", { name: /sua hipótese provisória/i });

  fireEvent.change(note, {
    target: { value: "As sombras explicam formas, mas não a origem." },
  });
  fireEvent.click(
    screen.getByRole("button", { name: /registrar hipótese/i }),
  );

  expect(
    screen.getByRole("status"),
  ).toHaveTextContent(
    "Hipótese registrada. Você pode revisá-la quando outra pista mudar sua leitura.",
  );

  fireEvent.change(note, {
    target: { value: "As sombras explicam contornos, mas não as causas." },
  });
  expect(screen.queryByRole("status")).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /revisar hipótese/i }));
  expect(screen.getByRole("status")).toBeInTheDocument();
});

it("reports draft changes and registered hypotheses in controlled mode", () => {
  const onValueChange = vi.fn();
  const onRegister = vi.fn();

  render(
    <HypothesisNote
      value="Talvez as sombras mostrem apenas contornos."
      onValueChange={onValueChange}
      onRegister={onRegister}
    />,
  );

  fireEvent.change(
    screen.getByRole("textbox", { name: /sua hipótese provisória/i }),
    { target: { value: "Uma sombra mostra efeitos, não a fonte." } },
  );
  expect(onValueChange).toHaveBeenCalledWith(
    "Uma sombra mostra efeitos, não a fonte.",
  );

  fireEvent.click(
    screen.getByRole("button", { name: /registrar hipótese/i }),
  );
  expect(onRegister).toHaveBeenCalledWith(
    "Talvez as sombras mostrem apenas contornos.",
  );
});
