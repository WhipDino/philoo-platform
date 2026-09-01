"use client";

import Image from "next/image";
import Link from "next/link";
import { CaretLeft, CaretRight, Check, Play } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type ReactNode, type UIEvent } from "react";

import { getCavePathView } from "./student-path-content";
import { lessonProgressPct, railVisibleCount, type BuiltPathLesson } from "./student-path-model";
import path from "./student-path.module.css";

const PLACE_COLLAPSE_QUERY = "(max-width: 1479px)";

const statusLabel: Record<BuiltPathLesson["status"], string> = {
  concluido: "Concluído",
  atual: "Em andamento",
  liberado: "Liberado",
  bloqueado: "Abre depois",
};

export function StudentPathView() {
  const view = getCavePathView();
  const { module, progress, lessons, completed, total, nextModule, pendencias, teacher } =
    view;
  return (
    <div className={path.page}>
      <ScrollPane className={path.mainPane} surfaceClassName={path.main}>
        <section className={path.next} aria-labelledby="voce-esta-aqui">
          <div className={path.nextCopy}>
            <p className={path.kicker} id="voce-esta-aqui">
              Você está aqui
            </p>
            <h1>
              Módulo {module.n} · {module.title}
            </h1>
            <p className={path.nextBody}>{module.intent}</p>
          </div>
          <div className={path.nextArt}>
            <Image
              src={module.portrait}
              alt={module.portraitAlt}
              fill
              sizes="(max-width: 1239px) 100vw, 38vw"
            />
          </div>
        </section>

        <section className={path.trail} aria-labelledby="trilha-licoes">
          <EpisodeRail
            lessons={lessons}
            currentN={progress.currentLessonN}
            currentProgressPct={progress.currentProgressPct}
            completed={completed}
          />
        </section>
      </ScrollPane>

      <PlacePanel
        module={module}
        progress={progress}
        nextModule={nextModule}
        pendencias={pendencias}
        teacher={teacher}
        completed={completed}
        total={total}
      />

    </div>
  );
}

