"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { clampReveal } from "@/lib/reveal";

type LightCutProps = {
  initialReveal?: number;
};

type RevealStyle = CSSProperties & {
  "--reveal": string;
};

export function LightCut({ initialReveal = 42 }: LightCutProps) {
  const [reveal, setReveal] = useState(() => clampReveal(initialReveal));
  const cluesAreForegrounded = reveal > 50;
  const revealStyle: RevealStyle = {
    "--reveal": `${reveal}%`,
  };

  function showAppearance() {
    setReveal(0);
  }

  function showClues() {
    setReveal(100);
  }

  return (
    <section className="light-cut" aria-label="Comparação entre aparência e pistas">
      <div className="light-cut-toolbar">
        <div className="light-cut-buttons" aria-label="Escolher ponto de vista">
          <button
            type="button"
            aria-pressed={!cluesAreForegrounded}
            onClick={showAppearance}
          >
            <span aria-hidden="true">◐</span>
            Ver aparência
          </button>
          <button
            type="button"
            aria-pressed={cluesAreForegrounded}
            onClick={showClues}
          >
            Ver pistas
            <span aria-hidden="true">◑</span>
          </button>
        </div>
        <p
          className="light-cut-live"
          id="light-cut-live"
          role="status"
          aria-live="polite"
        >
          {cluesAreForegrounded
            ? "Pistas em primeiro plano."
            : "Aparência em primeiro plano."}
        </p>
      </div>

      <figure className="light-cut-figure" style={revealStyle}>
        <div className="light-cut-stage">
          <div className="light-cut-layer light-cut-appearance">
            <Image
              src="/images/cave/cave-shadows.webp"
              alt="Interpretação visual de pessoas diante das sombras de uma caverna"
              fill
              preload
              sizes="(max-width: 700px) 100vw, (max-width: 1100px) 92vw, 1200px"
            />
            <div className="appearance-wash" aria-hidden="true" />
          </div>

          <div className="light-cut-layer light-cut-clues">
            <Image
              src="/images/cave/cave-shadows.webp"
              alt=""
              fill
              preload
              sizes="(max-width: 700px) 100vw, (max-width: 1100px) 92vw, 1200px"
            />
            <div className="clues-wash" aria-hidden="true" />
            <div
              className="clue-schema"
              aria-label="Esquema interpretativo: luz, objetos, parede"
            >
              <span>LUZ</span>
              <i aria-hidden="true">→</i>
              <span>OBJETOS</span>
              <i aria-hidden="true">→</i>
              <span>PAREDE</span>
            </div>
          </div>

          <span className="light-cut-edge light-cut-edge-left">
            pistas / mecanismo
          </span>
          <span className="light-cut-edge light-cut-edge-right">
            aparência / sombras
          </span>
          <span className="lumen-cut" aria-hidden="true" />

          <label className="light-cut-range-label" htmlFor="light-cut-range">
            Posição do corte de luz
          </label>
          <input
            className="light-cut-range"
            id="light-cut-range"
            type="range"
            min="0"
            max="100"
            step="1"
            value={reveal}
            aria-describedby="light-cut-live light-cut-caption"
            aria-valuetext={`${reveal}% de pistas visíveis`}
            onChange={(event) =>
              setReveal(clampReveal(Number(event.currentTarget.value)))
            }
          />
        </div>

        <figcaption id="light-cut-caption">
          Imagem de atmosfera — interpretação visual da alegoria, não evidência
          histórica literal.
        </figcaption>
      </figure>

      <div className="light-cut-readings">
        <article data-active={!cluesAreForegrounded}>
          <p>Leitura / aparência</p>
          <h2>O que aparece na parede</h2>
          <p>
            Voltados para a parede, os prisioneiros veem sombras. É o que
            conseguem perceber dali — não uma mentira montada de propósito.
          </p>
        </article>
        <article data-active={cluesAreForegrounded}>
          <p>Leitura / pistas</p>
          <h2>Como a aparência é produzida</h2>
          <p>
            A luz, os objetos e a posição dos prisioneiros ajudam a explicar as
            sombras. Ver o mecanismo amplia a leitura sem apagar o que eles
            percebiam.
          </p>
        </article>
      </div>
    </section>
  );
}
