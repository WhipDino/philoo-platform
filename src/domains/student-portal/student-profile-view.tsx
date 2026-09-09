"use client";

import { portalStudent } from "./student-portal-content";
import { ThemeSwitch } from "./theme-switch";
import styles from "./student-profile.module.css";

type StudentProfileViewProps = {
  largerText: boolean;
  quietMotion: boolean;
  nightRoom: boolean;
  setLargerText: (value: boolean) => void;
  setQuietMotion: (value: boolean) => void;
  setNightRoom: (value: boolean) => void;
};

export function StudentProfileView({
  largerText,
  quietMotion,
  nightRoom,
  setLargerText,
  setQuietMotion,
  setNightRoom,
}: StudentProfileViewProps) {
  return (
    <section className={styles.page} aria-labelledby="profile-title">
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Sua sala · Philoo</p>
        <h1 id="profile-title">Perfil</h1>
        <p className={styles.lede}>
          Quem você é nesta sala, e como a tela se comporta.
        </p>
      </header>

      <div className={styles.stack}>
        <article className={`${styles.card} ${styles.identity}`} aria-labelledby="profile-name">
          <span className={styles.avatar} aria-hidden="true">
            {portalStudent.initials}
          </span>
          <div className={styles.identityCopy}>
            <h2 id="profile-name">{portalStudent.fullName}</h2>
            <p className={styles.chips}>
              <span>{portalStudent.classroom}</span>
              <span>{portalStudent.school}</span>
            </p>
            <p className={styles.metaLine}>{portalStudent.teacher}</p>
            <p className={styles.metaLine}>{portalStudent.email}</p>
          </div>
        </article>

        <section className={styles.card} aria-labelledby="settings-title">
          <h2 id="settings-title">Configurações</h2>
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
          <div className={styles.themeRow}>
            <span>
              <strong>Sala à noite</strong>
              <small>A sala escurece; o azul da Philoo continua o mesmo.</small>
            </span>
            <ThemeSwitch
              checked={nightRoom}
              quietMotion={quietMotion}
              onChange={setNightRoom}
            />
          </div>
        </section>
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
      <span>
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <i aria-hidden="true">
        <span />
      </i>
    </label>
  );
}
