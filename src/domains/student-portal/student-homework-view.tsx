"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarBlank,
  CaretLeft,
  CaretRight,
  Chalkboard,
  Check,
  CheckCircle,
  Circle,
  ClockCountdown,
  FolderOpen,
  Info,
  Path,
  Play,
  SealCheck,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import {
  HOMEWORK_BOARD_PAGE_SIZE,
  USE_HOMEWORK_OFFER_BOARD,
  buildMonthCells,
  countHomeworkByFilter,
  filterHomeworkAssignments,
  getHomeworkAssignment,
  getOpenHomeworkCount,
  groupHomeworkByDueIso,
  homeworkCalendarMonth,
  homeworkDueShort,
  homeworkFilterTabs,
  homeworkFolderTabs,
  homeworkOrigin,
  homeworkOriginLabel,
  homeworkShelfParts,
  portalHomeworkMeta,
  type HomeworkFilter,
  type HomeworkListStatus,
  type PortalHomeworkAssignment,
} from "./student-homework-content";
import styles from "./student-homework.module.css";

type HomeworkAnswers = Record<string, string>;

type StudentHomeworkViewProps = {
  initialAssignmentId?: string | null;
  onAssignmentChange?: (assignmentId: string | null) => void;
};

function storageKey(assignmentId: string) {
  return `philoo:homework:${assignmentId}`;
}

function readDraft(assignmentId: string): HomeworkAnswers {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const raw = window.localStorage.getItem(storageKey(assignmentId));
    return raw ? (JSON.parse(raw) as HomeworkAnswers) : {};
  } catch {
    return {};
  }
}

function writeDraft(assignmentId: string, answers: HomeworkAnswers) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(storageKey(assignmentId), JSON.stringify(answers));
}

function countAnswered(
  assignment: PortalHomeworkAssignment,
  answers: HomeworkAnswers,
) {
  return assignment.questions.filter((question) =>
    Boolean(answers[question.id]?.trim()),
  ).length;
}

function listStatusLabel(status: HomeworkListStatus, urgency?: "now" | "open") {
  if (status === "overdue") {
    return "Atrasada";
  }
  if (status === "submitted") {
    return "Entregue";
  }
  if (status === "graded") {
    return "Corrigida";
  }
  return urgency === "now" ? "Faça agora" : "Aberta";
}

function sectionForStatus(status: HomeworkListStatus) {
  if (status === "overdue") {
    return "overdue" as const;
  }
  if (status === "open") {
    return "open" as const;
  }
  return "done" as const;
}

