"use client";

import Link from "next/link";
import {
  Bell,
  Books,
  CaretRight,
  Check,
  ClipboardText,
  House,
  LockKey,
  MagnifyingGlass,
  MapTrifold,
  Notebook,
  UserCircle,
  X,
} from "@phosphor-icons/react";
import { useEffect, useState, type ReactNode } from "react";
import { StudentLibraryView } from "./student-library-view";
import {
  getActiveLibraryModuleId,
  getTrailIdForLibraryGroup,
  resolveTrailIdFromParam,
} from "./library-trail-bridge";
import { StudentNextStepView } from "./student-next-step-view";
import { getHomeworkAttentionCount } from "./student-homework-content";
import { StudentHomeworkView } from "./student-homework-view";
import { getNotebookNavMeta } from "./student-notebook-content";
import { StudentNotebookView } from "./student-notebook-view";
import { StudentTrailView } from "./student-trail-view";
import home from "./student-home.module.css";
import styles from "./student-portal.module.css";
import {
  normalizePortalView,
  portalAnnouncements,
  portalStudent,
  type PortalAnnouncement,
  type PortalView,
} from "./student-portal-content";

const sideNavigation = [
  { id: "home" as const, label: "Início" },
  { id: "trail" as const, label: "Trilha" },
  { id: "explore" as const, label: "Biblioteca" },
  { id: "homework" as const, label: "Lição de casa" },
  { id: "notebook" as const, label: "Caderno" },
] as const;

const tabIcons = {
  home: House,
  trail: MapTrifold,
  explore: Books,
  homework: ClipboardText,
  notebook: Notebook,
} as const;

type StudentPortalProps = {
  initialSearchParams?: {
    view?: string;
    trail?: string;
    module?: string;
    homework?: string;
  };
};

export function StudentPortal({ initialSearchParams = {} }: StudentPortalProps) {
  const initialView = normalizePortalView(initialSearchParams.view ?? null);
  const [activeView, setActiveView] = useState<PortalView>(initialView);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [readAnnouncements, setReadAnnouncements] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [largerText, setLargerText] = useState(false);
  const [quietMotion, setQuietMotion] = useState(false);
  const [compactNav, setCompactNav] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [homeworkAssignmentId, setHomeworkAssignmentId] = useState<string | null>(
    initialView === "homework" ? (initialSearchParams.homework ?? null) : null,
  );
  const [libraryModuleId, setLibraryModuleId] = useState<string | null>(
    initialView === "explore" ? (initialSearchParams.module ?? null) : null,
  );
  const [trailId, setTrailId] = useState(() =>
    initialView === "trail"
      ? resolveTrailIdFromParam(initialSearchParams.trail ?? null)
      : getTrailIdForLibraryGroup(getActiveLibraryModuleId()) ?? "saindo-da-caverna",
  );
  const unreadCount = portalAnnouncements.length - readAnnouncements.size;
  const homeworkAttentionCount = getHomeworkAttentionCount();
  const notebookNavMeta = getNotebookNavMeta();

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const compact = window.matchMedia("(max-width: 1023px)");
    const apply = () => {
      setCompactNav(compact.matches);
    };
    apply();
    compact.addEventListener("change", apply);
    return () => {
      compact.removeEventListener("change", apply);
    };
  }, []);

  useEffect(() => {
    function applyViewFromUrl() {
      const params = new URLSearchParams(window.location.search);
      const rawView = params.get("view");
      const view = normalizePortalView(rawView);
      const homeworkId = params.get("homework");
      let moduleId = params.get("module");
      const trailParam = params.get("trail");

      if (rawView === "journey" && !moduleId) {
        moduleId = getActiveLibraryModuleId();
      }

      setActiveView(view);
      setLibraryModuleId(view === "explore" ? moduleId : null);

      if (view === "trail") {
        setTrailId(resolveTrailIdFromParam(trailParam));
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

  function openTrail(options?: { trailId?: string | null }) {
    setNotificationOpen(false);
    setActiveView("trail");
    setLibraryModuleId(null);
    const resolved =
      options?.trailId ??
      getTrailIdForLibraryGroup(getActiveLibraryModuleId()) ??
      "saindo-da-caverna";
    setTrailId(resolved);
    const url = new URL(window.location.href);
    url.searchParams.set("view", "trail");
    url.searchParams.set("trail", resolved);
    url.searchParams.delete("module");
    url.searchParams.delete("homework");
    setHomeworkAssignmentId(null);
    window.history.replaceState({}, "", `${url.pathname}${url.search}`);
    requestAnimationFrame(() => {
      document.querySelector<HTMLElement>("#conteudo")?.focus({ preventScroll: true });
    });
  }

  function openExplore(options?: { moduleId?: string | null }) {
    setNotificationOpen(false);
    setActiveView("explore");
    const moduleId = options?.moduleId ?? null;
    setLibraryModuleId(moduleId);
    const url = new URL(window.location.href);
    url.searchParams.set("view", "explore");
    if (moduleId) {
      url.searchParams.set("module", moduleId);
    } else {
      url.searchParams.delete("module");
    }
    url.searchParams.delete("homework");
    setHomeworkAssignmentId(null);
    window.history.replaceState({}, "", `${url.pathname}${url.search}`);
    requestAnimationFrame(() => {
      document.querySelector<HTMLElement>("#conteudo")?.focus({ preventScroll: true });
    });
  }

  function openView(view: PortalView, homeworkId?: string | null) {
    if (view === "explore") {
      openExplore({ moduleId: null });
      return;
    }
    if (view === "trail") {
      openTrail();
      return;
    }

    setNotificationOpen(false);
    setActiveView(view);
    setLibraryModuleId(null);
    const url = new URL(window.location.href);
    if (view === "homework" || view === "notebook") {
      url.searchParams.set("view", view);
    } else {
      url.searchParams.delete("view");
    }
    url.searchParams.delete("module");

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
                setLibraryModuleId(null);
                const url = new URL(window.location.href);
                url.searchParams.set("view", "explore");
                url.searchParams.delete("module");
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
          data-trail={activeView === "trail"}
          tabIndex={-1}
        >
          <div
            className={home.pagePane}
            data-home={activeView === "home"}
            data-trail={activeView === "trail"}
          >
            {activeView === "home" ? (
              <StudentNextStepView
                onOpenModuleMap={() => openTrail()}
                onOpenLibrary={() => openView("explore")}
              />
            ) : activeView === "trail" ? (
              <StudentTrailView
                trailId={trailId}
                onSwitchTrail={(nextTrailId) => openTrail({ trailId: nextTrailId })}
                onOpenLibrary={() => openView("explore")}
                onOpenNotebook={() => openView("notebook")}
              />
            ) : activeView === "explore" ? (
              <StudentLibraryView
                searchQuery={searchQuery}
                moduleId={libraryModuleId}
                onModuleChange={(moduleId) => openExplore({ moduleId })}
              />
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
        </main>
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
    <section className={`${styles.pageView} ${styles.settingsView}`}>
      <div className={styles.settingsStage}>
        <ViewHeading
          eyebrow="Sua sala · Philoo"
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
