import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowSquareOut,
  CaretDown,
  MagnifyingGlass,
} from "@phosphor-icons/react/dist/ssr";
import {
  getTechnicalDocumentNeighbors,
  technicalDocuments,
  technicalDocumentSections,
  type TechnicalDocument,
} from "@/domains/technical-docs/technical-docs-registry";
import type { TechnicalDocumentHeading } from "@/domains/technical-docs/technical-docs-content";
import styles from "./docs.module.css";

type DocsShellProps = {
  currentDocument?: TechnicalDocument;
  headings?: readonly TechnicalDocumentHeading[];
  children: ReactNode;
  searchQuery?: string;
};

function DocumentationIndex({
  currentSlug,
}: {
  currentSlug?: string;
}) {
  return (
    <>
      <form
        action="/tecnico/busca"
        className={styles.searchForm}
        role="search"
      >
        <MagnifyingGlass aria-hidden size={17} weight="bold" />
        <input
          aria-label="Pesquisar na documentação"
          name="q"
          placeholder="Pesquisar..."
          type="search"
        />
        <button aria-label="Pesquisar" type="submit">
          <ArrowRight aria-hidden size={17} weight="bold" />
        </button>
      </form>
      <nav aria-label="Índice da documentação">
        {technicalDocumentSections.map((section) => (
          <section className={styles.sectionGroup} key={section.id}>
            <h2>{section.label}</h2>
            <ul>
              {technicalDocuments
                .filter((document) => document.section === section.id)
                .map((document) => (
                  <li key={document.slug}>
                    <Link
                      aria-current={
                        currentSlug === document.slug ? "page" : undefined
                      }
                      href={`/tecnico/guias/${document.slug}`}
                    >
                      {document.shortTitle}
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </nav>
    </>
  );
}

export function DocsShell({
  currentDocument,
  headings = [],
  children,
}: DocsShellProps) {
  return (
    <main className={styles.page} id="conteudo">
      <header className={styles.header}>
        <Link className={styles.brand} href="/tecnico">
          Philoo
        </Link>
        <nav aria-label="Documentação técnica">
          <Link href="/tecnico">Visão geral</Link>
          <Link
            aria-current={currentDocument ? "page" : undefined}
            href="/tecnico/guias/comecar"
          >
            Guias
          </Link>
          <Link href="/tecnico/biblioteca">Exercícios</Link>
        </nav>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <DocumentationIndex currentSlug={currentDocument?.slug} />
        </aside>

        <div>
          <details className={styles.mobileIndex}>
            <summary>
              Navegar pela documentação
              <CaretDown aria-hidden size={17} weight="bold" />
            </summary>
            <div className={styles.mobileIndexContent}>
              <DocumentationIndex currentSlug={currentDocument?.slug} />
            </div>
          </details>
          {children}
        </div>

        {headings.length > 0 ? (
          <aside className={styles.toc} aria-label="Nesta página">
            <p>Nesta página</p>
            <ul>
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    className={
                      heading.level === 3 ? styles.tocLevel3 : undefined
                    }
                    href={`#${heading.id}`}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        ) : (
          <div />
        )}
      </div>
    </main>
  );
}

export function DocsArticle({
  document,
  headings,
  children,
}: {
  document: TechnicalDocument;
  headings: readonly TechnicalDocumentHeading[];
  children: ReactNode;
}) {
  const section = technicalDocumentSections.find(
    (item) => item.id === document.section,
  );
  const { previous, next } = getTechnicalDocumentNeighbors(document.slug);
  const githubHref = `https://github.com/WhipDino/philoo-platform/blob/codex/story-folio/${document.sourcePath}`;

  return (
    <DocsShell currentDocument={document} headings={headings}>
      <article className={styles.article}>
        <header className={styles.articleHeader}>
          <p className={styles.breadcrumb}>
            <Link href="/tecnico">Manual</Link>
            <span aria-hidden>/</span>
            <span>{section?.label}</span>
          </p>
          <p className={styles.eyebrow}>{section?.label}</p>
          <h1>{document.title}</h1>
          <p className={styles.description}>{document.description}</p>
          <div className={styles.sourceBar}>
            <code>{document.sourcePath}</code>
            <Link href={githubHref} rel="noreferrer" target="_blank">
              Abrir fonte no GitHub
              <ArrowSquareOut aria-hidden size={16} weight="bold" />
            </Link>
          </div>
        </header>

        <div className={styles.markdownArea}>{children}</div>

        <nav className={styles.articleFooter} aria-label="Guias relacionados">
          {previous ? (
            <Link href={`/tecnico/guias/${previous.slug}`}>
              <ArrowLeft aria-hidden size={20} weight="bold" />
              <div>
                <span>Anterior</span>
                <strong>{previous.shortTitle}</strong>
              </div>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/tecnico/guias/${next.slug}`}>
              <div>
                <span>Próximo</span>
                <strong>{next.shortTitle}</strong>
              </div>
              <ArrowRight aria-hidden size={20} weight="bold" />
            </Link>
          ) : null}
        </nav>
      </article>
    </DocsShell>
  );
}

export { styles as docsStyles };