export function StudentHomeworkView({
  initialAssignmentId = null,
  onAssignmentChange,
}: StudentHomeworkViewProps) {
  const [filter, setFilter] = useState<HomeworkFilter>(
    USE_HOMEWORK_OFFER_BOARD ? "open" : "all",
  );
  const [selectedId, setSelectedId] = useState<string | null>(initialAssignmentId);

  useEffect(() => {
    setSelectedId(initialAssignmentId ?? null);
  }, [initialAssignmentId]);

  const openAssignment = useCallback(
    (assignmentId: string) => {
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

  if (USE_HOMEWORK_OFFER_BOARD) {
    return (
      <HomeworkBoardView
        filter={filter}
        onFilterChange={setFilter}
        onOpenAssignment={openAssignment}
      />
    );
  }

  return (
    <HomeworkListView
      filter={filter}
      onFilterChange={setFilter}
      onOpenAssignment={openAssignment}
    />
  );
}

function folderTabIcon(id: (typeof homeworkFolderTabs)[number]["id"]) {
  const props = { size: 16, weight: "bold" as const, "aria-hidden": true };
  if (id === "due-this-week") {
    return <ClockCountdown {...props} />;
  }
  if (id === "overdue") {
    return <WarningCircle {...props} />;
  }
  if (id === "submitted") {
    return <CheckCircle {...props} />;
  }
  if (id === "graded") {
    return <SealCheck {...props} />;
  }
  return <FolderOpen {...props} />;
}

function HomeworkBoardView({
  filter,
  onFilterChange,
  onOpenAssignment,
}: {
  filter: HomeworkFilter;
  onFilterChange: (filter: HomeworkFilter) => void;
  onOpenAssignment: (assignmentId: string) => void;
}) {
  const visible = filterHomeworkAssignments(filter);
  const [peekId, setPeekId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const peek = peekId ? getHomeworkAssignment(peekId) : undefined;
  const folder =
    homeworkFolderTabs.find((tab) => tab.id === filter) ?? homeworkFolderTabs[0];
  const activeIndex = Math.max(
    0,
    homeworkFolderTabs.findIndex((tab) => tab.id === filter),
  );
  const pageCount = Math.max(1, Math.ceil(visible.length / HOMEWORK_BOARD_PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageItems = visible.slice(
    safePage * HOMEWORK_BOARD_PAGE_SIZE,
    safePage * HOMEWORK_BOARD_PAGE_SIZE + HOMEWORK_BOARD_PAGE_SIZE,
  );

  useEffect(() => {
    setPage(0);
  }, [filter]);

  return (
    <section className={styles.boardPage} aria-labelledby="homework-title">
      <header className={styles.boardHeader}>
        <p className={styles.boardEyebrow}>Lição de casa</p>
        <h1 id="homework-title">{folder.title}</h1>
        <p className={styles.lede}>{folder.copy}</p>
      </header>

      <div className={styles.folderStack}>
        <div className={styles.folderTabs} role="tablist" aria-label="Pastas da lição de casa">
          {homeworkFolderTabs.map((tab, index) => {
            const selected = filter === tab.id;
            const stack = selected ? 8 : 5 - Math.abs(index - activeIndex);
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`homework-folder-${tab.id}`}
                className={styles.folderTab}
                aria-selected={selected}
                aria-controls="homework-folder-panel"
                tabIndex={selected ? 0 : -1}
                style={{ zIndex: stack }}
                onClick={() => onFilterChange(tab.id)}
              >
                <span className={styles.folderTabIcon}>{folderTabIcon(tab.id)}</span>
                <span className={styles.folderTabLabel}>{tab.label}</span>
                <span className={styles.folderTabCount}>{countHomeworkByFilter(tab.id)}</span>
              </button>
            );
          })}
        </div>

        <div
          id="homework-folder-panel"
          className={styles.folderPanel}
          role="tabpanel"
          aria-labelledby={`homework-folder-${folder.id}`}
          data-first={activeIndex === 0 || undefined}
        >
          {visible.length === 0 ? (
            <p className={styles.empty}>Nenhuma tarefa nesta pasta.</p>
          ) : (
            <ul className={styles.boardGrid}>
              {pageItems.map((item) => (
                <HomeworkOfferCard
                  key={item.id}
                  assignment={item}
                  onPeek={() => setPeekId(item.id)}
                  onOpen={() => onOpenAssignment(item.id)}
                />
              ))}
            </ul>
          )}

          {visible.length > HOMEWORK_BOARD_PAGE_SIZE ? (
            <div className={styles.folderPager}>
              <button
                type="button"
                className={styles.folderPageButton}
                disabled={safePage === 0}
                onClick={() => setPage((current) => Math.max(0, current - 1))}
              >
                <CaretLeft size={16} weight="bold" aria-hidden="true" />
                Anteriores
              </button>
              <p>
                {safePage + 1} de {pageCount}
              </p>
              <button
                type="button"
                className={styles.folderPageButton}
                disabled={safePage >= pageCount - 1}
                onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
              >
                Próximas
                <CaretRight size={16} weight="bold" aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {peek ? (
        <HomeworkPeekDialog
          assignment={peek}
          onClose={() => setPeekId(null)}
          onOpen={() => {
            setPeekId(null);
            onOpenAssignment(peek.id);
          }}
        />
      ) : null}
    </section>
  );
}

function HomeworkOfferCard({
  assignment,
  onPeek,
  onOpen,
}: {
  assignment: PortalHomeworkAssignment;
  onPeek: () => void;
  onOpen: () => void;
}) {
  const statusLabel = listStatusLabel(assignment.listStatus, assignment.urgency);
  const enterHref = assignment.lessonHref;
  const shelf = homeworkShelfParts(assignment);
  const trail = homeworkOrigin(assignment) === "trail";

  return (
    <li className={styles.offerCard} data-status={assignment.listStatus}>
      <div className={styles.offerTop}>
        <div className={styles.offerBrand}>
          <span className={styles.offerMark} aria-hidden="true">
            {trail ? <Path size={16} weight="duotone" /> : <Chalkboard size={16} weight="duotone" />}
          </span>
          <p className={styles.offerTheme}>
            <strong>{shelf.module}</strong>
            <i />
            <span>{shelf.chapter}</span>
          </p>
        </div>
        <span className={styles.offerBadge} data-status={assignment.listStatus}>
          {statusLabel}
        </span>
      </div>

      <div className={styles.offerMeta}>
        <p>
          {homeworkOrigin(assignment) === "trail" ? (
            <Path size={16} weight="duotone" aria-hidden="true" />
          ) : (
            <Chalkboard size={16} weight="duotone" aria-hidden="true" />
          )}
          <span>
            Tipo
            <strong>{homeworkOriginLabel(assignment)}</strong>
          </span>
        </p>
        <p>
          <CalendarBlank size={16} weight="duotone" aria-hidden="true" />
          <span>
            {assignment.dueLabel}
            <strong>{homeworkDueShort(assignment)}</strong>
          </span>
        </p>
      </div>

      <h2 className={styles.offerTitle}>{assignment.title}</h2>
      <p className={styles.offerCopy}>{assignment.description}</p>

      <div className={styles.offerActions}>
        <button type="button" className={styles.offerGhost} onClick={onPeek}>
          <Info size={16} weight="bold" aria-hidden="true" />
          Ver detalhes
        </button>
        {enterHref ? (
          <Link href={enterHref} className={styles.offerSolid}>
            <Play size={16} weight="fill" aria-hidden="true" />
            Entrar na lição
          </Link>
        ) : (
          <button type="button" className={styles.offerSolid} onClick={onOpen}>
            <Play size={16} weight="fill" aria-hidden="true" />
            Entrar na lição
          </button>
        )}
      </div>
    </li>
  );
}

export function HomeworkPeekDialog({
  assignment,
  onClose,
  onOpen,
}: {
  assignment: PortalHomeworkAssignment;
  onClose: () => void;
  onOpen: () => void;
}) {
  const titleId = useId();
  const enterHref = assignment.lessonHref;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className={styles.peekScrim} role="presentation" onClick={onClose}>
      <div
        className={styles.peekDialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className={styles.peekClose} onClick={onClose} aria-label="Fechar">
          <X size={18} weight="bold" />
        </button>
        <p className={styles.offerTheme}>
          <strong>{homeworkShelfParts(assignment).module}</strong>
          <i />
          <span>{homeworkShelfParts(assignment).chapter}</span>
        </p>
        <h2 id={titleId}>{assignment.title}</h2>
        <p className={styles.offerCopy}>{assignment.description}</p>
        <p className={styles.peekTeacher}>
          {portalHomeworkMeta.teacher} · {homeworkOriginLabel(assignment)} ·{" "}
          {assignment.dueLabel} {homeworkDueShort(assignment)}
        </p>
        <blockquote className={styles.peekQuote}>“{assignment.teacherMessage}”</blockquote>
        <div className={styles.offerActions}>
          <button type="button" className={styles.offerGhost} onClick={onClose}>
            Fechar
          </button>
          {enterHref ? (
            <Link href={enterHref} className={styles.offerSolid}>
              <Play size={16} weight="fill" aria-hidden="true" />
              Começar
            </Link>
          ) : (
            <button type="button" className={styles.offerSolid} onClick={onOpen}>
              <Play size={16} weight="fill" aria-hidden="true" />
              Começar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function HomeworkListView({
  filter,
  onFilterChange,
  onOpenAssignment,
}: {
  filter: HomeworkFilter;
  onFilterChange: (filter: HomeworkFilter) => void;
  onOpenAssignment: (assignmentId: string) => void;
}) {
  const visible = filterHomeworkAssignments(filter);
  const overdue = visible.filter((item) => item.listStatus === "overdue");
  const open = visible.filter((item) => item.listStatus === "open");
  const done = visible.filter(
    (item) => item.listStatus === "submitted" || item.listStatus === "graded",
  );
  const openCount = getOpenHomeworkCount();

  return (
    <section className={styles.page} aria-labelledby="homework-title">
      <header className={styles.listHeader}>
        <p className={styles.eyebrow}>
          {portalHomeworkMeta.teacher} · {portalHomeworkMeta.classroom} ·{" "}
          {portalHomeworkMeta.monthLabel}
        </p>
        <h1 id="homework-title">Lição de casa</h1>
        <p className={styles.lede}>
          Tudo o que a profª passou, na ordem de quem vence primeiro. Abra uma
          tarefa para responder — o rascunho fica salvo até você entregar.
        </p>
      </header>

      <div className={styles.layout}>
        <div className={styles.mainColumn}>
          <div className={styles.filters} role="toolbar" aria-label="Filtrar tarefas">
            {homeworkFilterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={styles.filterPill}
                aria-pressed={filter === tab.id}
                onClick={() => onFilterChange(tab.id)}
              >
                {tab.label}
                <span>{countHomeworkByFilter(tab.id)}</span>
              </button>
            ))}
          </div>

          {overdue.length > 0 ? (
            <HomeworkSection
              tone="overdue"
              title="Atrasadas"
              count={overdue.length}
              items={overdue}
              onOpenAssignment={onOpenAssignment}
            />
          ) : null}

          {open.length > 0 ? (
            <HomeworkSection
              tone="open"
              title="Em aberto"
              count={open.length}
              items={open}
              onOpenAssignment={onOpenAssignment}
            />
          ) : null}

          {done.length > 0 ? (
            <HomeworkSection
              tone="done"
              title="Entregues e corrigidas"
              count={done.length}
              items={done}
              onOpenAssignment={onOpenAssignment}
            />
          ) : null}

          {visible.length === 0 ? (
            <p className={styles.empty}>Nenhuma tarefa neste filtro.</p>
          ) : null}
        </div>

        <aside className={styles.sidebar} aria-label="Resumo da semana">
          <section className={styles.weekCard}>
            <header>
              <h2>Sua semana</h2>
              <p>{portalHomeworkMeta.weekLabel}</p>
            </header>
            <p className={styles.weekCount}>
              <strong>{openCount}</strong>
              <span>tarefas em aberto</span>
            </p>
            <p className={styles.weekCopy}>{portalHomeworkMeta.weekSummary}</p>
          </section>

          <HomeworkMonthCalendar onOpenAssignment={onOpenAssignment} />

          <section className={styles.teacherCard}>
            <span className={styles.teacherAvatar} aria-hidden="true">
              MA
            </span>
            <div>
              <strong>Profª Marina</strong>
              <p>“{portalHomeworkMeta.teacherTip}”</p>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}

function HomeworkMonthCalendar({
  onOpenAssignment,
}: {
  onOpenAssignment: (assignmentId: string) => void;
}) {
  const grouped = groupHomeworkByDueIso();
  const cells = buildMonthCells(
    homeworkCalendarMonth.year,
    homeworkCalendarMonth.monthIndex,
  );
  const [openIso, setOpenIso] = useState<string | null>(null);
  const openItems = openIso ? (grouped.get(openIso) ?? []) : [];
  const weekdayLabels = ["S", "T", "Q", "Q", "S", "S", "D"];

  return (
    <section className={styles.calendarCard}>
      <h2>Calendário</h2>
      <p className={styles.monthLabel}>{homeworkCalendarMonth.label}</p>
      <div className={styles.monthWeekdays} aria-hidden="true">
        {weekdayLabels.map((label, index) => (
          <span key={`${label}-${index}`}>{label}</span>
        ))}
      </div>
      <div className={styles.monthGrid} role="grid" aria-label="Dias com entrega">
        {cells.map((cell, index) => {
          if (!cell.iso || cell.day === null) {
            return <span key={`empty-${index}`} className={styles.monthCell} />;
          }
          const count = grouped.get(cell.iso)?.length ?? 0;
          const overdue = grouped
            .get(cell.iso)
            ?.some((item) => item.listStatus === "overdue");
          return (
            <button
              key={cell.iso}
              type="button"
              className={styles.monthCell}
              data-has={count > 0 || undefined}
              data-overdue={overdue || undefined}
              data-open={openIso === cell.iso || undefined}
              disabled={count === 0}
              aria-pressed={openIso === cell.iso}
              aria-label={
                count === 0
                  ? `${cell.day} de setembro`
                  : `${cell.day} de setembro, ${count} ${count === 1 ? "entrega" : "entregas"}`
              }
              onClick={() => setOpenIso((current) => (current === cell.iso ? null : cell.iso))}
            >
              <strong>{cell.day}</strong>
              {count > 0 ? <b>{count}</b> : null}
            </button>
          );
        })}
      </div>
      {openItems.length > 0 ? (
        <ul className={styles.monthPeek}>
          {openItems.map((item) => (
            <li key={item.id}>
              <button type="button" onClick={() => onOpenAssignment(item.id)}>
                <span>{item.listStatus === "overdue" ? "Atrasada" : "Entrega"}</span>
                <strong>{item.title}</strong>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.monthHint}>Toque um dia com número para ver o que vence.</p>
      )}
    </section>
  );
}

function HomeworkSection({
  tone,
  title,
  count,
  items,
  onOpenAssignment,
}: {
  tone: "overdue" | "open" | "done";
  title: string;
  count: number;
  items: readonly PortalHomeworkAssignment[];
  onOpenAssignment: (assignmentId: string) => void;
}) {
  return (
    <section className={styles.section} data-tone={tone}>
      <header className={styles.sectionHead}>
        <h2>
          <i aria-hidden="true" />
          {title}
        </h2>
        <span>
          {count} {count === 1 ? "tarefa" : "tarefas"}
        </span>
      </header>
      <ul className={styles.taskList}>
        {items.map((item) => (
          <HomeworkTaskCard
            key={item.id}
            assignment={item}
            onOpen={() => onOpenAssignment(item.id)}
          />
        ))}
      </ul>
    </section>
  );
}

function HomeworkTaskCard({
  assignment,
  onOpen,
}: {
  assignment: PortalHomeworkAssignment;
  onOpen: () => void;
}) {
  const answered = countAnswered(assignment, readDraft(assignment.id));
  const total = assignment.questions.length;
  const progress = total > 0 ? Math.round((answered / total) * 100) : 0;
  const statusLabel = listStatusLabel(assignment.listStatus, assignment.urgency);
  const isFeatured =
    assignment.listStatus === "open" && assignment.urgency === "now";

  return (
    <li>
      <button
        type="button"
        className={styles.taskCard}
        data-status={assignment.listStatus}
        data-featured={isFeatured || undefined}
        onClick={onOpen}
      >
        <div className={styles.taskThumb}>
          {assignment.imageSrc ? (
            <Image
              className={styles.taskThumbImage}
              src={assignment.imageSrc}
              alt={assignment.imageAlt ?? ""}
              fill
              sizes="(max-width: 820px) 100vw, 220px"
            />
          ) : (
            <span>Sem imagem</span>
          )}
        </div>
        <div className={styles.taskBody}>
          <p>{assignment.moduleLabel}</p>
          <span className={styles.taskBadge} data-status={assignment.listStatus}>
            {statusLabel}
          </span>
          <h3>{assignment.title}</h3>
          <p className={styles.taskDescription}>{assignment.description}</p>
          <div className={styles.taskProgress}>
            <progress max={100} value={progress} aria-label={`${answered} de ${total} respondidas`} />
            <span>
              {answered} de {total} respondidas
            </span>
          </div>
        </div>
        <div className={styles.taskDue}>
          <small>{assignment.dueLabel}</small>
          <strong>{assignment.dueDetail.split(" · ")[0]}</strong>
          <span>{assignment.dueDetail.split(" · ")[1] ?? assignment.dueDetail}</span>
          <em>
            {assignment.listStatus === "overdue" ? "Responder" : "Começar"}
            <CaretRight size={16} weight="bold" aria-hidden="true" />
          </em>
        </div>
      </button>
    </li>
  );
}

export function HomeworkDetailView({
  assignment,
  onBack,
}: {
  assignment: PortalHomeworkAssignment;
  onBack: () => void;
}) {
  const [answers, setAnswers] = useState<HomeworkAnswers>(() =>
    readDraft(assignment.id),
  );
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = useMemo(
    () => countAnswered(assignment, answers),
    [assignment, answers],
  );
  const totalCount = assignment.questions.length;
  const allAnswered = answeredCount === totalCount;
  const progress = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;
  const canSubmit =
    allAnswered &&
    assignment.listStatus !== "submitted" &&
    assignment.listStatus !== "graded";

  useEffect(() => {
    writeDraft(assignment.id, answers);
  }, [assignment.id, answers]);

  function updateAnswer(questionId: string, value: string) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }

  return (
    <section className={styles.detailPage} aria-labelledby="homework-detail-title">
      <button type="button" className={styles.backLink} onClick={onBack}>
        <ArrowLeft size={16} weight="bold" aria-hidden="true" />
        Todas as lições de casa
      </button>

      <p className={styles.detailMeta}>
        {assignment.moduleLabel} · {portalHomeworkMeta.teacher}
      </p>
      <h1 id="homework-detail-title">{assignment.title}</h1>
      <p className={styles.detailLede}>{assignment.description}</p>

      <div className={styles.detailLayout}>
        <div className={styles.detailMain}>
          <article className={styles.briefingCard}>
            <div className={styles.briefingCopy}>
              <p>O que a profª pediu</p>
              <h2>O recado da profª</h2>
              <blockquote>{assignment.teacherMessage}</blockquote>
              <div className={styles.briefingProgress}>
                <progress
                  max={100}
                  value={progress}
                  aria-label={`${answeredCount} de ${totalCount} respondidas`}
                />
                <span>
                  {answeredCount} de {totalCount} respondidas
                </span>
              </div>
              <button
                type="button"
                className={styles.submitButton}
                disabled={!canSubmit || submitted}
                onClick={() => setSubmitted(true)}
              >
                {submitted
                  ? "Entrega registrada (preview)"
                  : allAnswered
                    ? "Entregar para a profª"
                    : `Responda as ${totalCount} para entregar`}
              </button>
              <small>A profª só vê depois da entrega</small>
            </div>
            <div className={styles.briefingMedia} aria-hidden="true">
              <span>Profª Marina no quadro</span>
            </div>
          </article>

          <section className={styles.questionsBlock} aria-labelledby="questions-title">
            <header>
              <h2 id="questions-title">As {totalCount} perguntas</h2>
              <span>Rascunho salvo</span>
            </header>
            <div className={styles.questionList}>
              {assignment.questions.map((question, index) => {
                const value = answers[question.id] ?? "";
                const blank = !value.trim();
                return (
                  <article
                    key={question.id}
                    className={styles.questionCard}
                    data-blank={blank || undefined}
                  >
                    <div className={styles.questionHead}>
                      <span>{index + 1}</span>
                      <div>
                        <small>{blank ? "Ainda em branco" : "Respondida"}</small>
                        <strong>
                          {question.kind === "choice"
                            ? "Escolha uma"
                            : "Com suas palavras"}
                        </strong>
                      </div>
                    </div>
                    <h3>{question.prompt}</h3>
                    {question.hint ? <p>{question.hint}</p> : null}
                    {question.kind === "choice" && question.options ? (
                      <fieldset className={styles.choiceGroup}>
                        <legend className={styles.srOnly}>{question.prompt}</legend>
                        {question.options.map((option) => (
                          <label key={option.id} className={styles.choiceOption}>
                            <input
                              type="radio"
                              name={question.id}
                              value={option.id}
                              checked={value === option.id}
                              onChange={() => updateAnswer(question.id, option.id)}
                            />
                            <span>{option.label}</span>
                          </label>
                        ))}
                      </fieldset>
                    ) : (
                      <textarea
                        className={styles.textAnswer}
                        rows={4}
                        value={value}
                        placeholder="Escreva aqui..."
                        onChange={(event) =>
                          updateAnswer(question.id, event.target.value)
                        }
                      />
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        </div>

        <aside className={styles.detailSidebar} aria-label="Status da entrega">
          <section className={styles.deliveryCard}>
            <h2>Sua entrega</h2>
            <p>Prazo: {assignment.dueDetail}</p>
            <p className={styles.deliveryScore}>
              {answeredCount} / {totalCount} respondidas
            </p>
            <progress max={100} value={progress} aria-hidden="true" />
          </section>

          <section className={styles.checklistCard}>
            <h2>Pergunta por pergunta</h2>
            <ul>
              {assignment.questions.map((question, index) => {
                const done = Boolean(answers[question.id]?.trim());
                const isCurrent =
                  !done &&
                  assignment.questions
                    .slice(0, index)
                    .every((item) => Boolean(answers[item.id]?.trim()));
                return (
                  <li key={question.id} data-done={done || undefined}>
                    {done ? (
                      <Check size={16} weight="bold" aria-hidden="true" />
                    ) : (
                      <Circle size={16} aria-hidden="true" />
                    )}
                    <span>
                      Pergunta {index + 1} ·{" "}
                      {question.kind === "choice" ? "alternativas" : "com suas palavras"}
                    </span>
                    {isCurrent ? <em>Agora</em> : null}
                  </li>
                );
              })}
            </ul>
          </section>

          <section className={styles.draftCard}>
            <h2>Rascunho</h2>
            <p>
              Salvo automaticamente a cada palavra. Você pode fechar e voltar
              depois.
            </p>
          </section>

          {assignment.teacherNote ? (
            <section className={styles.detailTeacherCard}>
              <span aria-hidden="true">MA</span>
              <div>
                <strong>Profª Marina</strong>
                <p>“{assignment.teacherNote}”</p>
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
