"use client";

import {
  useEffect,
  useRef,
  useState,
  type AnimationEvent,
  type MouseEvent,
} from "react";
import { useRouter } from "next/navigation";

type StorySceneTransitionOptions = {
  href: string;
  durationMs: number;
};

type StoryScenePhase = "idle" | "leaving";

export function useStorySceneTransition({
  href,
  durationMs,
}: StorySceneTransitionOptions) {
  const router = useRouter();
  const [phase, setPhase] = useState<StoryScenePhase>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseRef = useRef<StoryScenePhase>("idle");
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const navigate = () => {
    if (hasNavigatedRef.current) {
      return;
    }

    hasNavigatedRef.current = true;

    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    router.push(href);
  };

  const beginNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = event.currentTarget.target;

    if (
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey ||
      (target && target !== "_self")
    ) {
      return;
    }

    event.preventDefault();

    if (phaseRef.current === "leaving" || hasNavigatedRef.current) {
      return;
    }

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      navigate();
      return;
    }

    phaseRef.current = "leaving";
    setPhase("leaving");
    timeoutRef.current = setTimeout(navigate, durationMs);
  };

  const completeExit = (event: AnimationEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget || phaseRef.current !== "leaving") {
      return;
    }

    navigate();
  };

  return { phase, beginNavigation, completeExit };
}
