import Image from "next/image";
import Link from "next/link";
import styles from "./cave-invitation-scene.module.css";

export function CaveInvitationScene() {
  return (
    <main id="conteudo" className={styles.page}>
      <header className={styles.topbar}>
        <Link className={styles.exit} href="/inicio">
          <span aria-hidden="true">←</span>
          <span>Sair</span>
        </Link>

        <div className={styles.lessonName}>
          <strong>Philoo</strong>
          <span aria-hidden="true">·</span>
          <span>As Sombras</span>
        </div>

        <div
          className={styles.chapterProgress}
          role="img"
          aria-label="Capítulo 1 de 3"
        >
          <span data-current="true" />
          <span />
          <span />
        </div>
      </header>

      <section
        className={styles.storyScene}
        aria-labelledby="cave-invitation-title"
      >
        <div className={styles.caveBackdrop} aria-hidden="true" />
        <div className={styles.skyGlow} aria-hidden="true" />

        <svg
          className={styles.inquiryThread}
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M425 468 C610 398 672 530 832 452 C915 412 980 404 1062 423" />
        </svg>

        <div className={styles.plato}>
          <Image
            src="/images/story/plato-welcome-v2.png"
            alt="Platão abre os braços e convida você a entrar na caverna"
            width={1009}
            height={1559}
            sizes="(max-width: 900px) 82vw, 34vw"
            priority
          />
        </div>

        <div className={styles.dialogue}>
          <p className={styles.chapterLabel}>Capítulo 1 · Entre comigo</p>
          <h1 id="cave-invitation-title">Venha comigo.</h1>
          <p className={styles.lead}>
            Por alguns minutos, olhe apenas para a parede. Depois me conte:
            o que ela deixa você conhecer?
          </p>
          <p className={styles.reassurance}>
            Não tenha pressa. Aqui, até uma sombra pode guardar uma pergunta.
          </p>

          <Link
            className={styles.primaryAction}
            href="/aula/as-sombras/a-descida"
          >
            Entrar na caverna
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
