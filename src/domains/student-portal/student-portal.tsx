"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  CaretRight,
  Check,
  Compass,
  Lightbulb,
  LockKey,
  Notebook,
  Play,
  UserCircle,
  X,
} from "@phosphor-icons/react";
import { useState, type ReactNode } from "react";
import home from "./student-home.module.css";
import styles from "./student-portal.module.css";
import {
  explorationQuestions,
  homeChapters,
  homeClassmates,
  homeCurrentLesson,
  homeTask,
  homeTeacherNote,
  homeTrail,
  homeTrailDays,
  portalAnnouncements,
  portalEra,
  portalEraLessons,
  portalHomework,
  portalIntro,
  portalLessons,
  portalStudent,
  type HomeChapter,
  type PortalAnnouncement,
  type PortalView,
} from "./student-portal-content";

const sideNavigation = [
  { id: "home" as const, label: "Início" },
  { id: "journey" as const, label: "Meu caminho" },
  { id: "explore" as const, label: "Biblioteca" },
  { id: "homework" as const, label: "Lição de casa" },
] as const;

const chapterStatusLabel = {
  lido: "Lido",
  aqui: "Você está aqui",
  seguir: "A seguir",
  bloqueado: "Bloqueado",
} as const;

export function StudentPortal() {
  const [activeView, setActiveView] = useState<PortalView>("home");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [readAnnouncements, setReadAnnouncements] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [largerText, setLargerText] = useState(false);
  const [quietMotion, setQuietMotion] = useState(false);
  const unreadCount = portalAnnouncements.length - readAnnouncements.size;

  function openView(view: PortalView) {
    setNotificationOpen(false);
    setActiveView(view);
    requestAnimationFrame(() => {
      document.querySelector<HTMLElement>("#conteudo")?.focus({ preventScroll: true });
    });
  }

  function markRead(id: string) {
    setReadAnnouncements((current) => new Set(current).add(id));
  }

  const visibleChapters = homeChapters.slice(1, 4);

  return (
    <div
      className={home.shell}
      data-large-text={largerText}
      data-quiet-motion={quietMotion}
    >
      <header className={home.topbar}>
        <Link className={home.brand} href="/inicio" aria-label="Philoo, início">
          Philoo
        </Link>
        <input
          className={home.search}
          type="search"
          placeholder="Buscar um filósofo, um módulo…"
          aria-label="Buscar um filósofo, um módulo"
        />
        <span className={home.spacer} aria-hidden="true" />
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
          {portalStudent.firstName}
        </button>
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
                {id === "homework" && portalHomework.assigned ? (
                  <b className={home.navCount}>1</b>
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

        <main id="conteudo" className={home.center} tabIndex={-1}>
          {activeView === "home" ? (
            <>
              <section className={home.stage} aria-labelledby="modulo-atual">
                <div className={home.stageCopy}>
                  <p className={home.eyebrow}>
                    Você parou em {homeCurrentLesson.word} · capítulo{" "}
                    {homeCurrentLesson.chapterIndex} de {homeCurrentLesson.chapterCount}
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
                      Continuar aula
                    </Link>
                    <button
                      className={home.ghost}
                      type="button"
                      onClick={() => openView("journey")}
                    >
                      Ver o caminho
                    </button>
                  </div>
                </div>
                <div className={home.art}>
                  <Image
                    src="/images/portal/plato-cave-active-lesson-v1.png"
                    alt="Platão na caverna, apontando para a aula"
                    fill
                    sizes="(max-width: 1023px) 100vw, 70vw"
                    quality={100}
                    unoptimized
                    priority
                  />
                </div>
              </section>

              <section className={home.strip} aria-labelledby="capitulos-titulo">
                <div className={home.stripHead}>
                  <h2 id="capitulos-titulo">Os capítulos desta história</h2>
                  <p>
                    {homeCurrentLesson.chapterCount} capítulos · {homeCurrentLesson.readCount}{" "}
                    lidos
                  </p>
                </div>
                <div className={home.cards}>
                  {visibleChapters.map((chapter) => (
                    <ChapterCard key={chapter.number} chapter={chapter} />
                  ))}
                  <button
                    className={home.tile}
                    type="button"
                    onClick={() => openView("journey")}
                  >
                    <span className={home.tileMark} aria-hidden="true">
                      ›
                    </span>
                    <strong>Ver os 9 capítulos</strong>
                    <span>Meu caminho</span>
                  </button>
                </div>
              </section>
            </>
          ) : (
            <div className={home.pagePane}>
              {activeView === "explore" ? (
                <ExploreView />
              ) : activeView === "journey" ? (
                <JourneyView />
              ) : activeView === "homework" ? (
                <HomeworkView />
              ) : activeView === "announcements" ? (
                <AnnouncementsView
                  readAnnouncements={readAnnouncements}
                  markRead={markRead}
                />
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

        <aside className={home.sala} aria-label="Sua sala">
          <div className={home.salaInner}>
            <div className={home.salaHead}>
              <h2 className={home.salaTitle}>Sua sala</h2>
            </div>
            <div className={home.teacher}>
              <span className={home.teacherFace} aria-hidden="true" />
              <div>
                <strong>{homeTeacherNote.name}</strong>
                <span>{homeTeacherNote.when}</span>
              </div>
            </div>
            <p className={home.bubble}>“{homeTeacherNote.quote}”</p>
            <div className={home.task}>
              <p>{homeTask.label}</p>
              <strong>{homeTask.title}</strong>
              <button type="button" onClick={() => openView("homework")}>
                {homeTask.cta}
              </button>
            </div>
            <div className={home.turma}>
              <div className={home.sectionLabel}>A turma nesta história</div>
              <div className={home.faces}>
                <span className={`${home.face} ${home.faceA}`} aria-hidden="true" />
                <span className={`${home.face} ${home.faceB}`} aria-hidden="true" />
                <span className={`${home.face} ${home.faceC}`} aria-hidden="true" />
                <span className={home.faceMore}>+{homeClassmates.extra}</span>
                <p className={home.turmaNote}>
                  12 colegas no
                  <br />
                  capítulo 7
                </p>
              </div>
            </div>
            <div className={home.rastro}>
              <div className={home.rastroHead}>
                <div className={home.sectionLabel}>Seu rastro</div>
                <span className={home.streak}>{homeTrail.streak}</span>
              </div>
              <div className={home.bars}>
                {homeTrailDays.map((day, index) => (
                  <div className={home.day} key={`${day.label}-${index}`}>
                    <span className={home.bar} data-on={day.active} />
                    <span>{day.label}</span>
                  </div>
                ))}
              </div>
              <div className={home.rastroFoot}>
                <p>
                  Hoje você descobriu <strong>dóxa</strong>.
                </p>
                <button type="button" onClick={() => openView("journey")}>
                  tudo →
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ChapterCard({ chapter }: { chapter: HomeChapter }) {
  const status = chapterStatusLabel[chapter.status];
  const inner = (
    <>
      <div className={home.cover}>
        <Image src={chapter.image} alt="" fill sizes="28vw" quality={90} />
        <span className={home.num}>{chapter.number}</span>
      </div>
      <span className={home.status}>{status}</span>
      <strong className={home.cardTitle}>{chapter.title}</strong>
    </>
  );

  if (chapter.status === "bloqueado" || !chapter.href) {
    return <article className={home.cardStatic}>{inner}</article>;
  }

  return (
    <Link
      className={home.card}
      href={chapter.href}
      aria-label={`Capítulo ${chapter.number}: ${chapter.title}`}
    >
      {inner}
    </Link>
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

function HomeworkView() {
  return (
    <section className={styles.pageView}>
      <ViewHeading
        eyebrow="Da professora"
        title="O que Marina pediu para você fazer."
        description="A lição de casa é o pedido da sala. Avisos são recados. Aqui fica só a tarefa."
        icon={<Notebook size={26} weight="duotone" />}
      />
      <article className={styles.homeworkCard}>
        <p>
          {portalHomework.teacher} · {portalHomework.due}
        </p>
        <h2>{portalHomework.title}</h2>
        <div>{portalHomework.body}</div>
        <Link className={styles.primaryAction} href={portalHomework.lessonHref}>
          <span className={styles.playButton}>
            <Play size={18} weight="fill" />
          </span>
          Abrir {portalHomework.lessonTitle}
          <CaretRight size={18} weight="bold" />
        </Link>
      </article>
    </section>
  );
}

function ExploreView() {
  return (
    <section className={styles.pageView}>
      <ViewHeading
        eyebrow="Biblioteca de ideias"
        title="Escolha por onde sua curiosidade quer começar."
        description="Você não precisa esperar uma atividade. Explore grandes perguntas e encontre jornadas construídas para pensar fazendo."
        icon={<Compass size={26} weight="duotone" />}
      />
      <QuestionCards />
      <div className={styles.exploreCallout}>
        <Image
          src="/images/story/plato-v2/plato-curious-interruption-v1.png"
          alt=""
          width={260}
          height={330}
        />
        <div>
          <span>Em breve</span>
          <h2>Mais mundos para investigar</h2>
          <p>
            Justiça, identidade, liberdade, tecnologia e convivência vão ganhar
            novas histórias interativas.
          </p>
        </div>
      </div>
    </section>
  );
}

function QuestionCards({ compact = false }: { compact?: boolean }) {
  return (
    <div className={styles.questionGrid} data-compact={compact ? "true" : "false"}>
      {explorationQuestions.map((question) => (
        <article key={question.id} data-accent={question.accent}>
          <span>{question.number}</span>
          <Lightbulb size={24} weight="duotone" />
          <h3>{question.title}</h3>
          <p>{question.description}</p>
          <button type="button" disabled={question.id !== "truth"}>
            {question.id === "truth" ? "Explorar esta pergunta" : "Em breve"}
            {question.id === "truth" ? <CaretRight size={16} weight="bold" /> : null}
          </button>
        </article>
      ))}
    </div>
  );
}

function JourneyView() {
  return (
    <div className={styles.notebook} data-path="true">
      <div className={styles.notebookCover}>
        <div className={styles.pathView}>
      <section className={styles.pathBlock} aria-labelledby="intro-path-title">
        <div className={styles.pathHeading}>
          <div>
            <p>{portalIntro.eyebrow}</p>
            <h1 id="intro-path-title">{portalIntro.title}</h1>
          </div>
          <span>{portalIntro.description}</span>
        </div>
        <div className={styles.pathShelf}>
          {portalLessons.map((lesson, index) => {
            const playable = Boolean(lesson.href) && lesson.status !== "upcoming";
            const Card = playable ? Link : "article";

            return (
              <Card
                className={styles.chapterCard}
                data-status={lesson.status}
                key={lesson.id}
                {...(playable ? { href: lesson.href } : {})}
                {...(playable
                  ? { "aria-label": `${lesson.chapter}: ${lesson.title}` }
                  : {})}
              >
                <div className={styles.chapterArtwork}>
                  <Image
                    src={lesson.image}
                    alt=""
                    fill
                    sizes="(max-width: 560px) 70vw, 28vw"
                  />
                  <span>{index + 1}</span>
                  {lesson.status === "in-progress" ? (
                    <strong>67% visto</strong>
                  ) : lesson.status === "next" ? (
                    <strong>A seguir</strong>
                  ) : (
                    <strong>
                      <LockKey size={13} weight="bold" /> Em breve
                    </strong>
                  )}
                </div>
                <div className={styles.chapterCardCopy}>
                  <span>{lesson.chapter}</span>
                  <h3>{lesson.title}</h3>
                  <p>{lesson.question}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section className={styles.pathBlock} aria-labelledby="era-path-title">
        <div className={styles.pathHeading}>
          <div>
            <p>{portalEra.number}</p>
            <h2 id="era-path-title">{portalEra.title}</h2>
          </div>
          <span>{portalEra.description}</span>
        </div>
        <div className={styles.pathShelf}>
          {portalEraLessons.map((lesson, index) => (
            <article
              className={styles.thinkerCard}
              data-status={lesson.status}
              key={lesson.id}
            >
              <b>{String(index + 1).padStart(2, "0")}</b>
              <h3>{lesson.title}</h3>
              <p>{lesson.question}</p>
              <strong>
                <LockKey size={13} weight="bold" /> Abre depois da introdução
              </strong>
            </article>
          ))}
        </div>
      </section>
        </div>
      </div>
    </div>
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
    <article data-read={read}>
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
            <h2>{portalStudent.fullName}</h2>
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
