import styles from "./philoo-dual-lens-demonstration.module.css";

export function PhilooDualLensDemonstration() {
  return (
    <section
      className={styles.demonstration}
      aria-label="Demonstração: arraste a linha no meio da imagem para comparar os dois olhos. Depois toque em Ver perguntas e escolha uma carta."
    >
      <div className={styles.stage} aria-hidden="true">
        <div className={styles.frame}>
          <div className={styles.frameA} />
          <div className={styles.frameB} />
          <span className={styles.handle}>
            <span className={styles.knob} />
          </span>
        </div>
        <div className={styles.captions}>
          <p className={styles.caption} data-phase="switch">
            Pegue a bolinha e arraste para o lado.
          </p>
          <p className={styles.caption} data-phase="answer">
            Quando a imagem nova aparecer, toque em Ver perguntas.
          </p>
        </div>
      </div>
    </section>
  );
}
