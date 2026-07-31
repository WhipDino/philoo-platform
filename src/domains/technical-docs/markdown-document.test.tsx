import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MarkdownDocument } from "./markdown-document";

const markdown = `# Hidden source title

## Build the lesson

Read \`docs/playbooks/CREATE_A_LESSON.md\` before changing **code**.

1. Define the claim.
2. Choose the thinking move.

| Surface | Owner |
| --- | --- |
| Content | Lesson |

\`\`\`tsx
<Exercise config={activity} />
\`\`\`
`;

describe("MarkdownDocument", () => {
  it("renders headings, lists, tables, code and internal document links", () => {
    render(<MarkdownDocument markdown={markdown} />);

    expect(
      screen.getByRole("heading", { name: "Build the lesson" }),
    ).toHaveAttribute("id", "build-the-lesson");
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("<Exercise config={activity} />")).toBeInTheDocument();

    const documentLink = screen.getByRole("link", {
      name: "docs/playbooks/CREATE_A_LESSON.md",
    });
    expect(documentLink).toHaveAttribute(
      "href",
      "/tecnico/guias/criar-uma-aula",
    );

    const paragraph = screen.getByText(/before changing/i).closest("p");
    expect(paragraph).not.toBeNull();
    expect(within(paragraph!).getByText("code").tagName).toBe("STRONG");
  });
});
