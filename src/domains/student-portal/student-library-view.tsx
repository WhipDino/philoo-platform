"use client";

import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import {
  filterLibraryGroups,
  getLibraryStats,
  getResumeChapters,
  groupStatusLabel,
  groupsByEra,
  isPlayableLibraryChapter,
  libraryEraTabs,
  libraryEras,
  type LibraryChapter,
  type LibraryEraFilter,
  type LibraryGroup,
} from "@/domains/curriculum-catalog/library-catalog";
import styles from "./student-library.module.css";

export function StudentLibraryView({
  searchQuery,
  onOpenPath,
}: {
  searchQuery: string;
  onOpenPath: () => void;
}) {
  const [eraId, setEraId] = useState<LibraryEraFilter>("all");
  const stats = getLibraryStats();
  const resume = getResumeChapters();
  const visibleGroups = useMemo(
    () => filterLibraryGroups(searchQuery, eraId),
    [searchQuery, eraId],
  );
  const sections = groupsByEra(visibleGroups);
  const emptyEra =
    eraId !== "all" &&
    visibleGroups.length === 0 &&
    !searchQuery.trim();

  return (
    <section className={styles.page} aria-labelledby="biblioteca-titulo">
      <p className={styles.stats}>
        Acervo · {stats.eraCount} eras · {stats.groupCount} grupos ·{" "}
        {stats.philosopherCount} filósofos
      </p>
      <div className={styles.intro}>
        <h1 id="biblioteca-titulo">Biblioteca</h1>
        <p>
          A história aparece em ordem de tempo. Você pode abrir uma era ou um
          grupo mesmo fora do seu caminho. O caminho recomendado continua em
          Meu caminho.
        </p>
      </div>

      <div className={styles.tabs} role="toolbar" aria-label="Filtrar por era">
        {libraryEraTabs.map((tab) => (
          <button
            className={styles.tab}
            key={tab.id}
            type="button"
            aria-pressed={eraId === tab.id}
            onClick={() => setEraId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {resume.length > 0 && eraId === "all" && !searchQuery.trim() ? (
        <section aria-labelledby="retomar-titulo">
          <div className={styles.sectionHead}>
            <h2 id="retomar-titulo">Retomar</h2>
          </div>
          <div className={styles.resumeRail}>
            {resume.map((chapter) => (
              <Link
                className={styles.resumeCard}
                key={chapter.id}
                href={chapter.href ?? "/inicio"}
              >
                <span className={styles.resumeEyebrow}>
                  {eraLabel(chapter.eraId)} · {chapter.groupTitle}
                </span>
                <h3>{chapter.title}</h3>
                <p className={styles.resumeStage}>
                  {chapter.stageLabel} · {chapter.guide}
                </p>
                <div
                  className={styles.progressTrack}
                  role="progressbar"
                  aria-label={`Progresso em ${chapter.title}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={chapter.progressPct}
                >
                  <div
                    className={styles.progressFill}
                    style={{ width: `${chapter.progressPct}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {emptyEra ? (
        <p className={styles.empty}>
          Esta era ainda está sendo montada. Quando as aulas existirem, elas
          entram neste mesmo acervo, sem inventar progresso.
        </p>
      ) : null}

      {searchQuery.trim() && visibleGroups.length === 0 ? (
        <p className={styles.empty}>
          Nada neste acervo combina com essa busca. Tente o nome de um filósofo
          ou de um grupo.
        </p>
      ) : null}

      {sections.map(({ era, groups }) => (
        <section key={era.id} aria-labelledby={`era-${era.id}`}>
          <div className={styles.sectionHead}>
            <div>
              <div className={styles.sectionMeta}>
                <i className={styles.dot} aria-hidden="true" />
                <h2 id={`era-${era.id}`}>{era.label}</h2>
                <span className={styles.dates}>{era.dates}</span>
              </div>
              <p className={styles.blurb}>{era.blurb}</p>
            </div>
            <button
              className={styles.eraLink}
              type="button"
              onClick={() => setEraId(era.id)}
            >
              a era inteira
              <CaretRight size={16} weight="bold" />
            </button>
          </div>
          <div className={styles.groupGrid}>
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} onOpenPath={onOpenPath} />
            ))}
          </div>
        </section>
      ))}
    </section>
  );
}

function GroupCard({
  group,
  onOpenPath,
}: {
  group: LibraryGroup;
  onOpenPath: () => void;
}) {
  const philosopherCount = group.philosophers.length;
  const philosopherWord = philosopherCount === 1 ? "filósofo" : "filósofos";
  const philosopherLine = group.philosophers.map((person) => person.name).join(", ");
  const lessonLine =
    group.lessonCount > 0
      ? `${philosopherCount} ${philosopherWord} · ${group.lessonCount} aulas`
      : `${philosopherCount} ${philosopherWord} · em breve`;
  const hasChapters = group.chapters.length > 0;
  const hasPlayableChapter = group.chapters.some(isPlayableLibraryChapter);
  const inner = (
    <>
      <h3>{group.title}</h3>
      <p className={styles.groupMeta}>{lessonLine}</p>
      <hr />
      <p className={styles.names}>{philosopherLine}</p>
      {hasChapters ? <ChapterList chapters={group.chapters} /> : null}
      <div className={styles.footer}>
        <span>{groupStatusLabel(group)}</span>
        {group.status === "current" && hasChapters ? (
          <button className={styles.pathButton} type="button" onClick={onOpenPath}>
            Abrir meu caminho
            <CaretRight size={14} weight="bold" />
          </button>
        ) : hasPlayableChapter || group.href || group.status === "current" ? (
          <CaretRight size={14} weight="bold" />
        ) : null}
      </div>
    </>
  );

  if (!hasChapters && group.status === "current") {
    return (
      <button
        className={styles.groupCard}
        type="button"
        data-status={group.status}
        onClick={onOpenPath}
      >
        {inner}
      </button>
    );
  }

  if (!hasChapters && group.href) {
    return (
      <Link className={styles.groupCard} href={group.href} data-status={group.status}>
        {inner}
      </Link>
    );
  }

  return (
    <article className={styles.groupCard} data-status={group.status}>
      {inner}
    </article>
  );
}

function ChapterList({ chapters }: { chapters: readonly LibraryChapter[] }) {
  return (
    <ul className={styles.chapterList}>
      {chapters.map((chapter) => {
        const playable = isPlayableLibraryChapter(chapter);
        const copy = (
          <>
            <span className={styles.chapterTitle}>{chapter.title}</span>
            <span className={styles.chapterStage}>{chapter.stageLabel}</span>
          </>
        );

        return (
          <li key={chapter.id}>
            {playable && chapter.href ? (
              <Link className={styles.chapterLink} href={chapter.href}>
                {copy}
              </Link>
            ) : (
              <span className={styles.chapterLocked}>{copy}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function eraLabel(eraId: LibraryGroup["eraId"]) {
  return libraryEras.find((era) => era.id === eraId)?.label ?? eraId;
}
