import type { Metadata } from "next";
import Link from "next/link";
import { searchTechnicalDocuments } from "@/domains/technical-docs/technical-docs-content";
import { technicalDocumentSections } from "@/domains/technical-docs/technical-docs-registry";
import { DocsShell, docsStyles as styles } from "../guias/docs-shell";

export const metadata: Metadata = {
  title: "Pesquisar na documentação",
  description: "Busca em todos os guias técnicos e de produto do Philoo.",
  robots: {
    index: false,
    follow: false,
  },
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

export default async function TechnicalDocsSearch({
  searchParams,
}: SearchPageProps) {
  const { q } = await searchParams;
  const query = Array.isArray(q) ? q[0] ?? "" : q ?? "";
  const results = searchTechnicalDocuments(query);

  return (
    <DocsShell>
      <section className={styles.searchPage}>
        <header className={styles.searchHero}>
          <p className={styles.eyebrow}>Documentação Philoo</p>
          <h1>Encontre uma decisão, regra ou exemplo.</h1>
          <p>
            A busca lê o conteúdo real dos documentos, não apenas seus títulos.
          </p>
          <form
            action="/tecnico/busca"
            className={styles.largeSearch}
            role="search"
          >
            <input
              aria-label="Pesquisar em toda a documentação"
              defaultValue={query}
              name="q"
              placeholder="Ex.: criar aula, personagem, responsividade..."
              type="search"
            />
            <button type="submit">Pesquisar</button>
          </form>
        </header>

        {query && results.length > 0 ? (
          <div className={styles.results}>
            {results.map(({ document, excerpt }) => {
              const section = technicalDocumentSections.find(
                (item) => item.id === document.section,
              );

              return (
                <Link
                  className={styles.result}
                  href={`/tecnico/guias/${document.slug}`}
                  key={document.slug}
                >
                  <span>{section?.label}</span>
                  <h2>{document.title}</h2>
                  <p>{excerpt}</p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className={styles.empty}>
            {query
              ? `Nenhum guia encontrado para “${query}”. Tente uma palavra mais ampla, como “aula”, “exercício” ou “personagem”.`
              : "Digite uma palavra ou pergunta para pesquisar em todos os guias."}
          </div>
        )}
      </section>
    </DocsShell>
  );
}
