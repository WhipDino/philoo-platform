"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Books,
  CaretRight,
  Check,
  ClipboardText,
  Compass,
  House,
  LockKey,
  MagnifyingGlass,
  MapTrifold,
  Notebook,
  PencilSimple,
  Play,
  UserCircle,
  X,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { StudentLibraryView } from "./student-library-view";
import { StudentPathMapView } from "./student-path-map-view";
import { StudentPathView } from "./student-path-view";
import {
  getHomeworkAttentionCount,
  portalHomework,
} from "./student-homework-content";
import { StudentHomeworkView } from "./student-homework-view";
import { getNotebookNavMeta } from "./student-notebook-content";
import { StudentNotebookView } from "./student-notebook-view";
import home from "./student-home.module.css";
import styles from "./student-portal.module.css";
import {
  homeCurrentLesson,
  homeModuleTrail,
  homeNextChapter,
  homeSavedWord,
  homeTask,
  homeTeacherNote,
  homeTrail,
  homeTrailDays,
  portalAnnouncements,
  portalStudent,
  type PortalAnnouncement,
  type PortalView,
} from "./student-portal-content";

const sideNavigation = [
  { id: "home" as const, label: "Início" },
  { id: "journey" as const, label: "Meu caminho" },
  { id: "path-map" as const, label: "Mapa" },
  { id: "explore" as const, label: "Biblioteca" },
  { id: "homework" as const, label: "Lição de casa" },
  { id: "notebook" as const, label: "Caderno" },
] as const;

const tabIcons = {
  home: House,
  journey: Compass,
  "path-map": MapTrifold,
  explore: Books,
  homework: ClipboardText,
  notebook: Notebook,
} as const;

