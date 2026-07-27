import Image from "next/image";
import Link from "next/link";
import { ReasoningPath } from "@/components/reasoning-path";
import { SiteHeader } from "@/components/site-header";
import { previewLesson } from "@/lib/preview-content";

export default function StudentHome() {
  return (
    <div className="student-page">
      <SiteHeader context="student" />

      <main id="conteudo">
        <section className="student-intro">
          <div className="content-grid student-heading">
            <div>
              <p className="evidence-label dark-label">Domingo · 26 de julho</p>
              <p className="student-greeting">Bom te ver por aqui.</p>
              <h1>Continue a investigação.</h1>
            </div>
            <p className="student-promise">
              Seu percurso guarda mudanças de ideia, não uma coleção de pontos.
            </p>
          </div>
        </section>

        <section className="resume-section" id="investigacoes">
          <div className="content-grid resume-grid">
            <div className="resume-copy">
              <p className="evidence-label">Onde você parou</p>
              <p className="resume-session">A Caverna · Sessão 1 de 3</p>
              <h2>{previewLesson.title}</h2>
              <p className="resume-question">{previewLesson.question}</p>
              <p className="resume-marker">
                Última pista: <strong>{previewLesson.resumeLabel}</strong>
              </p>
              <Link className="primary-action" href="/aula/as-sombras">
                Retomar As Sombras <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="resume-visual">
              <Image
                src="/images/cave/cave-shadows.webp"
                alt=""
                fill
                preload
                sizes="(max-width: 800px) 100vw, 50vw"
              />
              <div className="resume-vignette" aria-hidden="true" />
              <span className="resume-big-number" aria-hidden="true">
                01
              </span>
              <p>A sombra impossível</p>
            </div>
          </div>
        </section>

        <section className="path-section" id="percurso">
          <div className="content-grid">
            <div className="path-heading">
              <div>
                <p className="evidence-label dark-label">Sua linha de raciocínio</p>
                <h2>Uma ideia em movimento</h2>
              </div>
              <p>
                Você pode voltar a qualquer passo. Uma revisão é parte do
                percurso, não uma correção escondida.
              </p>
            </div>
            <ReasoningPath activeStep={1} />
          </div>
        </section>

        <section className="revisit-section">
          <div className="content-grid revisit-grid">
            <div>
              <p className="evidence-label dark-label">Ideias para revisitar</p>
              <h2>O que já ficou menos óbvio?</h2>
            </div>
            <ul className="thought-list">
              <li>
                <span>01</span>
                <p>
                  <strong>Aparência não é a mesma coisa que fonte.</strong>
                  Uma pista pode explicar como algo surgiu.
                </p>
              </li>
              <li>
                <span>02</span>
                <p>
                  <strong>Ter dúvida também informa.</strong>
                  Sua confiança mudou depois de observar a cena.
                </p>
              </li>
            </ul>
            <aside className="plato-question">
              <div>
                <p className="evidence-label">Pergunta guardada</p>
                <blockquote>
                  “O que faria você desconfiar de uma explicação que sempre
                  pareceu suficiente?”
                </blockquote>
                <p>— uma pergunta de Platão para levar com você</p>
              </div>
              <Image
                src="/images/plato/platao-master.webp"
                alt="Platão pensativo"
                width={260}
                height={322}
                sizes="180px"
              />
            </aside>
          </div>
        </section>
      </main>

      <footer className="site-footer student-footer">
        <div className="content-grid">
          <span className="footer-brand">philoo</span>
          <p>Seu percurso é privado até você decidir compartilhá-lo.</p>
        </div>
      </footer>
    </div>
  );
}
