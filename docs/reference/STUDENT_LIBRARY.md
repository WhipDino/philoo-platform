# Biblioteca do aluno

A Biblioteca em `/inicio` (aba **Biblioteca**, também `/inicio?view=explore`)
é o acervo cronológico. Não é a página técnica `/tecnico/biblioteca`.

Fonte tipada: `src/domains/curriculum-catalog/library-catalog.ts`.

## Papel

- **Meu caminho** recomenda a ordem e mostra onde a pessoa está.
- **Biblioteca** deixa ver eras e grupos, inclusive o que ainda não abriu.

Números do topo (eras, grupos, filósofos) **saem do catálogo**. Não escreva
“58 filósofos” na UI se o arquivo ainda não tem 58 nomes.

**Retomar** lista só capítulo com `status: "in-progress"` e `href`. Não invente
barra de progresso em Tales antes da aula existir.

## Quando uma aula nova entra

No mesmo PR das rotas `/aula/...`:

1. capítulo no grupo certo (filósofo, título, href, status);
2. `lessonCount` / lista de filósofos honestos;
3. se for o módulo atual, `status: "current"` nesse grupo e o anterior vira
   `seen` ou permanece no caminho.

Grupos “em breve” (Helenismo, eras vazias) podem existir como prateleira,
sem aula clicável e sem progresso falso.
