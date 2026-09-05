import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StudentHomeworkView } from "./student-homework-view";

afterEach(cleanup);

describe("StudentHomeworkView", () => {
  it("lists homework tasks and opens the detail view", () => {
    render(<StudentHomeworkView />);

    expect(
      screen.getByRole("heading", { name: /^lição de casa$/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /dóxa em três perguntas/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /dóxa em três perguntas/i }));

    expect(
      screen.getByRole("heading", { name: /^dóxa em três perguntas$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /todas as lições de casa/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", {
        name: /na caverna, o que os prisioneiros chamam de 'mundo'\?/i,
      }),
    ).toBeInTheDocument();
  });

  it("saves draft answers in localStorage", () => {
    window.localStorage.clear();
    render(<StudentHomeworkView initialAssignmentId="doxa-em-tres-perguntas" />);

    fireEvent.click(screen.getByLabelText(/as sombras na parede/i));

    expect(window.localStorage.getItem("philoo:homework:doxa-em-tres-perguntas")).toContain(
      '"q1":"b"',
    );

    window.localStorage.clear();
  });
});
