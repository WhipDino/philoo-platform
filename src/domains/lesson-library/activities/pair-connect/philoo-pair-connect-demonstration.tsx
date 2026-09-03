import styles from "./philoo-pair-connect-demonstration.module.css";

export function PhilooPairConnectDemonstration() {
  return (
    <section
      className={styles.demonstration}
      aria-label="Demonstração: uma linha sai de um nó e chega no outro. Se não combinar, ela treme e se solta."
    >
      <div className={styles.stage} aria-hidden="true">
        <div className={styles.node} data-side="left">
          <span>Luz</span>
          <i className={styles.port} />
        </div>
        <svg className={styles.wire} viewBox="0 0 160 48" preserveAspectRatio="none">
          <path d="M 8 24 C 56 24, 104 24, 152 24" />
        </svg>
        <div className={styles.node} data-side="right" data-shake>
          <i className={styles.port} />
          <span>A coisa</span>
        </div>
        <div className={styles.captions}>
          <p className={styles.caption} data-phase="draw">
            Puxe a linha até o outro nó.
          </p>
          <p className={styles.caption} data-phase="check">
            Conferir: se não combinar, avisa e solta.
          </p>
        </div>
      </div>
    </section>
  );
}
