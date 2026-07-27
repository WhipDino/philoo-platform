import Link from "next/link";

type SiteHeaderProps = {
  context: "public" | "student";
};

export function SiteHeader({ context }: SiteHeaderProps) {
  const isStudent = context === "student";

  return (
    <header className={`site-header ${isStudent ? "student-header" : ""}`}>
      <div className="header-inner">
        <Link className="brand" href={isStudent ? "/inicio" : "/"}>
          <span className="brand-aperture" aria-hidden="true" />
          <span>Philoo</span>
        </Link>

        <nav aria-label={isStudent ? "Navegação do aluno" : "Navegação principal"}>
          {isStudent ? (
            <>
              <Link aria-current="page" href="/inicio">
                Início
              </Link>
              <a href="#investigacoes">Investigações</a>
              <a href="#percurso">Meu percurso</a>
            </>
          ) : (
            <>
              <a href="#metodo">Como funciona</a>
              <a href="#escolas">Para escolas</a>
            </>
          )}
        </nav>

        {isStudent ? (
          <span className="profile-link" aria-label="Estudante Ana">
            <span aria-hidden="true">AN</span>
          </span>
        ) : (
          <Link className="header-entry" href="/inicio">
            Entrar <span aria-hidden="true">↗</span>
          </Link>
        )}
      </div>
    </header>
  );
}
