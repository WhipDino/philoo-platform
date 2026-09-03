# Revisão de engajamento — Tales de Mileto

**Revisor:** engagement-specialist  
**Roteiro:** `content/tales/02-story.md`  
**Dossiê:** `content/tales/01-philosophy.md`  
**Público-alvo:** 12–17 anos, contexto escolar brasileiro  
**Data:** 2026-09-02

---

## Veredito

**APROVADO**, com **um ajuste de beat** (4.3) antes da implementação. O restante são nits menores.

O roteiro cumpre o contrato de aula de filósofo, continua o fio pós-Caverna sem reabrir o mito, calibra dificuldade para adolescentes e evita dark patterns. A progressão história → palavra → prática → gancho → recompensa está sólida.

---

## Engajamento genuíno vs decorativo

### Genuíno (manter)

| Área | Por quê funciona |
| --- | --- |
| Ponte de uma frase (1.1) | Reconhece quem veio da Caverna sem recap longo. Troca de guia com competência, não choque. |
| Porto antes da tese (2.1–2.2) | Variedade visível antes da pergunta. O aluno **vê** o gesto antes de nomeá-lo. |
| Pergunta antes da água (3.1 → 3.2) | Impede que “tudo é água” vire piada. Dificuldade desejável: a tese parece estranha, mas a pergunta é séria. |
| Chão sobre água (3.3) | Imagem concreta que desloca o chão firme. Incerteza permitida (“o chão também não é o último fundo”). |
| Honestidade de fonte (3.4, 6.2) | Aristóteles adivinha; a voz de Tales não chegou. Ensina epistemologia sem culpa nem niilismo (“não quer dizer que tanto faz”). |
| Arché separada da água (4.1–4.2) | Retrieval practice: palavra cola no cais já visto. Autonomia implícita (“pergunta ≠ resposta”). |
| Três exercícios escalonados | Classificar → comparar modelos → ligar pares. Cada um repete um gesto já mostrado na história, não decoração. |
| “Não é um copo” (5.2) | Corrige caricatura sem humilhar Tales. O aluno pode discordar da água sem rir de quem perguntou. |
| Gancho um/muitos (6.2) | Dúvida genuína, sem trailer, sem spoiler de Heráclito. Abre curiosidade sem pressão de retenção. |
| Recompensa + `/inicio` (6.3) | Fechamento justo. Takeaways reforçam pergunta > resposta. Destino real, não rota inventada. |

### Decorativo (corretamente ausente)

- Poço, eclipse, lagares de azeite: omitidos com razão. Seriam anedota sem servir ao núcleo.
- Platão narrando: ausente.
- Cliffhanger de desenho: ausente.
- Tabela periódica, átomos, Big Bang: bloqueados no roteiro.

---

## SDT e ciência da aprendizagem

| Necessidade | Como o roteiro atende |
| --- | --- |
| **Autonomia** | “A tua pode ser outra” (4.3, hoje concentrado demais). Takeaway 3: discordar não é rir. Gancho deixa pergunta aberta. |
| **Competência** | Três gestos nomeados (cara / pergunta / resposta) antes dos exercícios. Erro sem punição; Continuar só no acerto. |
| **Pertencimento** | Tales convida (“Olá”), fala de “a gente continua olhando” no fecho. Tom de porto, não tribunal. |
| **Retrieval practice** | Exercícios repetem vocabulário da história (onda, seiva, ânfora, mesa). Não quiz grego decorativo. |
| **Dificuldade desejável** | Modelo A vs B (5.2) força distinção fina. Pair-connect (6.1) integra porto + mesa + arché. |

---

## Dark patterns e regras Philoo

