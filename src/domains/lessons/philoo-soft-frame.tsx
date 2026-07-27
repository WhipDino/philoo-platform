import styles from "./philoo-soft-frame.module.css";

export function PhilooSoftFrame() {
  return (
    <div
      className={styles.frame}
      data-philoo-soft-frame
      aria-hidden="true"
    >
      <svg
        className={styles.rails}
        viewBox="0 0 1200 760"
        preserveAspectRatio="none"
      >
        <path
          className={styles.railShadow}
          d="M-40 212C110 92 274 56 448 91C532 108 597 83 663 27"
        />
        <path
          className={styles.railSurface}
          d="M-40 204C110 84 274 48 448 83C532 100 597 75 663 19"
        />

        <path
          className={styles.railShadow}
          d="M675 782C809 648 965 628 1248 490"
        />
        <path
          className={styles.railSurface}
          d="M675 774C809 640 965 620 1248 482"
        />
      </svg>

      <div className={styles.pebbles}>
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
