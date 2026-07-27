import styles from "./philoo-outer-ribbons.module.css";

export function PhilooOuterRibbons() {
  return (
    <div
      className={styles.pattern}
      data-philoo-outer-ribbons
      aria-hidden="true"
    >
      <svg
        className={styles.canvas}
        viewBox="0 0 1600 1000"
        preserveAspectRatio="none"
      >
        <path
          className={styles.ribbonSoft}
          d="M-130 238C94 40 303 22 490 112C621 175 723 120 824-52"
        />
        <path
          className={styles.ribbonSky}
          d="M-142 208C82 10 299-4 494 84C625 143 713 90 806-68"
        />
        <path
          className={styles.ribbonLight}
          d="M-148 188C71-8 292-26 498 60C630 115 702 64 789-80"
        />

        <path
          className={styles.spiralSoft}
          d="M1685 172C1457 61 1288 135 1308 309C1328 475 1558 506 1642 369C1721 241 1582 150 1479 209C1392 259 1429 366 1510 366C1577 366 1603 299 1570 258"
        />
        <path
          className={styles.spiralSky}
          d="M1706 206C1480 94 1322 158 1338 312C1355 460 1550 482 1618 359C1676 255 1577 184 1496 226C1425 263 1450 343 1514 346C1566 348 1586 298 1561 266"
        />

        <path
          className={styles.spiralSoft}
          d="M-126 744C22 613 191 645 226 783C258 913 107 1016-16 948C-120 890-88 764 8 742C86 724 145 794 119 859C97 913 38 920 5 885"
        />
        <path
          className={styles.spiralLight}
          d="M-142 778C3 651 160 677 190 795C218 902 94 985-11 929C-99 882-73 782 7 764C71 749 120 806 99 858C82 899 37 906 10 878"
        />

        <path
          className={styles.ribbonSoft}
          d="M507 1085C744 875 967 808 1184 842C1380 873 1502 820 1711 640"
        />
        <path
          className={styles.ribbonSky}
          d="M552 1107C785 906 984 846 1180 875C1391 906 1532 850 1730 674"
        />
        <path
          className={styles.ribbonLight}
          d="M590 1125C820 936 1001 881 1180 907C1401 939 1560 878 1744 706"
        />
      </svg>
    </div>
  );
}
