"use client";

import Link from "next/link";
import { ArrowLeft, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { PhilooCharacterGuide } from "@/domains/lessons/philoo-character-guide";
import { PhilooFolioStage, PhilooFolioVoice } from "@/domains/lessons/philoo-folio-stage";
import { PhilooNarrativeComposition } from "@/domains/lessons/philoo-narrative-composition";
import storyLayout from "@/domains/lessons/philoo-soft-story-layout.module.css";
import {
  buildNotebookFolioPages,
  getNotebookCharacter,
} from "./student-notebook-character";
import { portalNotebookMeta, type PortalLessonNotebook } from "./student-notebook-content";
import styles from "./student-notebook.module.css";

type StudentNotebookFolioDetailProps = {
  notebook: PortalLessonNotebook;
  notes: string;
  notesSaved: boolean;
  onNotesChange: (value: string) => void;
  onBack: () => void;
  onReview: () => void;
};

export function StudentNotebookFolioDetail({
  notebook,
  notes,
  notesSaved,
  onNotesChange,
  onBack,
  onReview,
}: StudentNotebookFolioDetailProps) {
  const character = getNotebookCharacter(notebook.id);
  const pages = useMemo(() => buildNotebookFolioPages(notebook), [notebook]);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    setPageIndex(0);
  }, [notebook.id]);

  const page = pages[pageIndex];
  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === pages.length - 1;

  if (!page) {
    return null;
  }

  const mastheadActions = (
    <button type="button" className={styles.folioBackToList} onClick={onBack}>
      <ArrowLeft size={16} weight="bold" aria-hidden="true" />
      {portalNotebookMeta.backToCadernos}
    </button>
  );

  const previousPageAction = !isFirstPage ? (
    <button
      type="button"
      className={styles.folioSecondaryAction}
      onClick={() => setPageIndex((current) => Math.max(0, current - 1))}
    >
      <CaretLeft size={18} weight="bold" aria-hidden="true" />
      Voltar
    </button>
  ) : null;

  const forwardAction = !isLastPage ? (
    <button
      type="button"
      className={styles.folioPrimaryAction}
      onClick={() => setPageIndex((current) => Math.min(pages.length - 1, current + 1))}
    >
      Continuar
      <span className={storyLayout.actionArrow} aria-hidden="true">
        →
      </span>
    </button>
  ) : (
    <div className={styles.folioLastActions}>
      <button type="button" className={styles.folioPrimaryAction} onClick={onReview}>
        {portalNotebookMeta.reviewThisLesson}
      </button>
      <Link href={notebook.lessonHref} className={styles.folioPrimaryAction}>
        {portalNotebookMeta.refazerAula}
        <CaretRight size={16} weight="bold" aria-hidden="true" />
      </Link>
    </div>
  );

  return (
    <div className={styles.folioEmbed}>
      <PhilooFolioStage
        className={styles.folioStage}
        eyebrow={notebook.eraLabel}
        title={notebook.title}
        titleId="notebook-folio-title"
        context={notebook.guide}
        currentMoment={pageIndex + 1}
        totalMoments={pages.length}
        moment={page.tone === "concept" ? "concept" : "story"}
        mastheadActions={mastheadActions}
        footerLabel={`Parte ${pageIndex + 1} de ${pages.length}`}
        action={
          <div className={styles.folioFooterActions}>
            {previousPageAction}
            {forwardAction}
          </div>
        }
      >
        <PhilooNarrativeComposition
          className={`${storyLayout.narrativeComposition} ${styles.notebookGuideComposition}`}
          guideSide="end"
          guide={
            <PhilooCharacterGuide
              key={`${notebook.id}-${page.poseId}`}
              characterId={character.characterId}
              poseId={page.poseId}
              priority
            />
          }
          dialogue={
            <PhilooFolioVoice speaker={character.speaker} tone={page.tone}>
              {page.kind === "concept" ? (
                <>
                  <p className={styles.folioVoiceEyebrow}>
                    {portalNotebookMeta.keyConceptLabel}
                  </p>
                  <h2 className={storyLayout.title}>
                    {page.title}{" "}
                    {page.greek ? <span lang="el">{page.greek}</span> : null}
                  </h2>
                  {page.lead ? <p className={storyLayout.lead}>{page.lead}</p> : null}
                  {page.bullets?.map((point) => (
                    <p key={point} className={storyLayout.beatCopy}>
                      {point}
                    </p>
                  ))}
                </>
              ) : page.kind === "notes" ? (
                <>
                  <h2 className={storyLayout.title}>{page.title}</h2>
                  {page.lead ? <p className={storyLayout.lead}>{page.lead}</p> : null}
                  <div className={styles.folioNotesWrap}>
                    <div className={styles.folioNotesHead}>
                      {notesSaved ? (
                        <small>{portalNotebookMeta.notesSaved}</small>
                      ) : null}
                    </div>
                    <textarea
                      className={styles.folioNotesInput}
                      value={notes}
                      onChange={(event) => onNotesChange(event.target.value)}
                      placeholder={portalNotebookMeta.notesPlaceholder}
                      aria-label={portalNotebookMeta.notesLabel}
                    />
                  </div>
                </>
              ) : (
                <>
                  <p className={styles.folioVoiceEyebrow}>
                    {portalNotebookMeta.whatToKnow}
                  </p>
                  <h2 className={storyLayout.title}>{page.title}</h2>
                  {page.bullets ? (
                    <ul className={styles.folioBulletList}>
                      {page.bullets.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  ) : null}
                </>
              )}
            </PhilooFolioVoice>
          }
        />
      </PhilooFolioStage>
    </div>
  );
}
