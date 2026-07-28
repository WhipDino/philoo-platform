import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  PhilooDiscoveryTable,
  type DiscoveryDestination,
} from "./philoo-discovery-table";

type DestinationId = "observed" | "concluded";

const cards = [
  { id: "shape", text: "Uma forma cruzou a parede." },
  { id: "horse", text: "Um cavalo passou atrás delas." },
] as const;

const destinations: readonly DiscoveryDestination<DestinationId>[] = [
  {
    id: "observed",
    label: "Vi",
    hint: "A parede mostrou isso.",
    tone: "blue",
    icon: <span aria-hidden="true">○</span>,
  },
  {
    id: "concluded",
    label: "Concluí",
    hint: "Completei o que faltava com uma ideia.",
    tone: "apricot",
    icon: <span aria-hidden="true">◇</span>,
  },
];

afterEach(cleanup);

describe("PhilooDiscoveryTable", () => {
  it("exposes cards and pockets as keyboard-operable placement controls", () => {
    const onSelectCard = vi.fn();
    const onPlaceCard = vi.fn();

    render(
      <PhilooDiscoveryTable
        cards={cards}
        destinations={destinations}
        placements={{}}
        selectedCardId={null}
        onSelectCard={onSelectCard}
        onPlaceCard={onPlaceCard}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Uma forma cruzou a parede.",
      }),
    );

    expect(onSelectCard).toHaveBeenCalledWith("shape");
    expect(
      screen.getByRole("button", {
        name: "Vi — A parede mostrou isso.",
      }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", {
        name: "Concluí — Completei o que faltava com uma ideia.",
      }),
    ).toBeDisabled();
  });

  it("enables pockets for a selected card and keeps placed cards revisable", () => {
    const onSelectCard = vi.fn();
    const onPlaceCard = vi.fn();
    const { rerender } = render(
      <PhilooDiscoveryTable
        cards={cards}
        destinations={destinations}
        placements={{}}
        selectedCardId="shape"
        onSelectCard={onSelectCard}
        onPlaceCard={onPlaceCard}
      />,
    );

    const observedPocket = screen.getByRole("region", {
      name: "Vi",
    });
    const observedButton = within(observedPocket).getByRole("button", {
      name: "Vi — A parede mostrou isso.",
    });

    expect(observedButton).toBeEnabled();
    fireEvent.click(observedButton);
    expect(onPlaceCard).toHaveBeenCalledWith("observed");

    rerender(
      <PhilooDiscoveryTable
        cards={cards}
        destinations={destinations}
        placements={{ shape: "observed" }}
        selectedCardId={null}
        onSelectCard={onSelectCard}
        onPlaceCard={onPlaceCard}
      />,
    );

    const placedCard = within(
      screen.getByRole("region", { name: "Vi" }),
    ).getByRole("button", {
      name: "Uma forma cruzou a parede.",
    });

    expect(placedCard).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(placedCard);
    expect(onSelectCard).toHaveBeenCalledWith("shape");
  });
});