export function StudentPortal() {
  const [activeView, setActiveView] = useState<PortalView>("home");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [readAnnouncements, setReadAnnouncements] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [largerText, setLargerText] = useState(false);
  const [quietMotion, setQuietMotion] = useState(false);
  const [compactNav, setCompactNav] = useState(false);
  const [showHeroArt, setShowHeroArt] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [homeworkAssignmentId, setHomeworkAssignmentId] = useState<string | null>(
    null,
  );
  const unreadCount = portalAnnouncements.length - readAnnouncements.size;
  const homeworkAttentionCount = getHomeworkAttentionCount();
  const notebookNavMeta = getNotebookNavMeta();

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const compact = window.matchMedia("(max-width: 1023px)");
    const desktopArt = window.matchMedia("(min-width: 640px)");
    const apply = () => {
      setCompactNav(compact.matches);
      setShowHeroArt(desktopArt.matches);
    };
    apply();
    compact.addEventListener("change", apply);
    desktopArt.addEventListener("change", apply);
    return () => {
      compact.removeEventListener("change", apply);
      desktopArt.removeEventListener("change", apply);
    };
  }, []);

  useEffect(() => {
    function applyViewFromUrl() {
      const params = new URLSearchParams(window.location.search);
      const view = params.get("view");
      const homeworkId = params.get("homework");

      if (
        view === "journey" ||
        view === "path-map" ||
        view === "explore" ||
        view === "homework" ||
        view === "notebook"
      ) {
        setActiveView(view);
      }

      if (view === "homework") {
        setHomeworkAssignmentId(homeworkId);
      } else {
        setHomeworkAssignmentId(null);
      }
    }

    applyViewFromUrl();
    window.addEventListener("popstate", applyViewFromUrl);
    return () => window.removeEventListener("popstate", applyViewFromUrl);
  }, []);

  function openView(view: PortalView, homeworkId?: string | null) {
    setNotificationOpen(false);
    setActiveView(view);
    const url = new URL(window.location.href);
    if (
      view === "journey" ||
      view === "path-map" ||
      view === "explore" ||
      view === "homework" ||
      view === "notebook"
    ) {
      url.searchParams.set("view", view);
    } else {
      url.searchParams.delete("view");
    }

    if (view === "homework" && homeworkId) {
      url.searchParams.set("homework", homeworkId);
      setHomeworkAssignmentId(homeworkId);
    } else {
      url.searchParams.delete("homework");
      setHomeworkAssignmentId(null);
    }

    window.history.replaceState({}, "", `${url.pathname}${url.search}`);
    requestAnimationFrame(() => {
      document.querySelector<HTMLElement>("#conteudo")?.focus({ preventScroll: true });
    });
  }

  function setHomeworkAssignment(assignmentId: string | null) {
    const url = new URL(window.location.href);
    url.searchParams.set("view", "homework");
    if (assignmentId) {
      url.searchParams.set("homework", assignmentId);
    } else {
      url.searchParams.delete("homework");
    }
    setHomeworkAssignmentId(assignmentId);
    window.history.replaceState({}, "", `${url.pathname}${url.search}`);
  }

  function markRead(id: string) {
    setReadAnnouncements((current) => new Set(current).add(id));
  }

  return (
    <div
      className={home.shell}
      data-large-text={largerText}
      data-quiet-motion={quietMotion}
      data-view={activeView}
    >
      <header className={home.topbar}>
        <Link className={home.brand} href="/inicio" aria-label="Philoo, início">
          Philoo
        </Link>
        <label className={home.search}>
          <MagnifyingGlass size={18} weight="bold" aria-hidden="true" />
          <input
            type="search"
            placeholder="Buscar um filósofo, um módulo..."
            aria-label="Buscar um filósofo, um módulo"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              if (activeView !== "explore") {
                setActiveView("explore");
                const url = new URL(window.location.href);
                url.searchParams.set("view", "explore");
                window.history.replaceState({}, "", `${url.pathname}${url.search}`);
              }
            }}
          />
        </label>
        <div className={home.topbarEnd}>
          <div className={home.bellWrap}>
            <button
              className={home.bell}
              type="button"
              onClick={() => setNotificationOpen((current) => !current)}
              aria-label={`${unreadCount} avisos não lidos`}
              aria-expanded={notificationOpen}
              aria-controls="notification-preview"
            >
              <Bell size={18} weight="bold" />
              {unreadCount > 0 ? <span className={home.badge}>{unreadCount}</span> : null}
            </button>
            {notificationOpen ? (
              <NotificationPreview
                unreadCount={unreadCount}
                close={() => setNotificationOpen(false)}
                showAll={() => openView("announcements")}
              />
            ) : null}
          </div>
          <button
            className={home.avatarButton}
            type="button"
            aria-current={activeView === "profile" ? "page" : undefined}
            aria-label={`Abrir perfil de ${portalStudent.fullName}`}
            onClick={() => openView("profile")}
          >
            <span className={home.avatar}>{portalStudent.initials}</span>
            <span className={home.avatarName}>{portalStudent.firstName}</span>
          </button>
        </div>
      </header>

      <div className={home.body}>
        <aside className={home.nav} aria-label="Navegação da plataforma">
          <p className={home.navLabel}>Sua sala</p>
          <nav className={home.navLinks}>
            {sideNavigation.map(({ id, label }) => (
              <button
                className={home.navItem}
                key={id}
                type="button"
                aria-current={activeView === id ? "page" : undefined}
                onClick={() => openView(id)}
              >
                <i className={home.dot} aria-hidden="true" />
                {label}
                {id === "homework" && homeworkAttentionCount > 0 ? (
                  <b className={home.navCount}>{homeworkAttentionCount}</b>
                ) : null}
                {id === "notebook" ? (
                  <span className={home.navMeta}>{notebookNavMeta.count}</span>
                ) : null}
              </button>
            ))}
          </nav>
          <div className={home.classCard}>
            <p>{portalStudent.classroom}</p>
            <strong>{portalStudent.school}</strong>
            <span>{portalStudent.teacher}</span>
          </div>
        </aside>

        <main
          id="conteudo"
          className={home.center}
          data-home={activeView === "home"}
          data-path={activeView === "journey"}
          tabIndex={-1}
        >
          {activeView === "home" ? (
            <>
              <div className={home.phoneLesson}>
                {!showHeroArt ? (
                  <div className={home.phoneCover}>
                    <Image
                      src={homeCurrentLesson.heroImage}
                      alt="Platão na entrada da caverna, à espera de descer com você"
                      fill
                      sizes="100vw"
                      quality={100}
                      unoptimized
                    />
                  </div>
                ) : null}
              <section className={home.board} aria-labelledby="modulo-atual">
                <div className={home.stage}>
                  {showHeroArt ? (
                    <div className={home.art}>
                      <Image
                        src={homeCurrentLesson.heroImage}
                        alt="Platão na entrada da caverna, à espera de descer com você"
                        fill
                        sizes="(max-width: 1023px) 100vw, 80vw"
                        quality={100}
                        unoptimized
                        priority
                      />
                    </div>
                  ) : null}
                  <div className={home.stageCopy}>
                    <p className={`${home.eyebrow} ${home.eyebrowDesk}`}>
                      Olá, {portalStudent.firstName} · você parou em {homeCurrentLesson.word}
                    </p>
                    <p className={`${home.eyebrow} ${home.eyebrowPhone}`}>
                      {homeTask.phoneCurrentLabel}
                    </p>
                    <h1 id="modulo-atual">{homeCurrentLesson.moduleTitle}</h1>
                    <p className={home.support}>{homeCurrentLesson.support}</p>
                    <div className={home.progressRow}>
                      <div className={home.track} aria-hidden="true">
                        <div
                          className={home.fill}
                          style={{ width: `${homeCurrentLesson.progress}%` }}
                        />
                      </div>
                      <span
                        className={home.percent}
                        role="progressbar"
                        aria-label={`Progresso em ${homeCurrentLesson.moduleTitle}`}
                        aria-valuenow={homeCurrentLesson.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        {homeCurrentLesson.progress}%
                      </span>
                    </div>
                    <div className={home.actions}>
                      <Link className={home.primary} href={homeCurrentLesson.continueHref}>
                        <span className={home.play} aria-hidden="true">
                          <Play size={13} weight="fill" />
                        </span>
                        Continuar aula
                      </Link>
                    </div>
                  </div>
                  <span className={home.stageSpacer} aria-hidden="true" />
                </div>
                <div className={home.boardSplit} aria-hidden="true" />
                <nav className={home.dock} aria-label="Atalhos da home">
                  <Link className={home.dockItem} href={homeNextChapter.href}>
                    <span className={home.dockIcon} aria-hidden="true">
                      <Play size={16} weight="fill" />
                    </span>
                    <span className={home.dockCopy}>
                      <strong>Seguir para o capítulo {homeNextChapter.n}</strong>
                      <span>
                        {homeNextChapter.title} · {homeNextChapter.durationShort}
                      </span>
                    </span>
                    <CaretRight className={home.dockArrow} size={16} weight="bold" />
                  </Link>
                  <button
                    className={home.dockItem}
                    type="button"
                    onClick={() => openView("notebook")}
                  >
                    <span className={home.dockIcon} aria-hidden="true">
                      <PencilSimple size={16} weight="bold" />
                    </span>
                    <span className={home.dockCopy}>
                      <strong>Abrir o seu caderno</strong>
                      <span>
                        {notebookNavMeta.count} cadernos · última:{" "}
                        {notebookNavMeta.latestTitle ?? "—"}
                      </span>
                    </span>
                    <CaretRight className={home.dockArrow} size={16} weight="bold" />
                  </button>
                  <button
                    className={home.dockItem}
                    type="button"
                    onClick={() => openView("homework", "doxa-em-tres-perguntas")}
                  >
                    <span className={home.dockFace} aria-hidden="true">
                      {homeTeacherNote.initials}
                      {homeworkAttentionCount > 0 ? (
                        <b className={home.dockBadge}>{homeworkAttentionCount}</b>
                      ) : null}
                    </span>
                    <span className={home.dockCopy}>
                      <strong>Ver o que a professora pediu</strong>
                      <span>3 perguntas · {portalHomework.due}</span>
                    </span>
                    <CaretRight className={home.dockArrow} size={16} weight="bold" />
                  </button>
                </nav>
              </section>
              </div>

              <PhoneHomeRail
                hidden={showHeroArt}
                openNotebook={() => openView("notebook")}
                openHomework={() => openView("homework", "doxa-em-tres-perguntas")}
              />
            </>
          ) : (
            <div className={home.pagePane}>
              {activeView === "explore" ? (
                <StudentLibraryView
                  searchQuery={searchQuery}
                  onOpenPath={() => openView("journey")}
                />
              ) : activeView === "journey" ? (
                <StudentPathView />
              ) : activeView === "path-map" ? (
                <StudentPathMapView />
              ) : activeView === "homework" ? (
                <StudentHomeworkView
                  initialAssignmentId={homeworkAssignmentId}
                  onAssignmentChange={setHomeworkAssignment}
                />
              ) : activeView === "announcements" ? (
                <AnnouncementsView
                  readAnnouncements={readAnnouncements}
                  markRead={markRead}
                />
              ) : activeView === "notebook" ? (
                <StudentNotebookView />
              ) : (
                <ProfileView
                  largerText={largerText}
                  quietMotion={quietMotion}
                  setLargerText={setLargerText}
                  setQuietMotion={setQuietMotion}
                />
              )}
            </div>
          )}
        </main>

        {activeView === "home" ? (
        <aside className={home.sala} aria-label="Seu caminho">
          <div className={home.salaInner}>
            <div className={home.pathHead}>
              <h2 className={home.salaTitle} id="seu-caminho-titulo">
                Seu caminho
              </h2>
            </div>
            <p className={home.pathModule}>
              <span>{homeCurrentLesson.moduleTitle}</span>
              <b>
                {homeCurrentLesson.readCount} / {homeCurrentLesson.chapterCount}
              </b>
            </p>
            <ol className={home.path} aria-labelledby="seu-caminho-titulo">
              {homeModuleTrail.map((stop, index) => {
                const next = homeModuleTrail[index + 1];
                const wire = next
                  ? stop.status === "lido" &&
                    (next.status === "lido" || next.status === "atual")
                    ? "on"
                    : stop.status === "atual"
                      ? "soon"
                      : "off"
                  : null;
                const meta =
                  stop.status === "lido"
                    ? `Capítulo ${stop.n} · lido`
                    : stop.status === "atual"
                      ? `Capítulo ${stop.n} · você está aqui · ${homeCurrentLesson.progress}%`
                      : stop.status === "aberto"
                        ? `Capítulo ${stop.n} · seguir`
                        : `Capítulo ${stop.n} · ainda fechado`;
                const copy = (
                  <>
                    <strong>{stop.title}</strong>
                    <span>{meta}</span>
                  </>
                );

                return (
                  <li className={home.pathStep} key={stop.n} data-status={stop.status}>
                    <span className={home.pathRail} aria-hidden="true">
                      <span className={home.pathDot} data-status={stop.status}>
                        {stop.status === "atual" ? (
                          <i className={home.pathPulse} />
                        ) : null}
                      </span>
                      {wire ? (
                        <span className={home.pathWire} data-kind={wire} />
                      ) : null}
                    </span>
                    {stop.status === "bloqueado" ? (
                      <span className={home.pathCopy}>{copy}</span>
                    ) : (
                      <Link
                        className={home.pathCopy}
                        href={stop.href}
                        aria-current={stop.status === "atual" ? "step" : undefined}
                      >
                        {copy}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
            <div className={home.rastro}>
              <div className={home.rastroHead}>
                <div className={home.sectionLabel}>Seu rastro</div>
                <span className={home.streak}>{homeTrail.streak}</span>
              </div>
              <div className={home.days} aria-label="Dias da semana">
                {homeTrailDays.map((day, index) => (
                  <div className={home.day} key={`${day.label}-${index}`}>
                    <span className={home.dayCell} data-on={day.active} data-i={index} />
                    <span>{day.label}</span>
                  </div>
                ))}
              </div>
              <p className={home.rastroNote}>{homeTrail.today}</p>
            </div>
          </div>
        </aside>
        ) : null}
      </div>

      {compactNav ? (
      <nav className={home.tabBar} aria-label="Navegação em telas menores">
        {sideNavigation.map(({ id, label }) => {
          const Icon = tabIcons[id];
          return (
            <button
              className={home.tabItem}
              key={`tab-${id}`}
              type="button"
              aria-current={activeView === id ? "page" : undefined}
              onClick={() => openView(id)}
            >
              <span className={home.tabIcon} aria-hidden="true">
                <Icon size={20} weight={activeView === id ? "fill" : "regular"} />
                {id === "homework" && homeworkAttentionCount > 0 ? (
                  <b className={home.tabBadge}>{homeworkAttentionCount}</b>
                ) : null}
              </span>
              {label}
            </button>
          );
        })}
      </nav>
      ) : null}
    </div>
  );
}

function PhoneHomeRail({
  hidden,
  openNotebook,
  openHomework,
}: {
  hidden: boolean;
  openNotebook: () => void;
  openHomework: () => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const notebookNavMeta = getNotebookNavMeta();
  const labels = [
    homeTask.phoneHomeworkLabel,
    "Seu caderno",
    `Capítulo ${homeNextChapter.n}`,
  ];

  function syncPage() {
    const root = scroller.current;
    if (!root) {
      return;
    }
    const cards = Array.from(root.children) as HTMLElement[];
    const center = root.scrollLeft + root.clientWidth / 2;
    const next = cards.findIndex((card) => {
      const start = card.offsetLeft;
      return center >= start && center < start + card.offsetWidth;
    });
    if (next >= 0) {
      setPage(next);
    }
  }

  function goTo(index: number) {
    const root = scroller.current;
    const card = root?.children[index] as HTMLElement | undefined;
    if (!root || !card) {
      return;
    }
    const left =
      card.getBoundingClientRect().left - root.getBoundingClientRect().left + root.scrollLeft;
    root.scrollTo({ left, behavior: "auto" });
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(Math.min(page + 1, labels.length - 1));
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(Math.max(page - 1, 0));
    }
  }

  return (
    <div className={home.phoneRail} hidden={hidden}>
      <h2 className={home.phoneRailTitle}>{homeTask.phoneQuickLabel}</h2>
      <div
        ref={scroller}
        className={home.phoneRailTrack}
        tabIndex={0}
        aria-label="Lição da professora, caderno e próximo capítulo"
        onScroll={syncPage}
        onKeyDown={onKeyDown}
      >
        <article className={home.phoneRailCard}>
          <p>{homeTask.phoneHomeworkLabel}</p>
          <strong>{homeTask.title}</strong>
          <span>
            {portalHomework.due} · 3 perguntas. “{homeTeacherNote.quote}”
          </span>
          <button className={home.phoneRailAction} type="button" onClick={openHomework}>
            {homeTask.phoneHomeworkCta}
          </button>
        </article>
        <article className={home.phoneRailCard}>
          <p>Seu caderno</p>
          <strong>{notebookNavMeta.latestTitle ?? "Seu caderno"}</strong>
          <span>
            {notebookNavMeta.count} cadernos · conceito:{" "}
            {notebookNavMeta.latestConcept ?? homeSavedWord.word}
          </span>
          <button className={home.phoneRailAction} type="button" onClick={openNotebook}>
            Abrir o caderno
          </button>
        </article>
        <article className={home.phoneRailCard}>
          <p>Próximo capítulo</p>
          <strong>{homeNextChapter.title}</strong>
          <span>
            Capítulo {homeNextChapter.n} · {homeNextChapter.durationShort}
          </span>
          <Link className={home.phoneRailAction} href={homeNextChapter.href}>
            Abrir o capítulo
          </Link>
        </article>
      </div>
      <div className={home.phoneRailDots} aria-hidden="true">
        {labels.map((label, index) => (
          <i key={label} data-on={index === page} />
        ))}
      </div>
    </div>
  );
}

function NotificationPreview({
  unreadCount,
  close,
  showAll,
}: {
  unreadCount: number;
  close: () => void;
  showAll: () => void;
}) {
  return (
    <aside
      id="notification-preview"
      className={styles.notificationPreview}
      aria-label="Prévia dos avisos"
    >
      <div className={styles.notificationPreviewHeader}>
        <div>
          <span>Avisos</span>
          <strong>
            {unreadCount} {unreadCount === 1 ? "novo" : "novos"}
          </strong>
        </div>
        <button type="button" onClick={close} aria-label="Fechar avisos">
          <X size={18} weight="bold" />
        </button>
      </div>
      <div className={styles.notificationPreviewList}>
        {portalAnnouncements.slice(0, 2).map((announcement) => (
          <article key={announcement.id}>
            <i aria-hidden="true" />
            <div>
              <span>
                {announcement.author} · {announcement.date}
              </span>
              <strong>{announcement.title}</strong>
              <p>{announcement.body}</p>
            </div>
          </article>
        ))}
      </div>
      <button className={styles.showAllNotifications} type="button" onClick={showAll}>
        Ver todos os avisos <CaretRight size={17} weight="bold" />
      </button>
    </aside>
  );
}

function AnnouncementsView({
  readAnnouncements,
  markRead,
}: {
  readAnnouncements: ReadonlySet<string>;
  markRead: (id: string) => void;
}) {
  const unread = portalAnnouncements.length - readAnnouncements.size;
  return (
    <section className={styles.pageView}>
      <ViewHeading
        eyebrow="Avisos da sala"
        title={unread ? `${unread} ${unread === 1 ? "novidade" : "novidades"} para você.` : "Tudo lido por aqui."}
        description="Recados da professora e da escola. Se ela pedir uma tarefa, a tarefa em si fica em Lição de casa."
        icon={<Bell size={26} weight="duotone" />}
      />
      <div className={styles.announcementList}>
        {portalAnnouncements.map((announcement) => (
          <Announcement
            key={announcement.id}
            announcement={announcement}
            read={readAnnouncements.has(announcement.id)}
            markRead={markRead}
          />
        ))}
      </div>
    </section>
  );
}

function Announcement({
  announcement,
  read,
  markRead,
}: {
  announcement: PortalAnnouncement;
  read: boolean;
  markRead: (id: string) => void;
}) {
  return (
    <article
      data-read={read}
      aria-label={`${announcement.title}. ${read ? "Lido" : "Não lido"}`}
    >
      <span>{announcement.tag}</span>
      <div>
        <p>{announcement.author} · {announcement.date}</p>
        <h2>{announcement.title}</h2>
        <div>{announcement.body}</div>
      </div>
      <button type="button" onClick={() => markRead(announcement.id)} disabled={read}>
        {read ? <Check size={17} weight="bold" /> : null}
        {read ? "Lido" : "Marcar como lido"}
      </button>
    </article>
  );
}

function ProfileView({
  largerText,
  quietMotion,
  setLargerText,
  setQuietMotion,
}: {
  largerText: boolean;
  quietMotion: boolean;
  setLargerText: (value: boolean) => void;
  setQuietMotion: (value: boolean) => void;
}) {
  return (
    <section className={styles.pageView}>
      <ViewHeading
        eyebrow="Meu espaço"
        title="Seu perfil acompanha o seu jeito de aprender."
        description="Ajuste a experiência sem mudar suas aulas ou seu progresso."
        icon={<UserCircle size={26} weight="duotone" />}
      />
      <div className={styles.profileGrid}>
        <article className={styles.identityCard}>
          <span>{portalStudent.initials}</span>
          <div>
            <h2 aria-label={portalStudent.fullName}>
              <span className={styles.identityNameFull} aria-hidden="true">
                {portalStudent.fullName}
              </span>
              <span className={styles.identityNameShort} aria-hidden="true">
                {portalStudent.firstName}
              </span>
            </h2>
            <p>{portalStudent.classroom} · {portalStudent.school}</p>
            <small>{portalStudent.email}</small>
          </div>
        </article>
        <article className={styles.preferenceCard}>
          <h2>Leitura e movimento</h2>
          <Preference
            label="Texto um pouco maior"
            description="Aumenta a leitura em todo o portal."
            checked={largerText}
            onChange={setLargerText}
          />
          <Preference
            label="Movimentos mais tranquilos"
            description="Reduz animações e transições."
            checked={quietMotion}
            onChange={setQuietMotion}
          />
        </article>
        <article className={styles.privacyCard}>
          <LockKey size={27} weight="duotone" />
          <div>
            <h2>Suas reflexões continuam suas</h2>
            <p>Quando uma resposta puder ser vista pela professora, o Philoo vai avisar antes.</p>
          </div>
        </article>
      </div>
    </section>
  );
}

function Preference({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className={styles.preference}>
      <span><strong>{label}</strong><small>{description}</small></span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <i aria-hidden="true"><span /></i>
    </label>
  );
}

function ViewHeading({
  eyebrow,
  title,
  description,
  icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <div className={styles.viewHeading}>
      <span>{icon}</span>
      <div>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <div>{description}</div>
      </div>
    </div>
  );
}
