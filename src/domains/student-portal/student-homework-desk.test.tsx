import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StudentHomeworkDeskView } from "./student-homework-desk";

afterEach(cleanup);

describe("StudentHomeworkDeskView", () => {
  it("shows open missions by default and hides finished ones", () => {
    render(<StudentHomeworkDeskView />);

    expect(screen.getByRole("heading", { name: /lição de casa/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /ainda em aberto/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /quem são as vozes lá fora/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /dóxa em três perguntas/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /arché na mesa de almoço/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /primeira dúvida/i })).not.toBeInTheDocument();
  });

  it("lets the student add delivered lessons from the filter", () => {
    render(<StudentHomeworkDeskView />);

    fireEvent.click(screen.getByRole("button", { name: /filtro/i }));
    fireEvent.click(screen.getByLabelText(/^entregues$/i));

    expect(screen.getByRole("heading", { name: /missões nesta lista/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /arché na mesa de almoço/i })).toBeInTheDocument();
  });

  it("opens a teacher homework from the desk", () => {
    render(<StudentHomeworkDeskView />);

    const card = screen
      .getByRole("heading", { name: /mapa da caverna, do seu jeito/i })
      .closest("li");
    expect(card).toBeTruthy();
    fireEvent.click(within(card as HTMLElement).getByRole("button", { name: /entrar na lição/i }));

    expect(
      screen.getByRole("heading", { name: /mapa da caverna, do seu jeito/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /todas as lições de casa/i }),
    ).toBeInTheDocument();
  });
});
