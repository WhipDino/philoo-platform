import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
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
