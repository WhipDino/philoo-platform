import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  PhilooDiscoveryTable,
  readDiscoveryDestinationId,
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
  it("resolves a drag release to the Philoo pocket beneath the pointer", () => {
    document.body.innerHTML = `
      <section data-discovery-destination="observed">
        <span id="pocket-child">Solte aqui</span>
      </section>
      <section data-discovery-destination="invented"></section>
    `;

    expect(
      readDiscoveryDestinationId(
        document.querySelector("#pocket-child"),
        destinations,
      ),
    ).toBe("observed");
    expect(
      readDiscoveryDestinationId(
        document.querySelector('[data-discovery-destination="invented"]'),
        destinations,
      ),
    ).toBeNull();
  });

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
        onMoveCard={vi.fn()}
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

  it("raises the active drag source above the board", () => {
    const { container } = render(
      <PhilooDiscoveryTable
        cards={cards}
        destinations={destinations}
        placements={{}}
        selectedCardId={null}
        onSelectCard={vi.fn()}
        onPlaceCard={vi.fn()}
        onMoveCard={vi.fn()}
      />,
    );

    fireEvent.pointerDown(
      screen.getByRole("button", { name: "Uma forma cruzou a parede." }),
      { clientX: 10, clientY: 10 },
    );

    expect(
      container.querySelector("[data-philoo-discovery-table]"),
    ).toHaveAttribute("data-dragging", "true");
    expect(
      container.querySelector('[data-drag-source="true"]'),
    ).toBeInTheDocument();
  });

  it("switches the empty tray into a purposeful completed state", () => {
    const { container } = render(
      <PhilooDiscoveryTable
        cards={cards}
        destinations={destinations}
        placements={{ shape: "observed", horse: "concluded" }}
        selectedCardId={null}
        onSelectCard={vi.fn()}
        onPlaceCard={vi.fn()}
        onMoveCard={vi.fn()}
      />,
    );

    expect(
      container.querySelector("[data-philoo-discovery-table]"),
    ).toHaveAttribute("data-complete", "true");
    expect(container.querySelector("[data-source-tray]")).toHaveAttribute(
      "data-empty",
      "true",
    );
    expect(
      screen.getByText("Todas as pistas foram organizadas"),
    ).toBeInTheDocument();
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
        onMoveCard={vi.fn()}
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
        onMoveCard={vi.fn()}
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
