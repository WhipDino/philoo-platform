"use client";

import Image from "next/image";
import Link from "next/link";
import { Books, CaretRight, MapTrifold, Play } from "@phosphor-icons/react";
import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  filterLibraryGroups,
  getLibraryStats,
  getResumeChapters,
  groupStatusLabel,
  groupsByEra,
  libraryGroups,
  libraryEraTabs,
  libraryEras,
  libraryTopicTabs,
  type LibraryEraFilter,
  type LibraryGroup,
  type LibraryTopicFilter,
} from "@/domains/curriculum-catalog/library-catalog";
import {
  getLibraryGroupVisual,
  listPlayableChapterCards,
  type PlayableChapterCard,
} from "./library-visual-catalog";
import {
  getTrailIdForLibraryGroup,
  isLibraryModuleMapAvailable,
} from "./library-trail-bridge";
import { StudentPathMapView } from "./student-path-map-view";
import styles from "./student-library.module.css";

export function StudentLibraryView({
  searchQuery,
  moduleId,
  onModuleChange,
}: {
  searchQuery: string;
  moduleId: string | null;
  onModuleChange: (moduleId: string | null) => void;
}) {
  const [eraId, setEraId] = useState<LibraryEraFilter>("all");
  const [topicId, setTopicId] = useState<LibraryTopicFilter>("all");
  const stats = getLibraryStats();
  const resume = getResumeChapters();
  const visibleGroups = useMemo(
    () => filterLibraryGroups(searchQuery, eraId, topicId),
    [searchQuery, eraId, topicId],
  );
  const sections = groupsByEra(visibleGroups);
  const playableNow = useMemo(
    () =>
      listPlayableChapterCards(visibleGroups).filter(
        (chapter) => chapter.status !== "in-progress",
      ),
    [visibleGroups],
  );
  const emptyEra =
    eraId !== "all" && visibleGroups.length === 0 && !searchQuery.trim();

  const mapTrailId = moduleId ? getTrailIdForLibraryGroup(moduleId) : null;
  if (moduleId && mapTrailId && isLibraryModuleMapAvailable(moduleId)) {
    return (
      <StudentPathMapView
        trailId={mapTrailId}
        onBack={() => onModuleChange(null)}
      />
    );
  }

  const showBrowseRails =
    eraId === "all" && topicId === "all" && !searchQuery.trim();

  return (
    <section className={styles.page} aria-labelledby="biblioteca-titulo">
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>
            <Books size={16} weight="duotone" aria-hidden="true" />
            Acervo Philoo
          </p>
          <h1 id="biblioteca-titulo">Biblioteca</h1>
          <p className={styles.heroLead}>
            Passe pelas eras, escolha um módulo e abra o mapa de encontros — ou
            retome uma aula que já começou.
          </p>
          <div className={styles.statRow}>
            <span className={styles.statPill}>{stats.eraCount} eras</span>
            <span className={styles.statPill}>{stats.groupCount} módulos</span>
            <span className={styles.statPill}>{stats.philosopherCount} filósofos</span>
          </div>
        </div>
        <div className={styles.heroArt} aria-hidden="true">
          <Image
            src="/images/portal/path-map/presocratics-trail-banner-v1.png"
            alt=""
            fill
            sizes="(max-width: 820px) 40vw, 360px"
            className={styles.heroImage}
            unoptimized
            priority
          />
        </div>
      </header>

      <div className={styles.filterPanel}>
        <div className={styles.filterGroup}>
          <p className={styles.filterLabel}>Tema</p>
          <div className={styles.tabs} role="toolbar" aria-label="Filtrar por tema">
            {libraryTopicTabs.map((tab) => (
              <button
                className={styles.tab}
                key={tab.id}
                type="button"
                aria-pressed={topicId === tab.id}
                onClick={() => setTopicId(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.filterGroup}>
          <p className={styles.filterLabel}>Era</p>
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
        </div>
      </div>

      {showBrowseRails && resume.length > 0 ? (
        <Shelf title="Retomar" hint="Continue de onde parou">
          {resume.map((chapter) => {
            const group =
              libraryGroups.find((item) =>
                item.chapters.some((entry) => entry.id === chapter.id),
              ) ?? libraryGroups.find((item) => item.title === chapter.groupTitle);
            const visual = getLibraryGroupVisual(group?.id ?? "cave");
            return (
              <Link
                className={styles.resumeCard}
                key={chapter.id}
                href={chapter.href ?? "/inicio"}
              >
                <div className={styles.resumeMedia}>
                  <Image
                    src={visual.coverSrc}
                    alt=""
                    fill
                    sizes="280px"
                    className={styles.coverImage}
                    unoptimized
                  />
                  <span className={styles.resumePlay} aria-hidden="true">
                    <Play size={18} weight="fill" />
                  </span>
                </div>
                <div className={styles.resumeBody}>
                  <span className={styles.cardEyebrow}>
                    {eraLabel(chapter.eraId)} · {chapter.groupTitle}
                  </span>
                  <h3>{chapter.title}</h3>
                  <p>{chapter.stageLabel}</p>
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
                </div>
              </Link>
            );
          })}
        </Shelf>
      ) : null}

      {showBrowseRails && playableNow.length > 0 ? (
        <Shelf title="Abrir agora" hint="Aulas já disponíveis no acervo">
          {playableNow.map((chapter) => (
            <LessonPoster key={`${chapter.groupId}-${chapter.id}`} chapter={chapter} />
          ))}
        </Shelf>
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
          ou de um módulo.
        </p>
      ) : null}

      {sections.map(({ era, groups }) => (
        <Shelf
          key={era.id}
          title={era.label}
          hint={era.dates}
          action={
            eraId === "all" ? (
              <button
                className={styles.shelfAction}
                type="button"
                onClick={() => setEraId(era.id)}
              >
                Ver era inteira
                <CaretRight size={15} weight="bold" />
              </button>
            ) : null
          }
        >
          {groups.map((group) => (
            <ModulePoster
              key={group.id}
              group={group}
              onOpenModule={() => onModuleChange(group.id)}
            />
          ))}
        </Shelf>
      ))}
    </section>
  );
}

function Shelf({
  title,
  hint,
  action,
  children,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={styles.shelf} aria-label={title}>
      <div className={styles.shelfHead}>
        <div>
          <h2 className={styles.shelfTitle}>{title}</h2>
          {hint ? <p className={styles.shelfHint}>{hint}</p> : null}
        </div>
        {action}
      </div>
      <div className={styles.shelfRail}>{children}</div>
    </section>
  );
}

function ModulePoster({
  group,
  onOpenModule,
}: {
  group: LibraryGroup;
  onOpenModule: () => void;
}) {
  const visual = getLibraryGroupVisual(group.id);
  const hasMap = isLibraryModuleMapAvailable(group.id);
  const status = groupStatusLabel(group);
  const philosopherLine = group.philosophers
    .slice(0, 3)
    .map((person) => person.name)
    .join(" · ");
  const morePhilosophers =
    group.philosophers.length > 3 ? ` +${group.philosophers.length - 3}` : "";

  const card = (
    <>
      <div className={styles.posterMedia} style={{ "--accent": visual.accent } as CSSProperties}>
        <Image
          src={visual.coverSrc}
          alt=""
          fill
          sizes="(max-width: 768px) 72vw, 280px"
          className={styles.coverImage}
          unoptimized
        />
        <span className={styles.posterBadge} data-status={group.status}>
          {status}
        </span>
        {hasMap ? (
          <span className={styles.posterMapHint} aria-hidden="true">
            <MapTrifold size={14} weight="duotone" />
            Mapa
          </span>
        ) : null}
      </div>
      <div className={styles.posterBody}>
        <h3>{group.title}</h3>
        <p className={styles.posterTagline}>{visual.tagline}</p>
        <p className={styles.posterMeta}>
          {philosopherLine}
          {morePhilosophers}
        </p>
      </div>
    </>
  );

  if (hasMap) {
    return (
      <button
        type="button"
        className={styles.posterCard}
        data-status={group.status}
        onClick={onOpenModule}
        aria-label={`Abrir mapa de ${group.title}`}
      >
        {card}
      </button>
    );
  }

  return (
    <article className={styles.posterCard} data-status={group.status} data-muted="true">
      {card}
    </article>
  );
}

function LessonPoster({ chapter }: { chapter: PlayableChapterCard }) {
  if (!chapter.href) {
    return null;
  }

  return (
    <Link className={styles.lessonCard} href={chapter.href}>
      <div className={styles.lessonMedia}>
        <Image
          src={chapter.coverSrc}
          alt=""
          fill
          sizes="220px"
          className={styles.coverImage}
          unoptimized
        />
        <span className={styles.lessonPlay} aria-hidden="true">
          <Play size={16} weight="fill" />
        </span>
      </div>
      <div className={styles.lessonBody}>
        <span className={styles.cardEyebrow}>{chapter.groupTitle}</span>
        <strong>{chapter.title}</strong>
        <span>{chapter.guide}</span>
      </div>
    </Link>
  );
}

function eraLabel(eraId: LibraryGroup["eraId"]) {
  return libraryEras.find((era) => era.id === eraId)?.label ?? eraId;
}
