import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StudentLibraryView } from "./student-library-view";

afterEach(cleanup);

describe("StudentLibraryView", () => {
  it("opens Tales from the Pré-socráticos group without adding a Cave chapter", () => {
    render(<StudentLibraryView searchQuery="" onOpenPath={vi.fn()} />);

    expect(screen.getByText("Você está aqui")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /a caverna de platão/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /tales e a arché/i })).toHaveAttribute(
      "href",
      "/aula/tales/ola",
    );
    expect(screen.queryByRole("link", { name: /heráclito e a mudança/i })).not.toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: /as sombras/i }).some(
        (link) => link.getAttribute("href") === "/aula/as-sombras/doxa",
      ),
    ).toBe(true);
    expect(screen.getByRole("link", { name: /a subida/i })).toHaveAttribute(
      "href",
      "/aula/a-subida/depois-da-virada",
    );
    expect(screen.queryByRole("link", { name: /o retorno/i })).not.toBeInTheDocument();
  });
});
