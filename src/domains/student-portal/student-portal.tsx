"use client";

import {
  ArrowRight,
  Bell,
  BookOpenText,
  BookmarkSimple,
  CalendarDots,
  CheckCircle,
  Clock,
  Compass,
  GearSix,
  GraduationCap,
  House,
  LockKey,
  Megaphone,
  Notebook,
  Play,
  Sparkle,
  UserCircle,
  UsersThree,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  classroomMoments,
  portalAnnouncements,
  portalLessons,
  portalStudent,
  type PortalAnnouncement,
  type PortalLesson,
  type PortalView,
} from "./student-portal-content";
import styles from "./student-portal.module.css";

const navigation = [
  { id: "today", label: "Hoje", icon: House },
  { id: "lessons", label: "Aulas", icon: BookOpenText },
  { id: "classroom", label: "Turma", icon: UsersThree },
  { id: "announcements", label: "Avisos", icon: Bell },
  { id: "profile", label: "Perfil", icon: UserCircle },
] as const satisfies ReadonlyArray<{
  id: PortalView;
  label: string;
  icon: typeof House;
}>;

const statusCopy = {
  "in-progress": "Em andamento",
  next: "Próxima jornada",
  upcoming: "Mais adiante",
} as const;

export function StudentPortal() {
  const [activeView, setActiveView] = useState<PortalView>("today");
  const [readAnnouncements, setReadAnnouncements] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [largerText, setLargerText] = useState(false);
  const [quietMotion, setQuietMotion] = useState(false);
  const unreadCount = portalAnnouncements.length - readAnnouncements.size;

  function openView(view: PortalView) {
    setActiveView(view);
    requestAnimationFrame(() => {
      document.getElementById("portal-panel")?.focus();
    });
  }

  function markAnnouncementRead(id: string) {
    setReadAnnouncements((current) => {
      const next = new Set(current);
      next.add(id);
      return next;
    });
  }

  return (
    <div
      className={styles.portalPage}
      data-large-text={largerText}
      data-quiet-motion={quietMotion}
    >
      <header className={styles.portalHeader}>
        <Link className={styles.brand} href="/inicio" aria-label="Philoo, início">
          Philoo
        </Link>

        <div className={styles.headerContext}>
          <span>Espaço do estudante</span>
          <strong>{portalStudent.classroom}</strong>
        </div>

        <div className={styles.headerActions}>
          <button
            className={styles.headerButton}
            type="button"
            onClick={() => openView("announcements")}
            aria-label={`${unreadCount} avisos não lidos`}
          >
            <Bell size={21} weight="bold" aria-hidden="true" />
            {unreadCount > 0 ? (
              <span className={styles.notificationBadge}>{unreadCount}</span>
            ) : null}
          </button>
          <button
            className={styles.profileButton}
            type="button"
            onClick={() => openView("profile")}
            aria-label={`Abrir perfil de ${portalStudent.fullName}`}
          >
            <span>{portalStudent.initials}</span>
            <span className={styles.profileCopy}>
              <strong>{portalStudent.firstName}</strong>
              <small>Meu perfil</small>
            </span>
          </button>
        </div>
      </header>

      <main id="conteudo" className={styles.portalWorkspace}>
        <div className={styles.notebookUnderlay} aria-hidden="true" />
        <section className={styles.notebook} aria-label="Espaço do estudante">
          <div
            id="portal-panel"
            className={styles.paper}
            role="tabpanel"
            aria-labelledby={`portal-tab-${activeView}`}
            tabIndex={-1}
          >
            <PortalViewContent
              activeView={activeView}
              openView={openView}
              readAnnouncements={readAnnouncements}
              markAnnouncementRead={markAnnouncementRead}
              largerText={largerText}
              quietMotion={quietMotion}
              setLargerText={setLargerText}
              setQuietMotion={setQuietMotion}
            />
          </div>

          <nav className={styles.portalTabs} aria-label="Navegação do estudante">
            <div className={styles.tabList} role="tablist" aria-orientation="vertical">
              {navigation.map(({ id, label, icon: Icon }) => {
                const isActive = activeView === id;
                const showsBadge = id === "announcements" && unreadCount > 0;

                return (
                  <button
                    key={id}
                    id={`portal-tab-${id}`}
                    className={styles.portalTab}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="portal-panel"
                    data-active={isActive}
                    onClick={() => openView(id)}
                  >
                    <Icon size={22} weight={isActive ? "fill" : "bold"} aria-hidden="true" />
                    <span>{label}</span>
                    {showsBadge ? (
                      <span className={styles.tabBadge} aria-label={`${unreadCount} novos`}>
                        {unreadCount}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
            <p className={styles.tabsNote}>
              <Sparkle size={16} weight="fill" aria-hidden="true" />
              Seu espaço para descobrir
            </p>
          </nav>
        </section>
      </main>
    </div>
  );
}

type PortalViewContentProps = {
  activeView: PortalView;
  openView: (view: PortalView) => void;
  readAnnouncements: ReadonlySet<string>;
  markAnnouncementRead: (id: string) => void;
  largerText: boolean;
  quietMotion: boolean;
  setLargerText: (value: boolean) => void;
  setQuietMotion: (value: boolean) => void;
};

function PortalViewContent({
  activeView,
  openView,
  readAnnouncements,
  markAnnouncementRead,
  largerText,
  quietMotion,
  setLargerText,
  setQuietMotion,
}: PortalViewContentProps) {
  if (activeView === "lessons") {
    return <LessonsView />;
  }

  if (activeView === "classroom") {
    return <ClassroomView openView={openView} />;
  }

  if (activeView === "announcements") {
    return (
      <AnnouncementsView
        readAnnouncements={readAnnouncements}
        markAnnouncementRead={markAnnouncementRead}
      />
    );
  }

  if (activeView === "profile") {
    return (
      <ProfileView
        largerText={largerText}
        quietMotion={quietMotion}
        setLargerText={setLargerText}
        setQuietMotion={setQuietMotion}
      />
    );
  }

  return (
    <TodayView
      openView={openView}
      readAnnouncements={readAnnouncements}
      markAnnouncementRead={markAnnouncementRead}
    />
  );
}

type TodayViewProps = {
  openView: (view: PortalView) => void;
  readAnnouncements: ReadonlySet<string>;
  markAnnouncementRead: (id: string) => void;
};

function TodayView({
  openView,
  readAnnouncements,
  markAnnouncementRead,
}: TodayViewProps) {
  const currentLesson = portalLessons[0];
  const latestAnnouncement = portalAnnouncements[0];

  return (
    <div className={styles.view} data-view="today">
      <div className={styles.viewHeading}>
        <div>
          <p className={styles.eyebrow}>Seu espaço de aprendizagem</p>
          <h1>Olá, {portalStudent.firstName}. O que vamos descobrir hoje?</h1>
        </div>
        <div className={styles.dayNote}>
          <CalendarDots size={22} weight="duotone" aria-hidden="true" />
          <span>
            <strong>Quinta-feira</strong>
            30 de julho
          </span>
        </div>
      </div>

      <section className={styles.continueCard} aria-labelledby="continue-title">
        <div className={styles.continueCopy}>
          <p className={styles.lessonKicker}>{currentLesson.chapter}</p>
          <h2 id="continue-title">Continue de onde sua curiosidade parou.</h2>
          <p className={styles.continueQuestion}>{currentLesson.question}</p>

          <div className={styles.lessonProgress}>
            <div className={styles.progressCopy}>
              <span>Seu caminho nesta história</span>
              <strong>{currentLesson.progress}%</strong>
            </div>
            <div
              className={styles.progressTrack}
              role="progressbar"
              aria-label="Progresso em As Sombras"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={currentLesson.progress}
            >
              <span style={{ width: `${currentLesson.progress}%` }} />
            </div>
            <p>
              <BookmarkSimple size={17} weight="fill" aria-hidden="true" />
              Última descoberta: uma palavra da filosofia — dóxa
            </p>
          </div>

          <Link className={styles.primaryAction} href={currentLesson.href ?? "#"}>
            <span className={styles.actionIcon}>
              <Play size={18} weight="fill" aria-hidden="true" />
            </span>
            Continuar As Sombras
            <ArrowRight size={20} weight="bold" aria-hidden="true" />
          </Link>
        </div>

        <div className={styles.continueVisual} aria-hidden="true">
          <Image
            className={styles.caveImage}
            src={currentLesson.image}
            alt=""
            fill
            preload
            sizes="(max-width: 820px) 100vw, 44vw"
          />
          <div className={styles.visualShade} />
          <div className={styles.platoPortal}>
            <Image
              src="/images/story/plato-v2/plato-invite-turn-v1.png"
              alt=""
              fill
              sizes="(max-width: 820px) 190px, 280px"
            />
          </div>
          <p className={styles.platoNudge}>“Vamos olhar um pouco além?”</p>
        </div>
      </section>

      <div className={styles.todayGrid}>
        <section className={styles.paperCard} aria-labelledby="lessons-preview-title">
          <div className={styles.cardHeading}>
            <div>
              <p className={styles.eyebrow}>Suas aulas</p>
              <h2 id="lessons-preview-title">A jornada da Caverna</h2>
            </div>
            <button
              className={styles.textAction}
              type="button"
              onClick={() => openView("lessons")}
            >
              Ver todas <ArrowRight size={17} weight="bold" aria-hidden="true" />
            </button>
          </div>
          <div className={styles.chapterStrip}>
            {portalLessons.map((lesson, index) => (
              <article
                key={lesson.id}
                className={styles.chapterItem}
                data-current={lesson.status === "in-progress"}
              >
                <span className={styles.chapterNumber}>0{index + 1}</span>
                <span>
                  <small>{statusCopy[lesson.status]}</small>
                  <strong>{lesson.title}</strong>
                </span>
                {lesson.status === "in-progress" ? (
                  <CheckCircle size={22} weight="fill" aria-label="Em andamento" />
                ) : (
                  <Clock size={21} weight="duotone" aria-label="Ainda não iniciada" />
                )}
              </article>
            ))}
          </div>
        </section>

        <section className={styles.announcementCard} aria-labelledby="latest-note-title">
          <div className={styles.announcementPin} aria-hidden="true" />
          <div className={styles.announcementMeta}>
            <span>
              <Megaphone size={18} weight="fill" aria-hidden="true" />
              Recado da professora
            </span>
            <small>{latestAnnouncement.date}</small>
          </div>
          <h2 id="latest-note-title">{latestAnnouncement.title}</h2>
          <p>{latestAnnouncement.body}</p>
          <div className={styles.announcementFooter}>
            <span>{portalStudent.teacher}</span>
            {readAnnouncements.has(latestAnnouncement.id) ? (
              <span className={styles.readState}>
                <CheckCircle size={17} weight="fill" aria-hidden="true" />
                Lido
              </span>
            ) : (
              <button
                className={styles.textAction}
                type="button"
                onClick={() => markAnnouncementRead(latestAnnouncement.id)}
              >
                Marcar como lido
              </button>
            )}
          </div>
        </section>

        <section className={styles.classCard} aria-labelledby="class-preview-title">
          <div className={styles.classIcon}>
            <UsersThree size={28} weight="duotone" aria-hidden="true" />
          </div>
          <div>
            <p className={styles.eyebrow}>Minha turma</p>
            <h2 id="class-preview-title">{portalStudent.classroom}</h2>
            <p>{portalStudent.school}</p>
          </div>
          <button
            className={styles.roundAction}
            type="button"
            onClick={() => openView("classroom")}
            aria-label="Abrir informações da turma"
          >
            <ArrowRight size={20} weight="bold" aria-hidden="true" />
          </button>
        </section>

        <aside className={styles.savedQuestion}>
          <div className={styles.savedIcon}>
            <Compass size={25} weight="duotone" aria-hidden="true" />
          </div>
          <div>
            <p className={styles.eyebrow}>Pergunta guardada</p>
            <blockquote>
              O que faria você desconfiar de uma explicação que sempre pareceu
              suficiente?
            </blockquote>
          </div>
        </aside>
      </div>
    </div>
  );
}

function LessonsView() {
  return (
    <div className={styles.view} data-view="lessons">
      <ViewIntro
        eyebrow="Biblioteca de jornadas"
        title="Suas aulas têm histórias para atravessar."
        description="Aqui ficam as investigações escolhidas pela sua professora. Você pode retomar uma ideia, rever uma pista e perceber como seu pensamento mudou."
        icon={<BookOpenText size={30} weight="duotone" aria-hidden="true" />}
      />

      <div className={styles.lessonLibrary}>
        {portalLessons.map((lesson, index) => (
          <LessonCard key={lesson.id} lesson={lesson} index={index} />
        ))}
      </div>

      <aside className={styles.libraryNote}>
        <Notebook size={27} weight="duotone" aria-hidden="true" />
        <div>
          <strong>Seu caderno acompanha você.</strong>
          <p>
            Voltar a uma etapa não apaga o que você pensou antes. Revisar uma ideia
            também é aprender.
          </p>
        </div>
      </aside>
    </div>
  );
}

function LessonCard({ lesson, index }: { lesson: PortalLesson; index: number }) {
  const isAvailable = Boolean(lesson.href);

  return (
    <article className={styles.lessonCard} data-status={lesson.status}>
      <div className={styles.lessonCardImage}>
        <Image
          src={lesson.image}
          alt=""
          fill
          sizes="(max-width: 760px) 100vw, 33vw"
        />
        <span>Capítulo 0{index + 1}</span>
      </div>
      <div className={styles.lessonCardCopy}>
        <p className={styles.lessonKicker}>{statusCopy[lesson.status]}</p>
        <h2>{lesson.title}</h2>
        <p>{lesson.question}</p>
        {isAvailable ? (
          <>
            <div className={styles.compactProgress}>
              <span style={{ width: `${lesson.progress}%` }} />
            </div>
            <Link className={styles.lessonAction} href={lesson.href ?? "#"}>
              Continuar jornada
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </Link>
          </>
        ) : (
          <p className={styles.comingSoon}>
            <Sparkle size={18} weight="fill" aria-hidden="true" />
            Esta parte da história chega depois de As Sombras.
          </p>
        )}
      </div>
    </article>
  );
}

function ClassroomView({ openView }: { openView: (view: PortalView) => void }) {
  return (
    <div className={styles.view} data-view="classroom">
      <ViewIntro
        eyebrow="Minha turma"
        title={`${portalStudent.classroom} também é um lugar de ideias.`}
        description="Encontre os próximos encontros, os recados da sua professora e os momentos em que a turma vai pensar junto."
        icon={<UsersThree size={30} weight="duotone" aria-hidden="true" />}
      />

      <div className={styles.classroomGrid}>
        <section className={styles.classOverview}>
          <div className={styles.classStamp}>
            <GraduationCap size={38} weight="duotone" aria-hidden="true" />
          </div>
          <p className={styles.eyebrow}>{portalStudent.school}</p>
          <h2>{portalStudent.classroom}</h2>
          <p>Filosofia e Humanidades · 2026</p>
          <dl>
            <div>
              <dt>Professora</dt>
              <dd>{portalStudent.teacher}</dd>
            </div>
            <div>
              <dt>Encontro semanal</dt>
              <dd>Sexta-feira · 10:30</dd>
            </div>
          </dl>
        </section>

        <section className={styles.scheduleCard} aria-labelledby="schedule-title">
          <div className={styles.cardHeading}>
            <div>
              <p className={styles.eyebrow}>Próximos momentos</p>
              <h2 id="schedule-title">Na agenda da turma</h2>
            </div>
            <CalendarDots size={27} weight="duotone" aria-hidden="true" />
          </div>
          <ol>
            {classroomMoments.map((moment) => (
              <li key={`${moment.day}-${moment.date}`}>
                <time>
                  <span>{moment.day}</span>
                  <strong>{moment.date}</strong>
                </time>
                <span>
                  <strong>{moment.title}</strong>
                  <small>{moment.detail}</small>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.conversationCard}>
          <Megaphone size={29} weight="duotone" aria-hidden="true" />
          <div>
            <p className={styles.eyebrow}>Antes do próximo encontro</p>
            <h2>Há um recado novo da sua professora.</h2>
            <p>
              Ela deixou uma pergunta para você levar à próxima roda de conversa.
            </p>
          </div>
          <button
            className={styles.secondaryAction}
            type="button"
            onClick={() => openView("announcements")}
          >
            Abrir avisos
            <ArrowRight size={18} weight="bold" aria-hidden="true" />
          </button>
        </section>
      </div>
    </div>
  );
}

type AnnouncementsViewProps = {
  readAnnouncements: ReadonlySet<string>;
  markAnnouncementRead: (id: string) => void;
};

function AnnouncementsView({
  readAnnouncements,
  markAnnouncementRead,
}: AnnouncementsViewProps) {
  const unreadCount = portalAnnouncements.length - readAnnouncements.size;

  return (
    <div className={styles.view} data-view="announcements">
      <ViewIntro
        eyebrow="Mural da turma"
        title="Avisos que ajudam você a se preparar."
        description="Recados de professores e da escola aparecem aqui, sem se misturar com suas reflexões privadas."
        icon={<Bell size={30} weight="duotone" aria-hidden="true" />}
      />

      <div className={styles.noticeSummary} aria-live="polite">
        <Megaphone size={22} weight="fill" aria-hidden="true" />
        <span>
          {unreadCount === 0
            ? "Você leu todos os avisos."
            : `${unreadCount} ${unreadCount === 1 ? "aviso novo" : "avisos novos"} para você.`}
        </span>
      </div>

      <div className={styles.announcementList}>
        {portalAnnouncements.map((announcement) => (
          <AnnouncementItem
            key={announcement.id}
            announcement={announcement}
            isRead={readAnnouncements.has(announcement.id)}
            markRead={markAnnouncementRead}
          />
        ))}
      </div>
    </div>
  );
}

type AnnouncementItemProps = {
  announcement: PortalAnnouncement;
  isRead: boolean;
  markRead: (id: string) => void;
};

function AnnouncementItem({
  announcement,
  isRead,
  markRead,
}: AnnouncementItemProps) {
  return (
    <article className={styles.noticeItem} data-read={isRead}>
      <div className={styles.noticeAvatar} aria-hidden="true">
        {announcement.author
          .split(" ")
          .slice(0, 2)
          .map((part) => part[0])
          .join("")}
      </div>
      <div className={styles.noticeCopy}>
        <div className={styles.noticeMeta}>
          <span>{announcement.tag}</span>
          <time>{announcement.date}</time>
        </div>
        <h2>{announcement.title}</h2>
        <p>{announcement.body}</p>
        <small>
          {announcement.author} · {announcement.role}
        </small>
      </div>
      {isRead ? (
        <span className={styles.noticeRead}>
          <CheckCircle size={19} weight="fill" aria-hidden="true" />
          Lido
        </span>
      ) : (
        <button
          className={styles.noticeAction}
          type="button"
          onClick={() => markRead(announcement.id)}
        >
          Marcar como lido
        </button>
      )}
    </article>
  );
}

type ProfileViewProps = {
  largerText: boolean;
  quietMotion: boolean;
  setLargerText: (value: boolean) => void;
  setQuietMotion: (value: boolean) => void;
};

function ProfileView({
  largerText,
  quietMotion,
  setLargerText,
  setQuietMotion,
}: ProfileViewProps) {
  return (
    <div className={styles.view} data-view="profile">
      <ViewIntro
        eyebrow="Meu perfil"
        title="Seu espaço, do seu jeito."
        description="Confira seus dados e escolha como o Philoo deve se apresentar para você. Estas preferências serão ligadas à conta quando o acesso estiver pronto."
        icon={<UserCircle size={30} weight="duotone" aria-hidden="true" />}
      />

      <div className={styles.profileGrid}>
        <section className={styles.identityCard}>
          <div className={styles.largeAvatar}>{portalStudent.initials}</div>
          <div>
            <p className={styles.eyebrow}>Estudante</p>
            <h2>{portalStudent.fullName}</h2>
            <p>{portalStudent.email}</p>
          </div>
          <dl>
            <div>
              <dt>Turma</dt>
              <dd>{portalStudent.classroom}</dd>
            </div>
            <div>
              <dt>Escola</dt>
              <dd>{portalStudent.school}</dd>
            </div>
          </dl>
        </section>

        <section className={styles.preferencesCard} aria-labelledby="preferences-title">
          <div className={styles.cardHeading}>
            <div>
              <p className={styles.eyebrow}>Acessibilidade</p>
              <h2 id="preferences-title">Como você prefere ler?</h2>
            </div>
            <GearSix size={27} weight="duotone" aria-hidden="true" />
          </div>
          <PreferenceToggle
            icon={<BookOpenText size={24} weight="duotone" aria-hidden="true" />}
            title="Texto um pouco maior"
            description="Aumenta o tamanho dos textos deste portal."
            checked={largerText}
            onChange={setLargerText}
          />
          <PreferenceToggle
            icon={<Sparkle size={24} weight="duotone" aria-hidden="true" />}
            title="Movimentos mais tranquilos"
            description="Reduz animações e transições decorativas."
            checked={quietMotion}
            onChange={setQuietMotion}
          />
        </section>

        <aside className={styles.privacyNote}>
          <LockKey size={28} weight="duotone" aria-hidden="true" />
          <div>
            <h2>Suas reflexões continuam suas.</h2>
            <p>
              O portal vai indicar claramente quando uma atividade é privada e
              quando uma resposta será compartilhada com a professora.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

type PreferenceToggleProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function PreferenceToggle({
  icon,
  title,
  description,
  checked,
  onChange,
}: PreferenceToggleProps) {
  return (
    <label className={styles.preferenceToggle}>
      <span className={styles.preferenceIcon}>{icon}</span>
      <span className={styles.preferenceCopy}>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className={styles.switch} aria-hidden="true">
        <span />
      </span>
    </label>
  );
}

type ViewIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

function ViewIntro({ eyebrow, title, description, icon }: ViewIntroProps) {
  return (
    <header className={styles.sectionIntro}>
      <div className={styles.sectionIcon}>{icon}</div>
      <div>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </header>
  );
}