function PlacePanel({
  module,
  progress,
  nextModule,
  pendencias,
  teacher,
  completed,
  total,
}: {
  module: ReturnType<typeof getCavePathView>["module"];
  progress: ReturnType<typeof getCavePathView>["progress"];
  nextModule: ReturnType<typeof getCavePathView>["nextModule"];
  pendencias: ReturnType<typeof getCavePathView>["pendencias"];
  teacher: ReturnType<typeof getCavePathView>["teacher"];
  completed: number;
  total: number;
}) {
  const [placeOpen, setPlaceOpen] = useState(true);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }
    const compact = window.matchMedia(PLACE_COLLAPSE_QUERY);
    const apply = () => setPlaceOpen(!compact.matches);
    apply();
    compact.addEventListener("change", apply);
    return () => compact.removeEventListener("change", apply);
  }, []);

  const toggleLabel = placeOpen ? "Esconder onde você está" : "Mostrar onde você está";

  return (
    <aside className={path.placePane} data-open={placeOpen ? "true" : "false"}>
      <div className={path.place}>
        <div className={path.placeHead}>
          <h2 id="onde-voce-esta-titulo">Onde você está</h2>
          <button
            className={path.placeToggle}
            type="button"
            aria-expanded={placeOpen}
            aria-controls="onde-voce-esta-painel"
            aria-label={toggleLabel}
            title={toggleLabel}
            onClick={() => setPlaceOpen((current) => !current)}
          >
            {placeOpen ? (
              <CaretLeft className={path.placeCaret} size={18} weight="bold" />
            ) : (
              <span className={path.placeDots} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            )}
          </button>
        </div>
        <div className={path.placeFold} id="onde-voce-esta-painel">
          <ScrollPane className={path.placeFoldClip} surfaceClassName={path.placeInner}>
            <p className={path.placeLead}>
              Módulo {module.title} · {module.guide}
            </p>
            <p className={path.count}>
              <strong>{completed}</strong>
              <span>/ {total} lições</span>
            </p>
            <div className={path.moduleBar} aria-hidden="true">
              <i style={{ width: `${Math.round((completed / total) * 100)}%` }} />
            </div>
            {progress.forecastClose ? (
              <p className={path.forecast}>
                No seu ritmo desta semana, você fecha o módulo <b>{progress.forecastClose}</b>.
              </p>
            ) : null}
            <div className={path.checklist}>
              <p>Para fechar o módulo</p>
              <ul>
                {pendencias.map((item) => (
                  <li key={item.id} data-done={item.done}>
                    <span aria-hidden="true">
                      {item.done ? <Check size={12} weight="bold" /> : null}
                    </span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
            <article className={path.note}>
              <div>
                <b aria-hidden="true">{teacher.initials}</b>
                <strong>{teacher.name}</strong>
              </div>
              <p>“{teacher.quote}”</p>
            </article>
            <div className={path.teaser} aria-label={`Módulo ${nextModule.n}, ainda fechado`}>
              <div className={path.teaserArt}>
                <Image src={nextModule.image} alt="" fill sizes="56px" />
              </div>
              <div className={path.teaserCopy}>
                <p>Depois</p>
                <strong>
                  Módulo {nextModule.n} · {nextModule.title}
                </strong>
                <span>{nextModule.condition}</span>
              </div>
            </div>
          </ScrollPane>
        </div>
      </div>
    </aside>
  );
}

function lessonCta(status: BuiltPathLesson["status"]): string {
  if (status === "atual") {
    return "Retomar";
  }
  if (status === "concluido") {
    return "Ver de novo";
  }
  return "Iniciar";
}

function lessonMetaLine(lesson: BuiltPathLesson): string {
  const bits: string[] = [];
  if (lesson.parts) {
    bits.push(`${lesson.parts} partes`);
  }
  if (lesson.minutes) {
    bits.push(`${lesson.minutes} min`);
  }
  return bits.join(" · ") || lesson.meta;
}

function EpisodeRail({
  lessons,
  currentN,
  currentProgressPct,
  completed,
}: {
  lessons: readonly BuiltPathLesson[];
  currentN: number;
  currentProgressPct: number;
  completed: number;
}) {
  const railRef = useRef<HTMLOListElement>(null);
  const [visible, setVisible] = useState<1 | 2 | 3>(3);
  const canBrowse = lessons.length > visible;

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || typeof ResizeObserver !== "function") {
      return;
    }
    const apply = () => {
      const width = rail.clientWidth;
      if (width < 80) {
        return;
      }
      setVisible(railVisibleCount(width));
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(rail);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const current = railRef.current?.querySelector<HTMLElement>("[data-current='true']");
    current?.scrollIntoView?.({ inline: "center", block: "nearest" });
  }, [currentN]);

  function moveRail(direction: -1 | 1) {
    const rail = railRef.current;
    const card = rail?.querySelector("li");
    if (!rail || !card) {
      return;
    }
    const step = card.getBoundingClientRect().width + 16;
    rail.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <>
      <div className={path.trailHead}>
        <h2 id="trilha-licoes">As {lessons.length} lições, em ordem</h2>
        <div className={path.trailTools}>
          <span>{completed} concluídas</span>
          {canBrowse ? (
            <div className={path.railNav}>
              <button type="button" aria-label="Ver lições anteriores" onClick={() => moveRail(-1)}>
                <CaretLeft size={16} weight="bold" />
              </button>
              <button type="button" aria-label="Ver próximas lições" onClick={() => moveRail(1)}>
                <CaretRight size={16} weight="bold" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <ol className={path.episodes} ref={railRef} data-visible={String(visible)}>
      {lessons.map((lesson) => {
        const current = lesson.n === currentN;
        const pct = lessonProgressPct(lesson.status, currentProgressPct);
        const href = lesson.href;
        const cta = lessonCta(lesson.status);
        const playable = lesson.status !== "bloqueado" && Boolean(href);
        return (
          <li key={lesson.id} className={path.episodeItem}>
            <article
              className={path.episode}
              data-status={lesson.status}
              data-current={current}
              aria-current={current ? "step" : undefined}
            >
              <div className={path.episodeStage}>
                {current ? <p className={path.episodeHere}>Você está aqui</p> : null}
                <Image
                  className={path.episodeArt}
                  src={lesson.image}
                  alt={lesson.imageAlt}
                  fill
                  sizes="(max-width: 639px) 92vw, (max-width: 839px) 48vw, 32vw"
                  style={{ objectFit: "cover", objectPosition: "center 40%" }}
                />
              </div>
              <div className={path.episodeBarRow}>
                <div
                  className={path.episodeBar}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={pct}
                  aria-label={`Progresso da lição ${lesson.title}`}
                >
                  <i style={{ width: `${pct}%` }} />
                </div>
                {playable && href ? (
                  <Link
                    className={path.episodePlay}
                    href={href}
                    aria-label={`${cta} ${lesson.title}`}
                  >
                    <Play size={18} weight="fill" />
                  </Link>
                ) : null}
              </div>
              <div className={path.episodeCopy}>
                <p className={path.episodeKicker}>
                  Lição {lesson.n} · {statusLabel[lesson.status]}
                </p>
                <h3 className={path.episodeTitle}>{lesson.title}</h3>
                <p className={path.episodeSummary}>{lesson.summary}</p>
                <div className={path.episodeFoot}>
                  <span>{lessonMetaLine(lesson)}</span>
                  {playable && href ? (
                    <Link className={path.episodeCta} href={href}>
                      {cta}
                    </Link>
                  ) : (
                    <span className={path.episodeWait}>Abre depois</span>
                  )}
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ol>
    </>
  );
}

function revealThumb(
  node: HTMLElement,
  show: boolean,
  setThumb: (value: { show: boolean; top: number; height: number }) => void,
) {
  const { scrollTop, scrollHeight, clientHeight } = node;
  if (scrollHeight <= clientHeight + 2) {
    setThumb({ show: false, top: 10, height: 40 });
    return;
  }
  const inset = 10;
  const track = Math.max(0, clientHeight - inset * 2);
  const height = Math.max(36, (clientHeight / scrollHeight) * track);
  const range = scrollHeight - clientHeight;
  const maxTop = Math.max(0, track - height);
  const top = inset + (range <= 0 ? 0 : (scrollTop / range) * maxTop);
  setThumb({ show, top, height });
}

function ScrollPane({
  className,
  surfaceClassName,
  ariaLabel,
  as: Tag = "div",
  children,
}: {
  className: string;
  surfaceClassName: string;
  ariaLabel?: string;
  as?: "div" | "aside";
  children: ReactNode;
}) {
  const [thumb, setThumb] = useState({ show: false, top: 10, height: 40 });
  const hideTimer = useRef(0);

  function onScroll(event: UIEvent<HTMLElement>) {
    const node = event.currentTarget;
    revealThumb(node, true, setThumb);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      setThumb((current) => ({ ...current, show: false }));
    }, 750);
  }

  return (
    <div className={className}>
      <Tag className={surfaceClassName} aria-label={ariaLabel} onScroll={onScroll}>
        {children}
      </Tag>
      <i
        className={path.idleThumb}
        data-show={thumb.show ? "true" : "false"}
        aria-hidden="true"
        style={{ transform: `translateY(${thumb.top}px)`, height: `${thumb.height}px` }}
      />
    </div>
  );
}
