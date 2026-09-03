# Tales de Mileto — Validação de produto

**Data:** 2026-09-02  
**Veredito:** **aprovado para jogar**, com nits visuais (rosto/poses iteráveis; overlay de hidratação do Folio em dev).

## Rotas jogadas

- `/aula/tales` → `/aula/tales/ola`
- `/aula/tales/ola` — Tales em 1ª pessoa; ponte da Caverna numa frase
- `/aula/tales/mileto` — porto 16:9, Tales na camada UI
- `/aula/tales/o-principio`
- `/aula/tales/arche` — barra **Momento da palavra**, título **Arché**, glossa ἀρχή; água não é a palavra
- `/aula/tales/tres-cestos` — história antes do EX; CTA “Separar as frases”
- `/aula/tales/o-um-e-os-muitos` — CTA “Ligar os pares”; reward testado no vitest → `/inicio`

## Copy e contrato

- Sem travessão no conteúdo do aluno (`tales-content`, config EX-05).
- Guia Tales; Platão não narra.
- EX-05 sem `guide` no tabuleiro.
- Continuar do Folio só após acerto (testes EX-05, EX-06, EX-09).

## Testes

`npx vitest run` em `tales-scene.test.tsx`, `character-library`, `library-catalog`: **passou**. Helper do exemplo EX-05 usa `getByRole` (não pula o exemplo).

## Biblioteca

Tales `available`, `href: "/aula/tales/ola"`. Caverna continua “você está aqui”. `playableLessonCount` = 4.

## Larguras (900 de altura)

`npm run check:responsive` (sem MCP Playwright neste chat): 320, 375, 768, 1024, 1280, 1440, 1920.

Páginas Tales no script: `ola`, `mileto`, `arche`, `tres-cestos`. Todas **ok extra=0**. Arché também medido a 320×900 no browser Cursor (`overflowX: false`).

## Arte

Âncora e poses chroma-keyadas (`thales-*.png` RGBA). Cenas 16:9 opacas. Identidade: outro homem (manto ferrugem, sem louros). Pose da água saiu com um pouco de água visível na mão. Mesa de almoço saiu mais brasileira/cheia do que pão-fruta-suco. Iteração de look fica com o humano.

## Nits

- Overlay de hidratação do Next em dev no Folio (mesmo padrão de `localStorage`/jornada). Não bloqueia o aluno em produção se for o mesmo do restante das aulas.
- `o-um-e-os-muitos` não entrou no script de PNG; foi aberto no browser e coberto por teste.

Não há Lição 4 da Caverna. Não há EX-12.
