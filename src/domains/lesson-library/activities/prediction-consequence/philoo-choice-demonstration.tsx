import styles from "./philoo-choice-demonstration.module.css";

export function PhilooChoiceDemonstration() {
  return (
    <section
      className={styles.demonstration}
      aria-label="Demonstração: escolha uma alternativa e confirme. Se não for essa, a gente avisa e você tenta de novo."
    >
      <div className={styles.stage} aria-hidden="true">
        <div className={styles.option} data-state="idle">
          Que o fogo apague
        </div>
        <div className={styles.option} data-state="pick">
          Que riam dele
        </div>
        <span className={styles.confirm}>Confirmar</span>
        <div className={styles.captions}>
          <p className={styles.caption} data-phase="pick">
            Toque numa alternativa.
          </p>
          <p className={styles.caption} data-phase="ok">
            Se for essa, fica verde. Se não for, a gente avisa.
          </p>
        </div>
      </div>
    </section>
  );
}
