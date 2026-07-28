import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { PhilooActivityBriefing } from "./philoo-activity-briefing";

afterEach(cleanup);

function BriefingHarness({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
    onClose();
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Como jogar
      </button>
      <PhilooActivityBriefing
        open={open}
        title="Monte o caminho"
        purpose="Organize o que chega até a parede."
        steps={["Observe a luz", "luz → objeto"]}
        startLabel="Vamos montar"
        guidePose="guided-classification"
        demonstration={<button type="button">Ver exemplo</button>}
        onClose={close}
      />
    </>
  );
}

// Production break caught: a modal can render while letting Tab escape its
// controls or while losing the original trigger focus after it is dismissed.
it("opens with complete instructions, traps focus, and restores it", () => {
  const onClose = vi.fn();
  render(<BriefingHarness onClose={onClose} />);
  const trigger = screen.getByRole("button", { name: "Como jogar" });
  trigger.focus();
  fireEvent.click(trigger);

  const dialog = screen.getByRole("dialog", { name: "Monte o caminho" });
  const start = screen.getByRole("button", { name: "Vamos montar" });

  expect(dialog).toBeVisible();
  expect(screen.getByText("luz → objeto")).toBeInTheDocument();
  expect(document.activeElement).toBe(start);

  fireEvent.keyDown(dialog, { key: "Tab" });
  expect(document.activeElement).toBe(
    screen.getByRole("button", { name: "Ver exemplo" }),
  );
  fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });
  expect(document.activeElement).toBe(start);

  fireEvent.click(start);
  expect(onClose).toHaveBeenCalledOnce();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(document.activeElement).toBe(trigger);
});

// Production break caught: closing with Escape can leave the app unreachable
// to assistive technology or permanently keep document scrolling disabled.
it("closes on Escape and restores inert siblings and body scrolling", () => {
  const onClose = vi.fn();
  const previouslyInertSibling = document.createElement("aside");
  previouslyInertSibling.setAttribute("inert", "");
  const availableSibling = document.createElement("nav");
  document.body.append(previouslyInertSibling, availableSibling);
  const previousAvailableInert = availableSibling.inert;
  const previousOverflow = document.body.style.overflow;

  try {
    render(<BriefingHarness onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Como jogar" }));

    expect(availableSibling.inert).toBe(true);
    expect(previouslyInertSibling).toHaveAttribute("inert");
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });

    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(availableSibling.inert).toBe(previousAvailableInert);
    expect(previouslyInertSibling).toHaveAttribute("inert");
    expect(document.body.style.overflow).toBe(previousOverflow);
  } finally {
    previouslyInertSibling.remove();
    availableSibling.remove();
  }
});
