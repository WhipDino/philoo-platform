"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  BookOpen,
  Books,
  CaretRight,
  Check,
  Compass,
  House,
  Lightbulb,
  LockKey,
  Play,
  UserCircle,
  X,
} from "@phosphor-icons/react";
import { useState, type ReactNode } from "react";
import styles from "./student-portal.module.css";
import {
  explorationQuestions,
  portalAnnouncements,
  portalEra,
  portalJourneys,
  portalLessons,
  portalStudent,
  type PortalAnnouncement,
  type PortalView,
} from "./student-portal-content";

const navigation = [
  { id: "home" as const, label: "Início", icon: House },
  { id: "explore" as const, label: "Explorar", icon: Compass },
  { id: "journey" as const, label: "Meu caminho", icon: Books },
] as const;

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
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  }

  function markRead(id: string) {
    setReadAnnouncements((current) => new Set(current).add(id));
  }

  return (
    <div
      className={styles.portalPage}
      data-large-text={largerText}
      data-quiet-motion={quietMotion}
    >
      <header className={styles.platformHeader}>
        <div className={styles.headerInner}>
          <Link className={styles.brand} href="/inicio" aria-label="Philoo, início">
            Philoo
          </Link>

          <nav className={styles.primaryNav} aria-label="Navegação principal">
            {navigation.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                aria-current={activeView === id ? "page" : undefined}
                onClick={() => openView(id)}
              >
                <Icon size={19} weight={activeView === id ? "fill" : "bold"} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className={styles.headerActions}>
            <button
              className={styles.iconButton}
              type="button"
              onClick={() => setNotificationOpen((current) => !current)}
              aria-label={`${unreadCount} avisos não lidos`}
              aria-expanded={notificationOpen}
              aria-controls="notification-preview"
            >
              <Bell size={21} weight="bold" />
              {unreadCount > 0 ? <span>{unreadCount}</span> : null}
            </button>
            {notificationOpen ? (
              <NotificationPreview
                unreadCount={unreadCount}
                close={() => setNotificationOpen(false)}
                showAll={() => openView("announcements")}
              />
            ) : null}
            <button
              className={styles.profileButton}
              type="button"
              onClick={() => openView("profile")}
              aria-label={`Abrir perfil de ${portalStudent.fullName}`}
            >
              <span>{portalStudent.initials}</span>
              <span>
                <strong>{portalStudent.firstName}</strong>
                <small>{portalStudent.classroom}</small>
              </span>
            </button>
          </div>
        </div>
      </header>

      <main
        id="conteudo"
        className={styles.platformMain}
        tabIndex={-1}
      >
        {activeView === "home" ? (
          <HomeView openView={openView} />
        ) : activeView === "explore" ? (
          <ExploreView />
        ) : activeView === "journey" ? (
          <JourneyView />
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
      </main>

      <nav className={styles.mobileNav} aria-label="Navegação principal no celular">
        {navigation.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            aria-current={activeView === id ? "page" : undefined}
            onClick={() => openView(id)}
          >
            <Icon size={21} weight={activeView === id ? "fill" : "bold"} />
            <span>{label}</span>
          </button>
        ))}
        <button
          type="button"
          aria-current={activeView === "announcements" ? "page" : undefined}
          onClick={() => openView("announcements")}
        >
          <Bell size={21} weight={activeView === "announcements" ? "fill" : "bold"} />
          <span>Avisos</span>
          {unreadCount > 0 ? <b>{unreadCount}</b> : null}
        </button>
      </nav>
    </div>
  );
}

