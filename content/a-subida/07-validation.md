# A Subida — Validação final

**Agente:** validator  
**Base revisada:** `01-philosophy.md`, `02-story.md`, `03-engagement-review.md`, `04-exercises.md`, `05-art.md`, `06-images.md`  
**Escopo:** conteúdo e formalização de exercícios/imagens; código inspecionado apenas na medida necessária para beats 4 e 6.

---

## Veredito: **APROVADO COM RESSALVAS**

Nenhum item invalida a lição como um todo. Dois itens bloqueiam especificamente a implementação de **beats individuais** (4 e 6) até serem resolvidos; os demais são observações não bloqueantes.

---

## Checklist

### 1. Mecânica nova tem aprovação humana registrada?
**Passa.** Nenhum beat sinaliza mecânica nova. `04-exercises.md` mapeia beats 2, 5, 6 e 8 para motores existentes.

Ressalva não bloqueante: decisão humana pendente sobre EX-06/EX-07/EX-08 como telas independentes (fora do escopo desta sequência).

### 2. Regras editoriais
**Passa, com ressalva não bloqueante.** Dois narradores, sem travessão em `02-story.md`, anacronismos cobertos, tom não acusatório. Travessão no `matchedFeedback` do beat 5 em `04-exercises.md` deve ser corrigida na implementação.

### 3. Conteúdo separado de código
**Passa nos artefatos de conteúdo.** Beat 6 bloqueado até extração do EX-03 (`philoo-causal-path.tsx` ainda acoplado à Caverna).

### 4. Zona clicável = vetor
**Passa por ausência.** Nenhum beat exige zona clicável sobre pixels.

### 5. Novidade decorativa
**Passa.** Os quatro exercícios produzem artefato de raciocínio inspecionável.

### 6. Engagement
**Passa.** `03-engagement-review.md` aprovado após revisões em `02-story.md`.

### 7. Exercise-designer consultou catálogo
**Passa.** Inventário de motores documentado em `04-exercises.md`.

---

## Pendência beat 4 (fundo branco)

`beat-04-plato-ofuscado-v1.png` sem canal alfa (rembg indisponível). **Bloqueante para composição ideal no cartão de conceito.** Implementer pode usar pose do `plato-pose-catalog` como fallback ou integrar PNG com fundo branco sobre cartão creme até rembg.

---

## Resumo de bloqueios

| Item | Beat | Bloqueio |
|------|------|----------|
| Sem canal alfa Platão | 4 | Composição UI ideal |
| EX-03 acoplado à Caverna | 6 | Texto hardcoded no motor |

**Não bloqueantes:** travessão no feedback do beat 5 (corrigir em `04-exercises`); decisão EX-06/07/08.

---

## Próximo passo

Implementer pode iniciar beats 1, 2, 3, 5, 7, 8 e 9. Beats 4 e 6 com fallback documentado ou aguardando correção de asset/motor.
