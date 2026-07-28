import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { methodSteps, previewLesson } from "@/lib/preview-content";

export default function PublicHome() {
  return (
    <div className="public-page">
      <SiteHeader context="public" />

      <main id="conteudo">
        <section className="public-hero">
          <div className="hero-glow" aria-hidden="true" />
          <div className="content-grid hero-grid">
            <div className="hero-copy page-enter">
              <p className="evidence-label">{previewLesson.eyebrow}</p>
              <h1>
                Uma sombra basta para explicar{" "}
                <span className="light-word">o que você vê?</span>
              </h1>
              <p className="hero-intro">
                Filosofia começa quando uma resposta fácil deixa de ser
                suficiente. Entre na cena, procure pistas e construa uma ideia
                que possa mudar.
              </p>
              <div className="hero-actions">
                <Link className="primary-action" href="/aula/as-sombras">
                  Começar uma investigação
                  <span aria-hidden="true">↗</span>
                </Link>
                <a className="text-action" href="#escolas">
                  Conhecer para escolas
                  <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>

            <figure className="cave-window page-enter page-enter-delay">
              <Image
                src="/images/cave/cave-shadows.webp"
                alt="Interpretação artística de pessoas observando sombras em uma caverna"
                fill
                preload
                sizes="(max-width: 800px) 100vw, 52vw"
              />
              <div className="cave-wash" aria-hidden="true" />
              <div className="preview-cut" aria-hidden="true">
                <span />
              </div>
              <div className="scene-label scene-label-left">
                <span>01</span>
                o que aparece
              </div>
              <div className="scene-label scene-label-right">
                <span>02</span>
                o que produz
              </div>
              <figcaption>
                Uma cena para investigar — não uma resposta pronta.
              </figcaption>
            </figure>
          </div>

          <div className="hero-scroll-cue" aria-hidden="true">
            <span />
            siga a pista
          </div>
        </section>

        <section className="method-section" id="metodo">
          <div className="content-grid">
            <div className="section-heading">
              <p className="evidence-label dark-label">Nosso método</p>
              <h2>Não decorar respostas. Aprender a perguntar melhor.</h2>
              <p>
                Cada investigação transforma curiosidade em raciocínio — sem
                placares, atalhos ou respostas entregues por um mascote.
              </p>
            </div>

            <ol className="method-line">
              {methodSteps.map((step, index) => (
                <li key={step.title}>
                  <span className="method-index">0{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="belief-section">
          <div className="content-grid belief-grid">
            <p className="belief-kicker">Ideias não são troféus.</p>
            <blockquote>
              “Uma boa aula não termina com uma resposta. Ela deixa você
              enxergando <em>mais relações</em> do que antes.”
            </blockquote>
            <p className="belief-note">
              Na Philoo, revisar uma hipótese não apaga o caminho. Mostra que
              você aprendeu a olhar de novo.
            </p>
          </div>
        </section>

        <section className="featured-investigation" id="investigacao">
          <div className="content-grid feature-grid">
            <div className="feature-number" aria-hidden="true">
              01
            </div>
            <div className="feature-copy">
              <p className="evidence-label dark-label">Primeira investigação</p>
              <h2>{previewLesson.title}</h2>
              <p>{previewLesson.question}</p>
              <Link className="ink-action" href="/aula/as-sombras">
                Entrar na caverna <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="feature-art">
              <Image
                src="/images/plato/plato-home-neutral-v2.png"
                alt="Platão pensativo"
                width={464}
                height={575}
                sizes="(max-width: 800px) 45vw, 280px"
              />
              <p>
                Platão não entrega a resposta.
                <br />
                Ele devolve uma pergunta.
              </p>
            </div>
          </div>
        </section>

        <section className="school-section" id="escolas">
          <div className="content-grid school-grid">
            <p className="evidence-label">Para escolas e professores</p>
            <h2>O pensamento do aluno fica visível — sem virar uma nota.</h2>
            <p>
              Acompanhe hipóteses, revisões e pontos que pedem mediação. O
              professor continua no centro da conversa; a plataforma organiza
              o percurso.
            </p>
            <a className="paper-action" href="mailto:contato@philoo.com.br">
              Falar com a equipe <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="content-grid">
          <span className="footer-brand">Philoo</span>
          <p>Filosofia para investigar o mundo.</p>
          <p>Feito para perguntas que ainda não terminaram.</p>
        </div>
      </footer>
    </div>
  );
}
