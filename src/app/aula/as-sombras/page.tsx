import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HypothesisNote } from "@/components/hypothesis-note";
import { LightCut } from "@/components/light-cut";

export const metadata: Metadata = {
  title: "As Sombras — Corte de Luz",
  description:
    "Uma investigação visual sobre aparência, mecanismo e a alegoria da caverna.",
};

export default function ShadowsLessonPage() {
  return (
    <div className="lesson-page">
      <header className="lesson-header">
        <div className="content-grid lesson-header-inner">
          <Link className="lesson-back" href="/inicio">
            <span aria-hidden="true">←</span>
            Voltar ao início
          </Link>
          <span className="lesson-header-mark" aria-label="Philoo">
            Philoo
          </span>
          <span className="lesson-progress">Investigação 01 · observação</span>
        </div>
      </header>

      <main id="conteudo">
        <section className="lesson-opening">
          <div className="lesson-beam" aria-hidden="true" />
          <div className="content-grid lesson-opening-inner">
            <p className="evidence-label">AS SOMBRAS · CORTE DE LUZ</p>
            <h1>O que uma sombra deixa de fora?</h1>
            <div className="lesson-opening-copy">
              <p>Antes de procurar a resposta, observe o mecanismo.</p>
              <p>
                Deslize o corte de luz para comparar o que aparece com as
                pistas de como aparece.
              </p>
            </div>
          </div>
        </section>

        <section className="light-cut-section">
          <div className="content-grid">
            <LightCut />
          </div>
        </section>

        <section className="reflection-section">
          <div className="content-grid reflection-grid">
            <div className="reflection-copy">
              <p className="evidence-label dark-label">
                Sua leitura · provisória
              </p>
              <h2>
                Sem precisar ter certeza: o que as sombras explicam para os
                prisioneiros — e o que ainda fica em aberto?
              </h2>
              <p>
                Escreva uma hipótese provisória. Você pode mudá-la depois.
              </p>
            </div>
            <HypothesisNote />
          </div>
        </section>

        <section className="plato-section">
          <div className="content-grid">
            <details className="plato-details">
              <summary>
                <span>Quer uma pergunta de Platão?</span>
                <span aria-hidden="true">+</span>
              </summary>
              <div className="plato-details-body">
                <Image
                  src="/images/plato/platao-master.webp"
                  alt="Platão pensativo"
                  width={260}
                  height={322}
                  sizes="(max-width: 700px) 190px, 260px"
                />
                <div>
                  <p className="evidence-label">Uma pergunta, não uma resposta</p>
                  <blockquote>
                    Se você só pudesse olhar para a parede, que pista faria você
                    revisar o que parecia certo?
                  </blockquote>
                </div>
              </div>
            </details>
          </div>
        </section>
      </main>

      <footer className="lesson-footer">
        <div className="content-grid">
          <span>Philoo · ideias podem mudar</span>
          <Link href="/inicio">Encerrar e voltar ao início</Link>
        </div>
      </footer>
    </div>
  );
}
