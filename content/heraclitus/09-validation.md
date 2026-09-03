# Heráclito de Éfeso — Validação de produto

**Data:** 2026-09-03  
**Veredito:** **aprovado para jogar**

## Rotas jogadas

- `/aula/heraclitus` → `/aula/heraclitus/ola`
- `/aula/heraclitus/ola` — Heráclito em 1ª pessoa; gancho do rio
- `/aula/heraclitus/efeso` — panorama 16:9, guia na camada UI
- `/aula/heraclitus/o-rio` — fluxo e paradoxo do “mesmo”
- `/aula/heraclitus/panta-rhei` — momento da palavra *panta rhei*
- `/aula/heraclitus/praticar` — EX-05 + EX-06; Continuar oculto até acerto
- `/aula/heraclitus/fecho` — reward → `/inicio`

## Copy e contrato

- Conteúdo em `heraclitus-content.ts`; sem hardcode nos componentes de rota.
- Guia Heráclito; Platão não narra.
- EX-05/06 com `action={undefined}` até acerto (coberto em `heraclitus-scene.test.tsx`).
- Folio: cartão no miolo, guia apontando para o conteúdo, poses semânticas do catálogo.

## Testes

```text
npm test -- heraclitus-scene library-catalog character-library
```

**Resultado:** 3 ficheiros, **20/20 passou** (2026-09-03).

| Suite | Resultado |
|-------|-----------|
| `heraclitus-scene.test.tsx` | passou — 6 cenas, fecho → `/inicio`, EX sem Continuar prematuro |
| `library-catalog.test.ts` | passou — Heráclito `available`, `href: /aula/heraclitus/ola` |
| `character-library/index.test.ts` | passou — 8 poses Heráclito (como Tales) |

## Biblioteca e portal

- `library-catalog`: capítulo Heráclito `available`, `href: /aula/heraclitus/ola`.
- `student-portal-content`: `portalEraLessons` Heráclito alinhado a `available`.
- `tools/playwright-check/check.mjs`: 6 rotas Heráclito adicionadas ao script global.

## Arte (11 PNGs)

Destino: `public/images/story/heraclitus/`

| Ficheiro | Tipo | Chroma RGBA |
|----------|------|-------------|
| `heraclitus-identity-anchor-v1.png` | pose | sim (pré-existente) |
| `heraclitus-point-river-v1.png` | pose | sim |
| `heraclitus-present-panel-v1.png` | pose | sim |
| `heraclitus-open-hands-flow-v1.png` | pose | sim |
| `heraclitus-hold-paradox-v1.png` | pose | sim |
| `heraclitus-opposites-gesture-v1.png` | pose | sim |
| `heraclitus-present-word-v1.png` | pose | sim |
| `heraclitus-hook-open-v1.png` | pose | sim |
| `beat-02-efeso-panorama-v1.png` | cena 16:9 | não |
| `beat-03-rio-fluxo-v1.png` | cena 16:9 | não |
| `beat-04-paralelo-fluxo-v1.png` | cena 16:9 | não |

Motor: Cursor `GenerateImage` only. Pós-processamento poses: `node scripts/chroma-key-green.mjs --dir public/images/story/heraclitus` (prefixo `heraclitus-` incluído no script).

### Follow-up pós-Validator (2026-09-03)

- **Identidade:** confirmada — `present-panel` = master aprovado (`heraclitus-identity-approved-v1.png`), sem louros.
- **Chroma re-pass (3 poses):** `point-river`, `open-hands-flow`, `hold-paradox` regeneradas via `GenerateImage` a partir do master verde; chroma com `node scripts/chroma-key-green.mjs --tight` (despill reforçado, alpha cutoff mais agressivo) e downscale para 512×768 (alinhado às poses limpas ~397 px).
- **Script:** `chroma-key-green.mjs` / `.ps1` ganharam flags `--tight` e `--despill-only` + pass de despill pós-key.

## Responsivo (altura 900px)

Páginas: `/aula/heraclitus/ola`, `/aula/heraclitus/praticar`  
Larguras: 320, 375, 768, 1920  
Ferramenta: Playwright headless (`tools/playwright-check`)

| Página | 320 | 375 | 768 | 1920 |
|--------|-----|-----|-----|------|
| ola | ok extra=0 | ok | ok | ok |
| praticar | ok extra=0 | ok | ok | ok |

Sem overflow horizontal nem story shell oculto.

## Pendências menores (não bloqueiam)

- [ ] `03-engagement-review.md` — passo opcional do pipeline
- Iteração visual de poses/cenas fica com o humano (mesmo padrão Tales)
