"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import styles from "./philoo-pair-connect.module.css";

export type PairConnectItem = {
  id: string;
  label: string;
};

export type PairConnectProps = {
  prompt: string;
  sources: readonly PairConnectItem[];
  targets: readonly PairConnectItem[];
  matches: Readonly<Record<string, string>>;
  checkLabel?: string;
  successTitle?: string;
  successBody?: string;
  retryBody?: string;
  activityLabel?: string;
  onComplete: () => void;
  onIncomplete?: () => void;
};

type Point = { x: number; y: number };

function portCenter(element: Element | null, board: DOMRect) {
  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2 - board.left,
    y: rect.top + rect.height / 2 - board.top,
  };
}

export function PhilooPairConnect({
  prompt,
  sources,
  targets,
  matches,
  checkLabel = "Conferir ligações",
  successTitle = "As ligações fecharam",
  successBody,
  retryBody = "Algumas ligações ainda não combinam. Elas se soltaram para você rever.",
  activityLabel = "Ligue cada ideia da esquerda com a da direita",
  onComplete,
  onIncomplete,
}: PairConnectProps) {
  const headingId = useId();
  const boardRef = useRef<HTMLDivElement>(null);
  const [links, setLinks] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState<{ sourceId: string; point: Point } | null>(
    null,
  );
  const [wrongIds, setWrongIds] = useState<readonly string[]>([]);
  const [complete, setComplete] = useState(false);
  const [lineVersion, setLineVersion] = useState(0);

  const allLinked = sources.every((source) => links[source.id]);

  const refreshLines = useCallback(() => {
    setLineVersion((current) => current + 1);
  }, []);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) {
      return;
    }

    const Observer = window.ResizeObserver;
    const observer = Observer ? new Observer(refreshLines) : null;
    observer?.observe(board);
    window.addEventListener("resize", refreshLines);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", refreshLines);
    };
  }, [refreshLines]);

  function usedTarget(targetId: string, exceptSource?: string) {
    return Object.entries(links).some(
      ([sourceId, linked]) => linked === targetId && sourceId !== exceptSource,
    );
  }

  function startDraft(sourceId: string, event: ReactPointerEvent<HTMLElement>) {
    if (complete) {
      return;
    }

    const board = boardRef.current?.getBoundingClientRect();
    if (!board) {
      return;
    }

    setWrongIds([]);
    setDraft({
      sourceId,
      point: {
        x: event.clientX - board.left,
        y: event.clientY - board.top,
      },
    });
  }

  function moveDraft(event: ReactPointerEvent<HTMLDivElement>) {
    if (!draft) {
      return;
    }

    const board = boardRef.current?.getBoundingClientRect();
    if (!board) {
      return;
    }

    setDraft({
      ...draft,
      point: {
        x: event.clientX - board.left,
        y: event.clientY - board.top,
      },
    });
  }

  function finishDraft(targetId?: string) {
    if (!draft) {
      return;
    }

    const sourceId = draft.sourceId;
    setDraft(null);

    if (!targetId || usedTarget(targetId, sourceId)) {
      return;
    }

    setLinks((current) => ({ ...current, [sourceId]: targetId }));
    setComplete(false);
    onIncomplete?.();
  }

  function linkByKeyboard(sourceId: string, targetId: string) {
    if (complete || usedTarget(targetId, sourceId)) {
      return;
    }

    setWrongIds([]);
    setLinks((current) => ({ ...current, [sourceId]: targetId }));
    setComplete(false);
    onIncomplete?.();
  }

  function checkLinks() {
    const incorrect = sources
      .filter((source) => links[source.id] !== matches[source.id])
      .map((source) => source.id);

    if (incorrect.length === 0) {
      setWrongIds([]);
      setComplete(true);
      onComplete();
      return;
    }

    setWrongIds(incorrect);
    setComplete(false);
    onIncomplete?.();
    window.setTimeout(() => {
      setLinks((current) => {
        const next = { ...current };
        for (const sourceId of incorrect) {
          delete next[sourceId];
        }
        return next;
      });
      setWrongIds([]);
    }, 720);
  }

  const boardBox = boardRef.current?.getBoundingClientRect();

  return (
    <section
      className={styles.activity}
      data-philoo-pair-connect
      aria-labelledby={headingId}
    >
      <header className={styles.header}>
        <p className={styles.eyebrow}>Ligue os nós</p>
        <h2 id={headingId}>{prompt}</h2>
        <p className={styles.hint}>{activityLabel}</p>
      </header>

      <div
        ref={boardRef}
        className={styles.board}
        data-complete={complete ? "true" : "false"}
        onPointerMove={moveDraft}
        onPointerUp={(event) => {
          if (!draft) {
            return;
          }

          const hit = document
            .elementFromPoint(event.clientX, event.clientY)
            ?.closest("[data-target-port]");
          finishDraft(hit?.getAttribute("data-target-port") ?? undefined);
        }}
        onPointerCancel={() => setDraft(null)}
      >
        <svg className={styles.wires} aria-hidden="true" data-line-version={lineVersion}>
          {sources.map((source) => {
            const targetId = links[source.id];
            if (!targetId || !boardBox) {
              return null;
            }

            const start = portCenter(
              boardRef.current?.querySelector(
                `[data-source-port="${source.id}"]`,
              ) ?? null,
              boardBox,
            );
            const end = portCenter(
              boardRef.current?.querySelector(
                `[data-target-port="${targetId}"]`,
              ) ?? null,
              boardBox,
            );
            if (!start || !end) {
              return null;
            }

            const midX = (start.x + end.x) / 2;
            const isWrong = wrongIds.includes(source.id);
            return (
              <path
                key={`${source.id}-${targetId}`}
                d={`M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`}
                data-wire={isWrong ? "wrong" : complete ? "right" : "idle"}
              />
            );
          })}
          {draft && boardBox
            ? (() => {
                const start = portCenter(
                  boardRef.current?.querySelector(
                    `[data-source-port="${draft.sourceId}"]`,
                  ) ?? null,
                  boardBox,
                );
                if (!start) {
                  return null;
                }
                const midX = (start.x + draft.point.x) / 2;
                return (
                  <path
                    d={`M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${draft.point.y}, ${draft.point.x} ${draft.point.y}`}
                    data-wire="draft"
                  />
                );
              })()
            : null}
        </svg>

        <div className={styles.column} data-side="sources">
          {sources.map((source) => {
            const linked = links[source.id];
            const shaking = wrongIds.includes(source.id);
            return (
              <article
                key={source.id}
                className={styles.node}
                data-linked={linked ? "true" : "false"}
                data-wrong={shaking ? "true" : "false"}
                data-complete={complete ? "true" : "false"}
              >
                <p>{source.label}</p>
                <button
                  type="button"
                  className={styles.port}
                  data-source-port={source.id}
                  aria-label={`Ligar ${source.label}`}
                  disabled={complete}
                  onPointerDown={(event) => startDraft(source.id, event)}
                />
              </article>
            );
          })}
        </div>

        <div className={styles.column} data-side="targets">
          {targets.map((target) => {
            const taken = usedTarget(target.id);
            return (
              <article
                key={target.id}
                className={styles.node}
                data-taken={taken ? "true" : "false"}
                data-complete={complete ? "true" : "false"}
              >
                <button
                  type="button"
                  className={styles.port}
                  data-target-port={target.id}
                  aria-label={`Conectar em ${target.label}`}
                  disabled={complete}
                  onPointerUp={(event) => {
                    event.stopPropagation();
                    finishDraft(target.id);
                  }}
                  onClick={() => {
                    if (draft) {
                      finishDraft(target.id);
                      return;
                    }

                    const openSource = sources.find(
                      (source) => !links[source.id],
                    );
                    if (openSource) {
                      linkByKeyboard(openSource.id, target.id);
                    }
                  }}
                />
                <p>{target.label}</p>
              </article>
            );
          })}
        </div>
      </div>

      {complete ? (
        <div className={styles.success} data-pair-success>
          <p className={styles.status}>Tudo ligado</p>
          <p>
            <strong>{successTitle}</strong>
            {successBody ? ` ${successBody}` : null}
          </p>
        </div>
      ) : (
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.check}
            disabled={!allLinked}
            onClick={checkLinks}
          >
            {checkLabel}
          </button>
          {wrongIds.length > 0 ? (
            <p className={styles.retry} data-pair-retry>
              {retryBody}
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}