| Regra | Status |
| --- | --- |
| Sem culpa, vergonha ou ansiedade | ✅ |
| Continuar escondido até acerto | ✅ (notas 5.x, 6.1; implementer deve garantir) |
| Erro → próximo toque óbvio (outra alternativa ou retry real) | ✅ (especificado nos beats de exercício) |
| Gancho + reward no fim | ✅ (6.2 → 6.3) |
| Uma ideia por tela | ⚠️ Beat 4.3 viola (ver ajuste abaixo) |
| Sem travessão no copy do aluno | ✅ (travessões só em metadados do roteiro) |
| Tom 12–17, não faculdade, não infantil | ✅ |
| Filósofo em 1ª pessoa, palavra-conceito arché | ✅ |

---

## Ajuste obrigatório

### Beat 4.3 — densidade de ideias

**Problema:** A fala atual empilha cinco movimentos numa tela: paralelo da mesa, forma da pergunta, recusa da química escolar, resposta dele vs tua, arché como gesto de não parar na primeira cara. Para 12–17 anos isso dilui o “agora” do `named-concept`. Autonomia e “não parar na primeira cara” já aparecem em 4.2, nos takeaways e no gancho.

**Texto substituto (fala do Tales):**

> Na mesa do almoço o pão, a fruta e o suco também são muitas caras. A pergunta continua: de que isso é feito, no fundo? É essa forma que arché nomeia.

**O que sai desta tela:** uma ideia só (paralelo estrutural no presente).  
**O que fica em outros beats:** autonomia (“A tua pode ser outra”) → takeaway 3 e fala da recompensa; “não parar na primeira cara” → 4.2 e gancho 6.2.

---

## Nits menores (implementer / story-writer)

1. **Beat 6.2 — comprimento.** A honestidade de fonte (“minha voz não chegou num livro meu”) é valiosa, mas vem logo antes do gancho. Se o overflow cortar texto no Folio, encurte a primeira metade e preserve a frase final: *“Se o fundo é um, ainda fica em aberto como o um se mostra como muitos que nascem e morrem.”*

2. **Beat 3.4 — “seiva”.** Palavra correta, porém menos cotidiana que “suco de fruta” ou “planta”. Se teste de leitura com aluno travar, trocar só este termo no cais (2.2 e 6.1 devem combinar).

3. **Três exercícios numa sessão.** Dentro do espelho da Caverna (5–7 estágios). Monitorar tempo em sala; se a aula estourar, o par `classify` + `pair-connect` é o par mínimo. Não cortar `compare-models` (5.2): é o que impede a piada da água.

4. **Briefing “por que nesta cena”.** Copy de 5.1 e 5.2 está no tom certo (sem culpa). Implementer: não reescrever como “você errou porque confundiu”.

5. **Metadados do roteiro.** Travessões em títulos de beat (`### Beat 1.1 — Olá`) são metadados de agente, não copy do aluno. Não vazar para `*-content.ts`.

6. **Pose 4.3.** Com texto enxuto, `story-panel` da mesa carrega mais peso visual. Garantir que a imagem mostre variedade (pão, fruta, copo) sem rótulos nem tabela.

---

## Calibração 12–17

- **Tom:** conversa de sábio de porto, não tratado. Frases curtas, gestos concretos (cais, chão, mesa).
- **Dificuldade:** adequada. O salto cognitivo maior é 5.2 (modelo superficial vs origem). História prepara bem.
- **Incerteza permitida:** o aluno pode sair discordando da água e ainda ter aprendido arché. Isso é resultado válido, não falha.

---

## Checklist final

- [x] Continua fio pós-Caverna sem reabrir mito
- [x] Tales guia em 1ª pessoa
- [x] História antes de exercício
- [x] Palavra-conceito: arché (água = resposta)
- [x] Gancho honesto + reward → `/inicio`
- [x] Sem dark patterns
- [ ] Beat 4.3 com texto substituto (pendente story-writer ou implementer)

---

## Próximo agente

**exercise-designer** pode avançar com os três `thinkingMove` (`classify`, `compare-models`, `pair-connect`). **implementer** aplica o texto substituto de 4.3 e garante `canAdvance` só no acerto em todos os exercícios.
