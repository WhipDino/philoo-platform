"use client";

import Link from "next/link";
import {
  CalendarBlank,
  Chalkboard,
  Flag,
  Faders,
  Info,
  Path,
  Play,
} from "@phosphor-icons/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  filterHomeworkDesk,
  getHomeworkAssignment,
  homeworkDeskDefaultStatuses,
  homeworkDueShort,
  homeworkFolderTabs,
  homeworkOrigin,
  homeworkOriginTitle,
  homeworkPriority,
  homeworkShelfParts,
  type HomeworkDeskStatus,
  type PortalHomeworkAssignment,
} from "./student-homework-content";
import { HomeworkDetailView, HomeworkPeekDialog } from "./student-homework-view";
import styles from "./student-homework-desk.module.css";

type StudentHomeworkDeskViewProps = {
  initialAssignmentId?: string | null;
  onAssignmentChange?: (assignmentId: string | null) => void;
};

export function StudentHomeworkDeskView({
  initialAssignmentId = null,
  onAssignmentChange,
}: StudentHomeworkDeskViewProps) {
  const [statuses, setStatuses] = useState<HomeworkDeskStatus[]>([
    ...homeworkDeskDefaultStatuses,
  ]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(initialAssignmentId);
  const [peekId, setPeekId] = useState<string | null>(null);
  const filterWrapRef = useRef<HTMLDivElement>(null);
  const filterMenuId = useId();

  useEffect(() => {
    setSelectedId(initialAssignmentId ?? null);
  }, [initialAssignmentId]);

  useEffect(() => {
    if (!filterOpen) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!filterWrapRef.current?.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFilterOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [filterOpen]);

  const openAssignment = useCallback(
    (assignmentId: string) => {
      setPeekId(null);
      setFilterOpen(false);
      setSelectedId(assignmentId);
      onAssignmentChange?.(assignmentId);
    },
    [onAssignmentChange],
  );

  const closeAssignment = useCallback(() => {
    setSelectedId(null);
    onAssignmentChange?.(null);
  }, [onAssignmentChange]);

  if (selectedId) {
    const assignment = getHomeworkAssignment(selectedId);
    if (!assignment) {
      closeAssignment();
      return null;
    }
    return (
      <HomeworkDetailView assignment={assignment} onBack={closeAssignment} />
    );
  }

  const visible = filterHomeworkDesk(statuses);
  const peek = peekId ? getHomeworkAssignment(peekId) : undefined;
  const showingDone = statuses.some(
    (id) => id === "submitted" || id === "graded",
  );
  const usingDefault =
    statuses.length === homeworkDeskDefaultStatuses.length &&
    homeworkDeskDefaultStatuses.every((id) => statuses.includes(id));

  const toggleStatus = (id: HomeworkDeskStatus) => {
    setStatuses((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  return (
    <section className={styles.desk} aria-labelledby="homework-title">
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Sua sala · Philoo</p>
        <h1 id="homework-title">Lição de casa</h1>
        <p className={styles.lede}>
          Todas as que ainda faltam, as atrasadas primeiro. Entregues e
          corrigidas ficam no filtro, se você quiser reler.
        </p>
      </header>

      <div className={styles.sectionHead}>
        <div>
          <h2>{showingDone ? "Missões nesta lista" : "Ainda em aberto"}</h2>
          <p>
            {visible.length === 1
              ? "1 missão"
              : `${visible.length} missões`}
          </p>
        </div>
        <div className={styles.filterWrap} ref={filterWrapRef}>
          <button
            type="button"
            className={styles.filterBtn}
            aria-expanded={filterOpen}
            aria-controls={filterMenuId}
            aria-haspopup="true"
            data-active={!usingDefault || undefined}
            onClick={() => setFilterOpen((open) => !open)}
          >
            <Faders size={22} weight="bold" aria-hidden="true" />
            <span className={styles.filterLabel}>Filtro</span>
            {!usingDefault ? (
              <span className={styles.filterDot} aria-hidden="true" />
            ) : null}
          </button>
          {filterOpen ? (
            <div
              id={filterMenuId}
              className={styles.filterMenu}
              role="group"
              aria-label="Mostrar missões"
            >
              <p>Mostrar</p>
              {homeworkFolderTabs.map((tab) => (
                <label key={tab.id} className={styles.filterOption}>
                  <input
                    type="checkbox"
                    checked={statuses.includes(tab.id)}
                    onChange={() => toggleStatus(tab.id)}
                  />
                  <span>{tab.label}</span>
                </label>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className={styles.empty}>
          Nada neste filtro. Marque <strong>Abertas</strong> no funil para
          voltar às missões.
        </p>
      ) : (
        <ul className={styles.grid}>
          {visible.map((item) => (
            <DeskCard
              key={item.id}
              assignment={item}
              onPeek={() => setPeekId(item.id)}
              onOpen={() => openAssignment(item.id)}
            />
          ))}
        </ul>
      )}

      {peek ? (
        <HomeworkPeekDialog
          assignment={peek}
          onClose={() => setPeekId(null)}
          onOpen={() => openAssignment(peek.id)}
        />
      ) : null}
    </section>
  );
}

function DeskCard({
  assignment,
  onPeek,
  onOpen,
}: {
  assignment: PortalHomeworkAssignment;
  onPeek: () => void;
  onOpen: () => void;
}) {
  const origin = homeworkOrigin(assignment);
  const priority = homeworkPriority(assignment);
  const shelf = homeworkShelfParts(assignment);
  const done =
    assignment.listStatus === "submitted" || assignment.listStatus === "graded";

  return (
    <li className={styles.card} data-status={assignment.listStatus}>
      <div className={styles.cardTop}>
        <p className={styles.brand}>
          <span className={styles.mark} data-origin={origin} aria-hidden="true">
            {origin === "trail" ? (
              <Path size={18} weight="bold" />
            ) : (
              <Chalkboard size={18} weight="bold" />
            )}
          </span>
          <strong>{shelf.module}</strong>
        </p>
        <p className={styles.flag} data-level={priority.id}>
          <Flag size={13} weight="fill" aria-hidden="true" />
          {priority.label}
        </p>
      </div>

      <div className={styles.meta}>
        <p>
          {origin === "trail" ? (
            <Path size={16} weight="bold" aria-hidden="true" />
          ) : (
            <Chalkboard size={16} weight="bold" aria-hidden="true" />
          )}
          <span>
            <small>Tipo</small>
            <strong>{homeworkOriginTitle(assignment)}</strong>
          </span>
        </p>
        <p data-late={assignment.listStatus === "overdue" || undefined}>
          <CalendarBlank size={16} weight="bold" aria-hidden="true" />
          <span>
            <small>{assignment.dueLabel}</small>
            <strong>{homeworkDueShort(assignment)}</strong>
          </span>
        </p>
      </div>

      <h3>{assignment.title}</h3>
      <p className={styles.copy}>{assignment.description}</p>

      <div className={styles.actions}>
        <button type="button" className={styles.ghost} onClick={onPeek}>
          <Info size={16} weight="bold" aria-hidden="true" />
          Ver detalhes
        </button>
        {assignment.lessonHref && !done ? (
          <Link href={assignment.lessonHref} className={styles.solid}>
            <Play size={16} weight="fill" aria-hidden="true" />
            Entrar na lição
          </Link>
        ) : (
          <button type="button" className={styles.solid} onClick={onOpen}>
            <Play size={16} weight="fill" aria-hidden="true" />
            {done ? "Reabrir" : "Entrar na lição"}
          </button>
        )}
      </div>
    </li>
  );
}