function HomeView({ openView }: { openView: (view: PortalView) => void }) {
  const currentLesson = portalLessons[0];

  return (
    <div className={styles.homeView}>
      <div className={styles.welcome}>
        <div>
          <p>Olá, {portalStudent.firstName}</p>
          <h1>Seu próximo passo já está aberto.</h1>
        </div>
        <button type="button" onClick={() => openView("explore")}>
          <Compass size={18} weight="bold" />
          Explorar filosofia
        </button>
      </div>

      <section className={styles.learningStage} aria-labelledby="active-lesson-title">
        <div className={styles.stageVisual}>
          <Image
            src={currentLesson.image}
            alt=""
            fill
            priority
            sizes="(max-width: 820px) 100vw, 52vw"
          />
          <div className={styles.stageShade} />
          <Image
            className={styles.stagePlato}
            src="/images/story/plato-v2/plato-invite-turn-v1.png"
            alt="Platão convida você a voltar para a investigação"
            width={560}
            height={760}
            priority
          />
          <span className={styles.activeBadge}>
            <Play size={15} weight="fill" /> Aula em andamento
          </span>
        </div>

        <div className={styles.lessonPanel}>
          <div className={styles.courseIdentity}>
            <span>A Caverna de Platão</span>
            <strong>Jornada 1 de 3</strong>
          </div>
          <p className={styles.lessonEyebrow}>Sua aula agora</p>
          <h2 id="active-lesson-title">{currentLesson.title}</h2>
          <p className={styles.lessonQuestion}>{currentLesson.question}</p>

          <div className={styles.resumePoint}>
            <BookOpen size={20} weight="duotone" />
            <span>
              Você parou em
              <strong>Uma palavra da filosofia: dóxa</strong>
            </span>
          </div>

          <div className={styles.progressBlock}>
            <div>
              <span>6 de 9 descobertas</span>
              <strong>{currentLesson.progress}%</strong>
            </div>
            <progress
              value={currentLesson.progress}
              max="100"
              aria-label={`Progresso em ${currentLesson.title}`}
              aria-valuenow={currentLesson.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>

          <Link className={styles.primaryAction} href={currentLesson.href!}>
            <span className={styles.playButton}>
              <Play size={22} weight="fill" />
            </span>
            Continuar aula
            <CaretRight size={20} weight="bold" />
          </Link>
          <small>Aproximadamente 8 minutos para concluir este capítulo</small>
        </div>
      </section>

      <div className={styles.homeGrid}>
        <section className={styles.pathPreview} aria-labelledby="path-title">
          <div className={styles.sectionHeading}>
            <div>
              <p>Seu caminho</p>
              <h2 id="path-title">A Caverna de Platão</h2>
            </div>
            <button type="button" onClick={() => openView("journey")}>
              Ver jornada <CaretRight size={16} weight="bold" />
            </button>
          </div>
          <ol className={styles.chapterTrack}>
            {portalLessons.map((lesson, index) => (
              <li key={lesson.id} data-status={lesson.status}>
                <span>{lesson.status === "in-progress" ? <Play weight="fill" /> : index + 1}</span>
                <div>
                  <small>{lesson.chapter}</small>
                  <strong>{lesson.title}</strong>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.teacherTask} aria-labelledby="teacher-task-title">
          <span className={styles.teacherAvatar}>MA</span>
          <div>
            <p>Da sua professora</p>
            <h2 id="teacher-task-title">Uma pergunta depois da aula</h2>
            <span>
              Pense em uma primeira impressão que parecia explicar tudo.
            </span>
          </div>
          <button type="button" onClick={() => openView("announcements")}>
            Abrir <CaretRight size={16} weight="bold" />
          </button>
        </section>
      </div>

      <section className={styles.explorePreview} aria-labelledby="explore-title">
        <div className={styles.sectionHeading}>
          <div>
            <p>Escolha uma pergunta</p>
            <h2 id="explore-title">O que desperta sua curiosidade?</h2>
          </div>
          <button type="button" onClick={() => openView("explore")}>
            Ver tudo <CaretRight size={16} weight="bold" />
          </button>
        </div>
        <QuestionCards />
      </section>
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
          <strong>{unreadCount} {unreadCount === 1 ? "novo" : "novos"}</strong>
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
              <span>{announcement.author} · {announcement.date}</span>
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

function QuestionCards() {
  return (
    <div className={styles.questionGrid}>
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
  const nextJourneys = portalJourneys.slice(1);

  return (
    <section className={styles.pageView}>
      <section className={styles.pathHero} aria-labelledby="path-heading">
        <div className={styles.pathHeroCopy}>
          <span>
            <Books size={20} weight="duotone" /> Meu caminho
          </span>
          <h1 id="path-heading">Uma história de perguntas que atravessa os séculos.</h1>
          <p>
            Siga uma história de cada vez. Cada jornada abre novas perguntas,
            personagens e maneiras de enxergar o mundo.
          </p>
        </div>
        <div className={styles.pathHeroArt}>
          <Image
            src="/images/portal/plato-learning-journey-hero-v1.png"
            alt="Platão convida você a seguir um caminho feito de páginas e descobertas"
            fill
            priority
            sizes="(max-width: 820px) 100vw, 48vw"
          />
        </div>
      </section>

      <div className={styles.eraHeader}>
        <div>
          <span>{portalEra.number}</span>
          <h2>{portalEra.title}</h2>
          <p>{portalEra.description}</p>
        </div>
        <strong>4 jornadas · 15 capítulos</strong>
      </div>

      <section className={styles.streamingSection} aria-labelledby="continue-path-heading">
        <div className={styles.shelfHeading}>
          <div>
            <span>Jornada 1 · A Caverna de Platão</span>
            <h2 id="continue-path-heading">Continue sua história</h2>
          </div>
          <p>1 de 3 capítulos em andamento</p>
        </div>
        <div className={styles.chapterShelf}>
          {portalLessons.map((lesson, index) => (
            <article
              className={styles.chapterCard}
              data-status={lesson.status}
              key={lesson.id}
            >
              <div className={styles.chapterArtwork}>
                <Image
                  src={lesson.image}
                  alt=""
                  fill
                  sizes="(max-width: 560px) 78vw, (max-width: 1050px) 45vw, 30vw"
                />
                <span>{index + 1}</span>
                {lesson.status === "in-progress" ? (
                  <strong>67% concluído</strong>
                ) : lesson.status === "next" ? (
                  <strong>A seguir</strong>
                ) : (
                  <strong>
                    <LockKey size={13} weight="bold" /> Em breve
                  </strong>
                )}
                <i aria-hidden="true">
                  {lesson.status === "in-progress" ? (
                    <Play size={22} weight="fill" />
                  ) : (
                    <LockKey size={20} weight="bold" />
                  )}
                </i>
              </div>
              <div className={styles.chapterCardCopy}>
                <span>{lesson.chapter}</span>
                <h3>{lesson.title}</h3>
                <p>{lesson.question}</p>
                {lesson.status === "in-progress" ? (
                  <>
                    <div
                      className={styles.cardProgress}
                      role="progressbar"
                      aria-label={`Progresso em ${lesson.title}`}
                      aria-valuenow={lesson.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <i style={{ width: `${lesson.progress}%` }} />
                    </div>
                    <Link href={lesson.href ?? "/aula/as-sombras/primeira-tela"}>
                      Continuar capítulo <CaretRight size={16} weight="bold" />
                    </Link>
                  </>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.streamingSection} aria-labelledby="next-journeys-heading">
        <div className={styles.shelfHeading}>
          <div>
            <span>Depois da caverna</span>
            <h2 id="next-journeys-heading">Próximas jornadas</h2>
          </div>
          <p>Novas histórias abrem conforme você avança</p>
        </div>
        <div className={styles.journeyShelf}>
          {nextJourneys.map((journey) => (
            <article className={styles.journeyCoverCard} key={journey.id}>
              <Image
                src={journey.cover}
                alt=""
                fill
                sizes="(max-width: 560px) 82vw, (max-width: 1050px) 46vw, 31vw"
              />
              <div>
                <span>Jornada {journey.order}</span>
                <h3>{journey.title}</h3>
                <p>{journey.question}</p>
                <strong>
                  <LockKey size={13} weight="bold" />
                  {journey.chapters.length} capítulos
                </strong>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
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
        eyebrow="Avisos e atividades"
        title={unread ? `${unread} ${unread === 1 ? "novidade" : "novidades"} para você.` : "Tudo lido por aqui."}
        description="Pedidos da professora e recados da escola ficam reunidos aqui, sem interromper sua exploração."
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
