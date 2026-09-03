import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { PhilooPairConnect } from "./philoo-pair-connect";

afterEach(cleanup);

const SOURCES = [
  { id: "luz", label: "A luz do sol" },
  { id: "arvore", label: "A árvore" },
] as const;

const TARGETS = [
  { id: "recorte", label: "Só o recorte" },
  { id: "coisa", label: "A coisa de verdade" },
] as const;

function renderConnect(onComplete = vi.fn(), onIncomplete = vi.fn()) {
  return {
    onComplete,
    onIncomplete,
    ...render(
      <PhilooPairConnect
        prompt="O que combina com o que ele viu?"
        sources={SOURCES}
        targets={TARGETS}
        matches={{ luz: "coisa", arvore: "recorte" }}
        onComplete={onComplete}
        onIncomplete={onIncomplete}
      />,
    ),
  };
}

function link(sourceLabel: string, targetLabel: string) {
  fireEvent.pointerDown(
    screen.getByRole("button", { name: `Ligar ${sourceLabel}` }),
  );
  fireEvent.pointerUp(
    screen.getByRole("button", { name: `Conectar em ${targetLabel}` }),
  );
}

it("keeps the check disabled until every source is linked", () => {
  renderConnect();

  expect(
    screen.getByRole("button", { name: "Conferir ligações" }),
  ).toBeDisabled();

  link("A luz do sol", "A coisa de verdade");

  expect(
    screen.getByRole("button", { name: "Conferir ligações" }),
  ).toBeDisabled();
});

it("unhooks only the mismatched links after a check", () => {
  vi.useFakeTimers();
  const { onComplete, onIncomplete } = renderConnect();

  link("A luz do sol", "Só o recorte");
  link("A árvore", "A coisa de verdade");
  fireEvent.click(screen.getByRole("button", { name: "Conferir ligações" }));

  expect(onComplete).not.toHaveBeenCalled();
  expect(onIncomplete).toHaveBeenCalled();
  expect(screen.getByText(/ainda não combinam/i)).toBeVisible();

  act(() => {
    vi.advanceTimersByTime(800);
  });

  expect(
    screen.getByRole("button", { name: "Conferir ligações" }),
  ).toBeDisabled();
  vi.useRealTimers();
});

it("completes when every link matches", () => {
  const { onComplete } = renderConnect();

  link("A luz do sol", "A coisa de verdade");
  link("A árvore", "Só o recorte");
  fireEvent.click(screen.getByRole("button", { name: "Conferir ligações" }));

  expect(onComplete).toHaveBeenCalledTimes(1);
  expect(screen.getByText(/tudo ligado/i)).toBeVisible();
  expect(
    screen.queryByRole("button", { name: "Conferir ligações" }),
  ).not.toBeInTheDocument();
});
