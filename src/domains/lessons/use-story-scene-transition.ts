"use client";

import {
  useCallback,
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

type StorySceneTransitionState = {
  href: string;
  phase: StoryScenePhase;
};

export function useStorySceneTransition({
  href,
  durationMs,
}: StorySceneTransitionOptions) {
  const router = useRouter();
  const [transitionState, setTransitionState] =
    useState<StorySceneTransitionState>({ href, phase: "idle" });
  const phase =
    transitionState.href === href ? transitionState.phase : "idle";
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseRef = useRef<StoryScenePhase>("idle");
  const hasNavigatedRef = useRef(false);

  const clearPendingNavigation = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearPendingNavigation();
    phaseRef.current = "idle";
    hasNavigatedRef.current = false;

    return clearPendingNavigation;
  }, [clearPendingNavigation, href]);

  const navigate = () => {
    if (hasNavigatedRef.current) {
      return;
    }

    hasNavigatedRef.current = true;

    clearPendingNavigation();

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
    setTransitionState({ href, phase: "leaving" });
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
