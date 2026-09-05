"use client";

import Image from "next/image";
import { CaretRight, MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import type { StudentPathProgress } from "./student-path-model";
import { getNotebookCharacter } from "./student-notebook-character";
import { StudentNotebookFolioDetail } from "./student-notebook-folio-detail";
import { getCharacterPose } from "@/domains/character-library";
import {
  getNotebookNavMeta,
  getReviewCardsForNotebooks,
  groupNotebooksByEra,
  notebookEraTabs,
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

export function StudentNotebookView({
  previewUnlocks,
  progress,
}: StudentNotebookViewProps = {}) {

  const [searchQuery, setSearchQuery] = useState("");
  const [eraId, setEraId] = useState<NotebookEraFilter>("all");
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [flippedIds, setFlippedIds] = useState<ReadonlySet<string>>(() => new Set());
  const [notes, setNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);

  const navMeta = getNotebookNavMeta(previewUnlocks, progress);

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

  const sections = useMemo(() => {
    if (reviewMode || activeLessonId || eraId !== "all" || searchQuery.trim()) {
      return [];
    }
    return groupNotebooksByEra(visibleNotebooks);
  }, [reviewMode, activeLessonId, eraId, searchQuery, visibleNotebooks]);

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

  return (
    <section
      className={styles.page}
      aria-labelledby={activeLesson ? "notebook-folio-title" : "notebook-title"}
    >
      {!activeLesson ? (
        <header className={styles.header}>
          <p className={styles.eyebrow}>
            {navMeta.count}{" "}
            {navMeta.count === 1 ? "caderno desbloqueado" : "cadernos desbloqueados"}
          </p>
          <h1 id="notebook-title">Caderno</h1>
          <p className={styles.lede}>
            {reviewMode
              ? portalNotebookMeta.reviewModeHint
              : "Cada lição que você termina vira um caderno para revisar antes da prova."}
          </p>
        </header>
      ) : null}

      <div className={styles.layout} data-detail={activeLesson ? "true" : "false"}>
        <div className={styles.mainColumn}>
          {!activeLesson ? (
            <>
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

              <div className={styles.eraTabs} role="toolbar" aria-label="Filtrar por era">
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

              <button
                type="button"
                className={styles.reviewMode}
                aria-pressed={reviewMode}
                onClick={() => {
                  setReviewMode((current) => !current);
                  setFlippedIds(new Set());
                }}
              >
                {reviewMode ? "Sair do modo revisão" : portalNotebookMeta.reviewModeLabel}
              </button>
            </>
          ) : null}

          {activeLesson ? (
            <StudentNotebookFolioDetail
              notebook={activeLesson}
              notes={notes}
              notesSaved={notesSaved}
              onNotesChange={setNotes}
              onBack={() => setActiveLessonId(null)}
              onReview={() => openReviewForLesson(activeLesson.id)}
            />
          ) : visibleNotebooks.length === 0 ? (
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
                  <ul className={styles.lessonList}>
                    {section.notebooks.map((notebook) => (
                      <LessonCard
                        key={notebook.id}
                        notebook={notebook}
                        onOpen={() => setActiveLessonId(notebook.id)}
                      />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <ul className={styles.lessonList} aria-label="Cadernos de lição">
              {visibleNotebooks.map((notebook) => (
                <LessonCard
                  key={notebook.id}
                  notebook={notebook}
                  onOpen={() => setActiveLessonId(notebook.id)}
                />
              ))}
            </ul>
          )}
        </div>

        {!activeLesson ? (
          <aside className={styles.sidebar} aria-label="Dica da professora">
            <section className={styles.teacherCard}>
              <span aria-hidden="true">MA</span>
              <div>
                <strong>Profª Marina</strong>
                <p>“{portalNotebookMeta.teacherTip}”</p>
              </div>
            </section>
          </aside>
        ) : null}
      </div>
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
  const character = getNotebookCharacter(notebook.id);
  const portrait = getCharacterPose(character.characterId, character.cardPoseId);

  return (
    <li>
      <button type="button" className={styles.lessonCard} onClick={onOpen}>
        <span className={styles.lessonCardPortrait} aria-hidden="true">
          <Image
            src={portrait.src}
            alt=""
            width={256}
            height={384}
            sizes="96px"
            unoptimized
          />
        </span>
        <div className={styles.lessonCardBody}>
          <p>{notebook.guide}</p>
          <h3>{notebook.title}</h3>
          <p className={styles.lessonCardSummary}>{notebook.summary}</p>
          <footer>
            <span>
              {portalNotebookMeta.keyConceptLabel}:{" "}
              <strong>{notebook.keyConcept.word}</strong>
            </span>
            <CaretRight size={18} weight="bold" aria-hidden="true" />
          </footer>
        </div>
      </button>
    </li>
  );
}
