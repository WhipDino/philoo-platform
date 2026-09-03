import styles from "./philoo-decision-layers-demonstration.module.css";

export function PhilooDecisionLayersDemonstration() {
  return (
    <section
      className={styles.demonstration}
      aria-label="Demonstração: arraste uma camada até o degrau da pirâmide. Embaixo é a base. Em cima pesa mais."
    >
      <div className={styles.stage} aria-hidden="true">
        <div className={styles.card} data-phase="pick">
          Camada
        </div>
        <div className={styles.stack}>
          <div className={styles.slot} data-rank="0" data-fill="1" />
          <div className={styles.slot} data-rank="1" data-fill="2" />
          <div className={styles.slot} data-rank="2" data-fill="3" />
        </div>
        <div className={styles.captions}>
          <p className={styles.caption} data-phase="pick">
            Arraste a camada até o degrau.
          </p>
          <p className={styles.caption} data-phase="check">
            Conferir: só as camadas fora do lugar voltam.
          </p>
        </div>
      </div>
    </section>
  );
}
