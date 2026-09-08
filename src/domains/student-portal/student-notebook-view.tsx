"use client";

import {
  ArrowUUpLeft,
  Drop,
  Flame,
  MagnifyingGlass,
  MoonStars,
  Notebook,
  Sun,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import type { StudentPathProgress } from "./student-path-model";
import { StudentNotebookFolioDetail } from "./student-notebook-folio-detail";
import {
  getNotebookMarkTone,
  getNotebookNavMeta,
  getReviewCardsForNotebooks,
  groupNotebooksByEra,
  notebookEraTabs,
  notebookHomeShelfSize,
  portalNotebookMeta,
  queryLessonNotebooks,
  readNotebookNotes,
  writeNotebookNotes,
  type NotebookMarkTone,
  type NotebookEraFilter,
  type PortalLessonNotebook,
} from "./student-notebook-content";
import styles from "./student-notebook.module.css";

type StudentNotebookViewProps = {
  previewUnlocks?: Parameters<typeof queryLessonNotebooks>[0]["unlocks"];
  progress?: StudentPathProgress;
};

const markIcons: Record<NotebookMarkTone, ComponentType<{ size?: number; weight?: "duotone" }>> = {
  cave: MoonStars,
  ascent: Sun,
  return: ArrowUUpLeft,
  water: Drop,
  fire: Flame,
};

export function StudentNotebookView({
  previewUnlocks,
  progress,
}: StudentNotebookViewProps = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [eraId, setEraId] = useState<NotebookEraFilter>("all");
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [flippedIds, setFlippedIds] = useState<ReadonlySet<string>>(() => new Set());
  const [notes, setNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);

  const navMeta = getNotebookNavMeta(previewUnlocks, progress);
  const browsing = !reviewMode && !activeLessonId;
  const filtered = Boolean(searchQuery.trim() || eraId !== "all");
  const expandLibrary = showAll || filtered;

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

  const shelfNotebooks = useMemo(
    () => (expandLibrary ? visibleNotebooks : visibleNotebooks.slice(0, notebookHomeShelfSize)),
    [expandLibrary, visibleNotebooks],
  );

  const sections = useMemo(() => {
    if (reviewMode || activeLessonId || !expandLibrary) {
      return [];
    }
    return groupNotebooksByEra(visibleNotebooks);
  }, [reviewMode, activeLessonId, expandLibrary, visibleNotebooks]);

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

  function openReviewForLesson(lessonId: string) {
    setActiveLessonId(null);
    setReviewMode(true);
    setSelectedLessonIds([lessonId]);
    setFlippedIds(new Set());
  }

  function resetBrowse() {
    setSearchQuery("");
    setEraId("all");
    setShowAll(false);
    setSelectedLessonIds([]);
  }

  return (
    <section
      className={styles.page}
      aria-labelledby={activeLesson ? "notebook-folio-title" : "notebook-title"}
    >
      {activeLesson ? (
        <div className={styles.layout} data-detail="true">
          <div className={styles.mainColumn}>
            <StudentNotebookFolioDetail
              notebook={activeLesson}
              notes={notes}
              notesSaved={notesSaved}
              onNotesChange={setNotes}
              onBack={() => setActiveLessonId(null)}
              onReview={() => openReviewForLesson(activeLesson.id)}
            />
          </div>
        </div>
      ) : (
        <div className={styles.notebookStage}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>Sua sala · Philoo</p>
            <h1 id="notebook-title">Caderno</h1>
            <p className={styles.lede}>
              {reviewMode
                ? portalNotebookMeta.reviewModeHint
                : "Alguns cadernos à mão. Busque ou filtre quando quiser o resto."}
            </p>
            <p className={styles.countLine}>
              {navMeta.count}{" "}
              {navMeta.count === 1 ? "caderno desbloqueado" : "cadernos desbloqueados"}
            </p>
          </header>

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
                    if (tab.id !== "all") {
                      setShowAll(true);
                    }
                  }}
                >
                  {tab.label}
                </button>
              ))}
              <button
                type="button"
                className={styles.reviewMode}
                aria-pressed={reviewMode}
                onClick={() => {
                  setReviewMode((current) => !current);
                  setFlippedIds(new Set());
                }}
              >
                {reviewMode ? "Sair da revisão" : portalNotebookMeta.reviewModeLabel}
              </button>
              {filtered || showAll ? (
                <button type="button" className={styles.resetFilters} onClick={resetBrowse}>
                  Limpar filtros
                </button>
              ) : null}
            </div>
          </div>

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
          ) : reviewMode ? (
            <ul className={styles.reviewGrid} aria-label="Cartões de revisão">
              {reviewCards.map((card) => (
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
          ) : sections.length > 0 ? (
            <div className={styles.eraSections}>
              {sections.map((section) => (
                <section key={section.eraId} aria-labelledby={`era-${section.eraId}`}>
                  <header className={styles.sectionHead}>
                    <h2 id={`era-${section.eraId}`}>{section.label}</h2>
                    <span>
                      {section.notebooks.length}{" "}
                      {section.notebooks.length === 1 ? "lição" : "lições"}
                    </span>
                  </header>
                  <ul className={styles.cardGrid}>
                    {section.notebooks.map((notebook, index) => (
                      <LessonCard
                        key={notebook.id}
                        notebook={notebook}
                        featured={section.eraId === "mito-da-caverna" && index === 0}
                        onOpen={() => setActiveLessonId(notebook.id)}
                      />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <div className={styles.shelfBlock}>
              <header className={styles.sectionHead}>
                <h2>Em destaque</h2>
                <span>
                  {shelfNotebooks.length} de {visibleNotebooks.length}
                </span>
              </header>
              <ul className={styles.cardGrid} aria-label="Cadernos de lição">
                {shelfNotebooks.map((notebook, index) => (
                  <LessonCard
                    key={notebook.id}
                    notebook={notebook}
                    featured={index === 0}
                    onOpen={() => setActiveLessonId(notebook.id)}
                  />
                ))}
              </ul>
              {browsing && !expandLibrary && visibleNotebooks.length > notebookHomeShelfSize ? (
                <button type="button" className={styles.seeAll} onClick={() => setShowAll(true)}>
                  Ver todos os cadernos
                </button>
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
  featured,
  onOpen,
}: {
  notebook: PortalLessonNotebook;
  featured?: boolean;
  onOpen: () => void;
}) {
  const tone = getNotebookMarkTone(notebook.id);
  const Mark = markIcons[tone];

  return (
    <li className={featured ? styles.featuredItem : undefined}>
      <button
        type="button"
        className={styles.lessonCard}
        data-tone={tone}
        data-featured={featured ? "true" : "false"}
        onClick={onOpen}
      >
        <span className={styles.mark} aria-hidden="true">
          <Mark size={28} weight="duotone" />
        </span>
        <div className={styles.lessonCardBody}>
          <p>{notebook.guide}</p>
          <h3>{notebook.title}</h3>
          <footer>
            <span>
              {portalNotebookMeta.keyConceptLabel}: <strong>{notebook.keyConcept.word}</strong>
            </span>
          </footer>
        </div>
      </button>
    </li>
  );
}
