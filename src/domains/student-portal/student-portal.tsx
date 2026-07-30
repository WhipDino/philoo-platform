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
} from "@phosphor-icons/react";
import { useState, type ReactNode } from "react";
import styles from "./student-portal.module.css";
import {
  explorationQuestions,
  portalAnnouncements,
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
  const [readAnnouncements, setReadAnnouncements] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [largerText, setLargerText] = useState(false);
  const [quietMotion, setQuietMotion] = useState(false);
  const unreadCount = portalAnnouncements.length - readAnnouncements.size;

  function openView(view: PortalView) {
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
              onClick={() => openView("announcements")}
              aria-label={`${unreadCount} avisos não lidos`}
            >
              <Bell size={21} weight="bold" />
              {unreadCount > 0 ? <span>{unreadCount}</span> : null}
            </button>
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
          <p className={styles.platoPrompt}>“Descobrimos uma pista. Quer seguir?”</p>
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
  return (
    <section className={styles.pageView}>
      <ViewHeading
        eyebrow="Meu caminho"
        title="Cada capítulo muda o que você consegue enxergar."
        description="Retome uma descoberta, veja o que vem depois e acompanhe a pergunta que conecta toda a jornada."
        icon={<Books size={26} weight="duotone" />}
      />
      <div className={styles.journeyHeader}>
        <div>
          <span>Jornada ativa</span>
          <h2>A Caverna de Platão</h2>
          <p>O que acontece quando confundimos uma parte do mundo com o mundo inteiro?</p>
        </div>
        <strong>1 de 3 capítulos iniciados</strong>
      </div>
      <div className={styles.lessonGrid}>
        {portalLessons.map((lesson, index) => (
          <article key={lesson.id} data-status={lesson.status}>
            <div className={styles.lessonImage}>
              <Image src={lesson.image} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" />
              <span>{lesson.chapter}</span>
            </div>
            <div>
              <p>{lesson.status === "in-progress" ? "Em andamento" : index === 1 ? "A seguir" : "Mais adiante"}</p>
              <h3>{lesson.title}</h3>
              <span>{lesson.question}</span>
              {lesson.href ? (
                <Link href={lesson.href}>
                  Continuar <CaretRight size={16} weight="bold" />
                </Link>
              ) : (
                <button type="button" disabled>Bloqueado por enquanto</button>
              )}
            </div>
          </article>
        ))}
      </div>
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
