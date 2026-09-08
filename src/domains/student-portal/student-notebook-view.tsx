"use client";

import Image from "next/image";
import {
  ArrowLeft,
  Cards,
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
  Notebook,
  Path,
  TextAlignLeft,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import type { StudentPathProgress } from "./student-path-model";
import { StudentNotebookFolioDetail } from "./student-notebook-folio-detail";
import {
  getNotebookNavMeta,
  getNotebookReviewMinutes,
  getReviewCardsForNotebooks,
  notebookEraTabs,
  notebookPageSize,
  portalNotebookMeta,
  queryLessonNotebooks,
  readNotebookNotes,
  writeNotebookNotes,
  type NotebookEraFilter,
  type PortalLessonNotebook,
} from "./student-notebook-content";
import styles from "./student-notebook.module.css";

type StudentNotebookViewProps = {
  previewUnlocks?: Parameters<typeof queryLessonNotebooks>[0]["unlocks"];
  progress?: StudentPathProgress;
};

type LessonSurface = "choose" | "folio" | "texts" | "cards";

export function StudentNotebookView({
  previewUnlocks,
  progress,
}: StudentNotebookViewProps = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [eraId, setEraId] = useState<NotebookEraFilter>("all");
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [page, setPage] = useState(0);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [lessonSurface, setLessonSurface] = useState<LessonSurface>("choose");
  const [flippedIds, setFlippedIds] = useState<ReadonlySet<string>>(() => new Set());
  const [notes, setNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);

  const navMeta = getNotebookNavMeta(previewUnlocks, progress);
  const browsing = !reviewMode && !activeLessonId;
  const filtered = Boolean(searchQuery.trim() || eraId !== "all");

  const visibleNotebooks = useMemo(
    () =>
      queryLessonNotebooks({
        query: searchQuery,
        eraId,
        lessonIds: selectedLessonIds.length > 0 ? selectedLessonIds : undefined,
        unlocks: previewUnlocks,
        progress,
      }),
    [searchQuery, eraId, selectedLessonIds, previewUnlocks, progress],
  );

  const pageCount = Math.max(1, Math.ceil(visibleNotebooks.length / notebookPageSize));
  const safePage = Math.min(page, pageCount - 1);
  const pagedNotebooks = visibleNotebooks.slice(
    safePage * notebookPageSize,
    (safePage + 1) * notebookPageSize,
  );

  const activeLesson = activeLessonId
    ? visibleNotebooks.find((notebook) => notebook.id === activeLessonId) ??
      queryLessonNotebooks({ unlocks: previewUnlocks, progress }).find(
        (notebook) => notebook.id === activeLessonId,
      )
    : null;

  const lessonPickerOptions = useMemo(
    () =>
      queryLessonNotebooks({
        eraId: eraId === "all" ? "all" : eraId,
        unlocks: previewUnlocks,
        progress,
      }),
    [eraId, previewUnlocks, progress],
  );

  const reviewCards = useMemo(
    () => getReviewCardsForNotebooks(visibleNotebooks),
    [visibleNotebooks],
  );

  useEffect(() => {
    setPage(0);
  }, [searchQuery, eraId]);

  useEffect(() => {
    if (!activeLessonId) {
      setNotes("");
      return;
    }
    setNotes(readNotebookNotes(activeLessonId));
    setNotesSaved(false);
  }, [activeLessonId]);

  useEffect(() => {
    if (!activeLessonId) {
      return;
    }
    const handle = window.setTimeout(() => {
      writeNotebookNotes(activeLessonId, notes);
      setNotesSaved(true);
    }, 400);
    return () => window.clearTimeout(handle);
  }, [activeLessonId, notes]);

  function toggleLessonFilter(lessonId: string) {
    setSelectedLessonIds((current) =>
      current.includes(lessonId)
        ? current.filter((id) => id !== lessonId)
        : [...current, lessonId],
    );
  }

  function toggleFlip(cardId: string) {
    setFlippedIds((current) => {
      const next = new Set(current);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  }

  function openLesson(lessonId: string) {
    setReviewMode(false);
    setActiveLessonId(lessonId);
    setLessonSurface("choose");
    setFlippedIds(new Set());
  }

  function closeLesson() {
    setActiveLessonId(null);
    setLessonSurface("choose");
    setFlippedIds(new Set());
  }

  function openCardsForLesson(lessonId: string) {
    setActiveLessonId(lessonId);
    setLessonSurface("cards");
    setSelectedLessonIds([lessonId]);
    setFlippedIds(new Set());
  }

  function resetBrowse() {
    setSearchQuery("");
    setEraId("all");
    setSelectedLessonIds([]);
    setPage(0);
  }

  const lessonCards = getReviewCardsForNotebooks(activeLesson ? [activeLesson] : []);

  return (
    <section
      className={styles.page}
      aria-labelledby={
        activeLesson && (lessonSurface === "folio" || lessonSurface === "texts" || lessonSurface === "choose")
          ? "notebook-folio-title"
          : "notebook-title"
      }
    >
      {activeLesson && lessonSurface === "folio" ? (
        <div className={styles.layout} data-detail="true">
          <div className={styles.mainColumn}>
            <StudentNotebookFolioDetail
              notebook={activeLesson}
              notes={notes}
              notesSaved={notesSaved}
              onNotesChange={setNotes}
              onBack={() => setLessonSurface("choose")}
              onReview={() => openCardsForLesson(activeLesson.id)}
            />
          </div>
        </div>
      ) : activeLesson && lessonSurface === "texts" ? (
        <div className={styles.notebookStage}>
          <NotebookReadingView
            notebook={activeLesson}
            notes={notes}
            notesSaved={notesSaved}
            onNotesChange={setNotes}
            onBack={() => setLessonSurface("choose")}
          />
        </div>
      ) : activeLesson && lessonSurface === "choose" ? (
        <div className={styles.notebookStage}>
          <NotebookChooser
            notebook={activeLesson}
            onBack={closeLesson}
            onAcompanhar={() => setLessonSurface("folio")}
            onTexts={() => setLessonSurface("texts")}
            onCards={() => openCardsForLesson(activeLesson.id)}
          />
        </div>
      ) : (
        <div className={styles.notebookStage}>
          <header className={styles.header}>
            <div className={styles.headerCopy}>
              {activeLesson && lessonSurface === "cards" ? (
                <button type="button" className={styles.backButton} onClick={() => setLessonSurface("choose")}>
                  <ArrowLeft size={16} weight="bold" aria-hidden="true" />
                  {activeLesson.title}
                </button>
              ) : null}
              <p className={styles.eyebrow}>Sua sala · Philoo</p>
              <h1 id="notebook-title">Caderno</h1>
              <p className={styles.lede}>
                {reviewMode || lessonSurface === "cards"
                  ? portalNotebookMeta.reviewModeHint
                  : "Os cadernos das aulas que você já fez. Abra um para escolher como revisar."}
              </p>
              <p className={styles.countLine}>
                {navMeta.count}{" "}
                {navMeta.count === 1 ? "caderno desbloqueado" : "cadernos desbloqueados"}
              </p>
            </div>
            {lessonSurface !== "cards" ? (
              <button
                type="button"
                className={styles.createAction}
                aria-pressed={reviewMode}
                onClick={() => {
                  setReviewMode((current) => !current);
                  setFlippedIds(new Set());
                }}
              >
                {reviewMode ? "Sair da revisão" : portalNotebookMeta.reviewModeLabel}
              </button>
            ) : null}
          </header>

          {lessonSurface !== "cards" ? (
            <div className={styles.toolbar}>
              <label className={styles.searchField}>
                <MagnifyingGlass size={18} weight="bold" aria-hidden="true" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={portalNotebookMeta.searchPlaceholder}
                  aria-label="Buscar no caderno"
                />
              </label>

              <div className={styles.filters} role="toolbar" aria-label="Filtrar por era">
                {notebookEraTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={styles.eraTab}
                    aria-pressed={eraId === tab.id}
                    onClick={() => {
                      setEraId(tab.id);
                      setSelectedLessonIds([]);
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
                {filtered ? (
                  <button type="button" className={styles.resetFilters} onClick={resetBrowse}>
                    Limpar filtros
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {reviewMode && lessonPickerOptions.length > 1 ? (
            <div className={styles.lessonPicker} aria-label="Escolher lições">
              <p>Lições nesta seleção</p>
              <div className={styles.lessonPickerList}>
                {lessonPickerOptions.map((notebook) => (
                  <label key={notebook.id} className={styles.lessonPickerItem}>
                    <input
                      type="checkbox"
                      checked={selectedLessonIds.includes(notebook.id)}
                      onChange={() => toggleLessonFilter(notebook.id)}
                    />
                    <span>{notebook.title}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          {visibleNotebooks.length === 0 ? (
            <p className={styles.emptyState}>
              {searchQuery.trim() || eraId !== "all" || selectedLessonIds.length > 0
                ? portalNotebookMeta.emptySearch
                : portalNotebookMeta.emptyLocked}
            </p>
          ) : reviewMode || lessonSurface === "cards" ? (
            <ul className={styles.reviewGrid} aria-label="Cartões de revisão">
              {(lessonSurface === "cards" ? lessonCards : reviewCards).map((card) => (
                <li key={card.id}>
                  <button
                    type="button"
                    className={styles.flipCard}
                    data-flipped={flippedIds.has(card.id) ? "true" : "false"}
                    aria-pressed={flippedIds.has(card.id)}
                    aria-label={
                      flippedIds.has(card.id)
                        ? `${card.prompt}: ${card.answer}. Toque para esconder.`
                        : `${card.prompt}. Toque para ver a resposta.`
                    }
                    onClick={() => toggleFlip(card.id)}
                  >
                    <span className={styles.flipInner}>
                      <span className={styles.flipFront}>
                        <small>{card.lessonTitle}</small>
                        <strong>{card.prompt}</strong>
                        <em>Toque para virar</em>
                      </span>
                      <span className={styles.flipBack} hidden={!flippedIds.has(card.id)}>
                        <strong>{card.prompt}</strong>
                        <p>{card.answer}</p>
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.shelfBlock}>
              <header className={styles.sectionHead}>
                <div>
                  <h2>{portalNotebookMeta.libraryTitle}</h2>
                  <p>{portalNotebookMeta.libraryLede}</p>
                </div>
                <span>
                  {visibleNotebooks.length}{" "}
                  {visibleNotebooks.length === 1 ? "caderno" : "cadernos"}
                </span>
              </header>
              <ul className={styles.libraryGrid} aria-label="Cadernos de lição">
                {pagedNotebooks.map((notebook) => (
                  <LessonCard
                    key={notebook.id}
                    notebook={notebook}
                    onOpen={() => openLesson(notebook.id)}
                  />
                ))}
              </ul>
              {pageCount > 1 ? (
                <nav className={styles.pagination} aria-label="Páginas do caderno">
                  <button
                    type="button"
                    className={styles.pageButton}
                    disabled={safePage === 0}
                    onClick={() => setPage((current) => Math.max(0, current - 1))}
                  >
                    <CaretLeft size={16} weight="bold" aria-hidden="true" />
                    {portalNotebookMeta.pagePrevious}
                  </button>
                  <p>
                    Página {safePage + 1} de {pageCount}
                  </p>
                  <button
                    type="button"
                    className={styles.pageButton}
                    disabled={safePage >= pageCount - 1}
                    onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
                  >
                    {portalNotebookMeta.pageNext}
                    <CaretRight size={16} weight="bold" aria-hidden="true" />
                  </button>
                </nav>
              ) : null}
            </div>
          )}

          {browsing ? (
            <p className={styles.teacherNote}>
              <Notebook size={18} weight="duotone" aria-hidden="true" />
              <span>
                <strong>Profª Marina · </strong>
                {portalNotebookMeta.teacherTip}
              </span>
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}

function LessonCard({
  notebook,
  onOpen,
}: {
  notebook: PortalLessonNotebook;
  onOpen: () => void;
}) {
  const minutes = getNotebookReviewMinutes(notebook);

  return (
    <li>
      <button type="button" className={styles.libraryCard} onClick={onOpen}>
        <span className={styles.libraryCover}>
          <Image
            src={notebook.coverSrc}
            alt=""
            fill
            sizes="(max-width: 820px) 100vw, (max-width: 1280px) 45vw, 360px"
            unoptimized
          />
        </span>
        <span className={styles.libraryBody}>
          <h3>{notebook.title}</h3>
          <p>{notebook.keyConcept.definition}</p>
          <span className={styles.timeBadge}>
            {portalNotebookMeta.reviewTimeLabel} · {minutes} min
          </span>
        </span>
      </button>
    </li>
  );
}

function NotebookChooser({
  notebook,
  onBack,
  onAcompanhar,
  onTexts,
  onCards,
}: {
  notebook: PortalLessonNotebook;
  onBack: () => void;
  onAcompanhar: () => void;
  onTexts: () => void;
  onCards: () => void;
}) {
  const minutes = getNotebookReviewMinutes(notebook);

  return (
    <div className={styles.chooser}>
      <button type="button" className={styles.backButton} onClick={onBack}>
        <ArrowLeft size={16} weight="bold" aria-hidden="true" />
        {portalNotebookMeta.backToCadernos}
      </button>
      <div className={styles.chooserHero}>
        <div className={styles.chooserCover}>
          <Image
            src={notebook.coverSrc}
            alt={notebook.coverAlt}
            fill
            sizes="(max-width: 820px) 100vw, 520px"
            unoptimized
          />
        </div>
        <div>
          <p className={styles.eyebrow}>{portalNotebookMeta.chooseEyebrow}</p>
          <h1 id="notebook-folio-title">{notebook.title}</h1>
          <p className={styles.lede}>{notebook.keyConcept.definition}</p>
          <p className={styles.countLine}>
            {portalNotebookMeta.reviewTimeLabel} · {minutes} min
          </p>
        </div>
      </div>
      <div className={styles.chooseGrid}>
        <button type="button" className={styles.chooseCard} onClick={onAcompanhar}>
          <Path size={28} weight="duotone" aria-hidden="true" />
          <strong>{portalNotebookMeta.chooseAcompanhar}</strong>
          <span>{portalNotebookMeta.chooseAcompanharHint}</span>
        </button>
        <button type="button" className={styles.chooseCard} onClick={onTexts}>
          <TextAlignLeft size={28} weight="duotone" aria-hidden="true" />
          <strong>{portalNotebookMeta.chooseTexts}</strong>
          <span>{portalNotebookMeta.chooseTextsHint}</span>
        </button>
        <button type="button" className={styles.chooseCard} onClick={onCards}>
          <Cards size={28} weight="duotone" aria-hidden="true" />
          <strong>{portalNotebookMeta.chooseCards}</strong>
          <span>{portalNotebookMeta.chooseCardsHint}</span>
        </button>
      </div>
    </div>
  );
}

function NotebookReadingView({
  notebook,
  notes,
  notesSaved,
  onNotesChange,
  onBack,
}: {
  notebook: PortalLessonNotebook;
  notes: string;
  notesSaved: boolean;
  onNotesChange: (value: string) => void;
  onBack: () => void;
}) {
  return (
    <article className={styles.reading}>
      <button type="button" className={styles.backButton} onClick={onBack}>
        <ArrowLeft size={16} weight="bold" aria-hidden="true" />
        {notebook.title}
      </button>
      <p className={styles.eyebrow}>{notebook.eraLabel}</p>
      <h1 id="notebook-folio-title">{notebook.title}</h1>
      <p className={styles.lede}>{notebook.summary}</p>
      <section className={styles.keyConcept}>
        <p>{portalNotebookMeta.keyConceptLabel}</p>
        <h2>
          {notebook.keyConcept.word}
          <span>{notebook.keyConcept.greek}</span>
        </h2>
        <p>{notebook.keyConcept.definition}</p>
      </section>
      {notebook.sections.map((section) => (
        <section key={section.heading} className={styles.detailSection}>
          <h3>{section.heading}</h3>
          <ul>
            {section.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
      ))}
      <label className={styles.folioNotesWrap}>
        <span className={styles.folioNotesHead}>
          {portalNotebookMeta.notesLabel}
          {notesSaved ? ` · ${portalNotebookMeta.notesSaved}` : ""}
        </span>
        <textarea
          className={styles.folioNotesInput}
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
          placeholder={portalNotebookMeta.notesPlaceholder}
        />
      </label>
    </article>
  );
}
