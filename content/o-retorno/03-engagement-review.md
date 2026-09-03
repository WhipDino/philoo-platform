# O Retorno — Revisão de engajamento

**Revisor:** engagement-specialist  
**Base:** `01-philosophy.md`, `02-story.md`, `docs/reference/FOLIO_CHAPTER_PATTERNS.md`  
**Público:** 12–17 anos, escolas brasileiras  
**Fundamentos:** SDT (autonomia, competência, pertencimento), retrieval practice espaçada, dificuldade desejável, incerteza genuína como resultado permitido

---

## Veredito geral

**Passou com ressalvas**

O roteiro cumpre as regras duras de engajamento Philoo: medo tratado como resposta razoável, custo sensorial sem vergonha, obrigação estrutural sem culpa moral, gancho final sem cliffhanger de desenho, `named-concept` sem receita de vida. As ressalvas ficam na implementação dos três exercícios novos (Continuar escondido, feedback de erro) e no tom da ameaça de 517a no beat 6.

---

## Onde o engajamento é genuíno

### Beat 1 — Na boca da caverna
Engajamento **narrativo e afetivo**, não decorativo. Continuidade direta com o gancho de A Subida; hesitação explícita (“não de heroísmo”) normaliza o medo de voltar sem rotular covardia. A fala de Platão (“Pode parecer ameaça”) ancora o risco social do gesto antes de qualquer exercício. **Competência:** o aluno reconhece uma estrutura emocional que já conhece (lugar antigo que parece menor). **Autonomia:** a decisão de descer começa aqui, sem coerção ainda visível.

### Beat 2 — Katabainein (`named-concept`)
Engajamento **pedagógico de vocabulário**, com risco leve de pausa passiva (mesmo perfil do beat Periagōgē em A Subida). O bloco “Esta cena” conecta palavra ao gesto já visto; o bloco “Agora” cumpre o padrão Folio: paralelo estrutural (“atravessar de um lugar para outro”), não receita de aplicação. A linha “O texto não ensina como fazer isso. Só mostra que o movimento existe.” protege contra lição de casa disfarçada. **Retrieval:** ancora `katabainein` para o beat 6.

### Beat 3 — A escuridão de voltar
Engajamento **genuíno e central**. Reframe não punitivo: escuridão como custo esperado, tropeço como readaptação, não regressão. Platão modela a explicação (“Não porque eu esqueci o que vi lá fora”) antes do exercício. **Competência:** comparar duas visões do mesmo trecho exige perspectiva, não julgamento de valor. Dificuldade desejável calibrada: o aluno entende *por que* ver mal de novo não invalida o que viu fora.

### Beat 4 — Os jogos de sombra
Engajamento **excelente para pertencimento e competência**. Ridículo social aparece como desconforto real, não como violência; Platão desloca a leitura (“perdeu a prática de uma habilidade muito específica”). O exercício de teste entre modelos (burro vs. perda de prática) é o pico de **autonomia cognitiva** do capítulo: o aluno escolhe explicação, não recebe veredito moral. Alinha com 517a sem personalizar terror.

### Beat 5 — A dívida com a cidade
Engajamento **estrutural**, fiel ao dossiê. Três camadas empilhadas (memória, custo, obrigação) com tensão explícita: “O medo dele não some. A obrigação fica em cima dele.” Isso evita heroísmo falso e evita culpa por hesitar. `anankē` aparece como necessidade imposta, não autoajuda. Exercício de ordenação causal reforça **competência** sobre a arquitetura do retorno, não sobre “ser boa pessoa”.

### Beat 6 — A descida
Engajamento **de fechamento com incerteza produtiva**. “Descer não é voltar atrás” fecha arco sem resolver o diálogo com os outros. Gancho (“O que acontecerá quando ele falar?”) é dúvida genuína, não “no próximo episódio”. Recompensa com destino real (`/inicio`) cumpre padrão Folio. Repetição de `katabainein` no Philoo ativa retrieval leve.

---

## Onde o engajamento corre risco de ser decorativo

| Beat | Risco | Gravidade | Nota |
|------|-------|-----------|------|
| 2 — Katabainein | Cartão conceitual sem movimento cognitivo | Baixa | Três `guide-voice` seguidos podem ser lidos e esquecidos se “Agora” soar abstrato demais. Mitigado pela frase anti-receita e pelo retorno da palavra no beat 6. |
| 5 — Retrato de Platão | Quebra de continuidade visual do prisioneiro | Baixa | Justificável: voz institucional da obrigação. Se a pose parecer julgamento, vira decoração moralizante. Manter tronco inclinado por peso, não por reprovação. |
| 6 — Corpo pequeno na escuridão | Imagem épica sem gancho cognitivo novo | Baixa | Serve fechamento emocional; o gancho está no texto, não só na imagem. |

---

## Dark patterns ou riscos

| Risco | Onde | Gravidade | Nota |
|-------|------|-----------|------|
| **Continuar visível antes do acerto** | Beats 3, 4, 5 (implementação) | Alta se violado | Roteiro não descreve UI, mas três exercícios novos exigem `action={canAdvance ? … : undefined}`. Continuar cinza = reprovação automática. |
| **Erro sem próximo toque óbvio** | Beats 3, 4, 5 (implementação) | Alta se violado | Beat 4 pede teste entre modelos: erro deve liberar outra alternativa na hora (`unlockOnMiss` ou equivalente). Flag no rodapé não conta. |
| **Ridículo virando vergonha do aluno** | Beat 4 | Média | “Os outros riem” duas vezes. Narrativa ok; exercício não pode punir escolha errada com tom de “você também seria gozado”. Feedback: “Ainda não é isso”, como em A Subida. |
| **Obrigação lida como culpa moral** | Beat 5 | Média | “A obrigação fica em cima dele” é pesado, mas fiel. Risco se UI ou takeaways da recompensa traduzirem como “você deve se sentir mal por saber mais”. Manter obrigação estrutural (519c–521b), não vergonha individual. |
| **517a como terror pessoal** | Beat 6 | Média | “Podem ser morto” é grave e deve permanecer. Está ancorado em “O texto não esconde o perigo” (alegoria + contexto histórico). Risco se implementação ou takeaways generalizarem para “dizer verdade sempre dá nisso”. |
| **Medo rotulado covardia** | — | Nenhuma detectada | Hesitação, medo persistente e readaptação são tratados como razoáveis em todos os beats. |
| **Pressão de retenção / streak / ranking** | — | Nenhuma detectada | Adequado ao contexto escolar. |
| **Travessão no copy do aluno** | — | Nenhuma detectada | Nota de implementação reforça ponto ou vírgula. |

---

## Medo de voltar: razoável vs. covardia

**Aprovado no roteiro.**

- Beat 1: hesitação, não heroísmo.
- Beat 3: custo sensorial ≠ fracasso pessoal.
- Beat 4: derrota no jogo ≠ burrice.
- Beat 5: medo e obrigação coexistem; nenhum apaga o outro.
- Beat 6: coragem como seguir com medo, não ausência de medo.

Nenhum beat pede que o aluno “supere a covardia” ou se sinta mal por hesitar. Alinha com `01-philosophy.md` §6 (“Responsabilidade sem culpa nem vergonha”).

---

## Ameaça de 517a: alegoria vs. terror pessoal

**Passa no texto, com ressalva de implementação.**

Platão cita o perigo dentro da alegoria (“Quem tenta soltar os outros…”), precedido de “O texto não esconde o perigo”. Isso mantém o registro histórico-textual (eco de Sócrates) sem converter em regra de vida para o adolescente.

**Ressalva:** na tela de recompensa, os três takeaways não devem reformular 517a como advertência existencial (“cuidado ao falar a verdade na escola”). Manter no plano da alegoria e do risco descrito no texto, como no dossiê §6.

**Conserto mínimo:** nenhum no roteiro narrativo. Se takeaways forem escritos depois, validar tom com este critério.

---

## `named-concept` — “Agora” sem lição de casa

**Aprovado.**

O bloco “Agora” do beat 2:
- mostra paralelo estrutural (aluno que aprende e volta a explicar);
- localiza a dificuldade no atravessar, não no conteúdo;
- fecha com “O texto não ensina como fazer isso. Só mostra que o movimento existe.”

Isso cumpre `FOLIO_CHAPTER_PATTERNS.md` (“Sem cartão de dicionário e sem receita de ‘como aplicar no dia a dia’”). Contraste saudável com Periagōgē (paralelo concreto + recorte visual): aqui o paralelo é mais abstrato, o que reduz risco de “faça assim na sua vida”, mas aumenta leve risco de passividade. Aceitável.

---

## Continuar escondido e feedback de erro

**Roteiro:** não viola (não menciona Continuar prematuro).  
**Pipeline downstream:** obrigatório nos beats 3, 4 e 5.

Checklist para exercise-designer / implementer:
1. Folio `Continuar` só após acerto em cada exercício.
2. Erro = outra alternativa imediata ou botão de retry visível como ação principal.
3. Beat 3 (revelação/recorte): erro não deve consumir “vidas” nem bloquear exploração.
4. Beat 4 (teste entre modelos): espelhar `PredictionConsequence` de A Subida.
5. Beat 5 (sequência causal): ligações erradas tremem e se soltam (padrão EX-09), Conferir visível sem scroll.

---

## Calibração 12–17 (tom e dificuldade)

| Aspecto | Avaliação |
|---------|-----------|
| **Tom** | História, não aula universitária. Frases curtas, Philoo objetivo, Platão em primeira pessoa acessível. |
| **Vocabulário** | `katabainein`, `anankē` com glossa imediata. Adequado. |
| **Complexidade** | Três camadas no beat 5 exigem atenção; o exercício de ordenação faz o trabalho cognitivo. |
| **Infantilização** | Ausente. |
| **Academismo** | Ausente no copy do aluno; referências Stephanus ficam no dossiê, não no roteiro. |
| **Uma ideia por tela** | Respeitada em todos os beats. |
| **Ritmo** | 6 beats: 2 narrativos puros, 1 conceitual, 3 narrativa+exercício, 1 fechamento. Proporção aceitável para escola (tolerância a repetição maior que app de lazer). |

---

## Calibração por beat de exercício (projeção)

### Beat 3 — Duas visões (revelação/recorte)
- **Nível:** moderado. **Adequado.**
- **SDT:** autonomia na exploração; competência ao distinguir perspectivas.
- **Risco:** tratar visão “pior” como erro moral. Feedback deve explicar diferença de adaptação, não de valor.

### Beat 4 — Teste entre modelos
- **Nível:** moderado. **Excelente calibração.**
- **SDT:** autonomia plena na escolha de explicação; pertencimento ao desarmar ridículo = burrice.
- **Risco:** único ponto onde vergonha social pode vazar na UI. Tom de Platão no modal “Como jogar” deve reforçar habilidades diferentes.

### Beat 5 — Ordenação das três camadas
- **Nível:** moderado-alto. **Adequado** como síntese antes do fechamento.
- **SDT:** competência integrativa; obrigação como terceira camada, não primeira (ordem importa pedagogicamente).
- **Risco:** ordem errada tratada como “não entendeu Platão”. Feedback: mostrar qual camada está fora de lugar e por quê, sem punição.

---

## Síntese SDT

| Dimensão | Avaliação |
|----------|-----------|
| **Autonomia** | Forte nos exercícios 4 e 5; narrativa de obrigação (beat 5) compensada se UI permitir ritmo próprio e retry sem penalidade. |
| **Competência** | Progressão clara: perspectiva (3) → modelo explicativo (4) → arquitetura causal (5). Vocabulário no beat 2. |
| **Pertencimento** | Medo normalizado; ridículo deslocado; medo + obrigação coexistem sem vergonha. |

**Retrieval espaçada:** beat 2 (`katabainein`) → beat 6; camadas do beat 5 ecoam beats 1, 3 e 4.  
**Incerteza genuína:** beat 6 deixa aberto o diálogo com os outros; trilogia fecha sem falsa resolução.

---

## Consertos mínimos (só se regra dura for violada na implementação)

Nenhuma reescrita obrigatória do roteiro narrativo.

| Se… | Beat | Conserto mínimo |
|-----|------|-----------------|
| Takeaways da recompensa generalizarem 517a | 6 (recompensa) | Uma linha: “No texto, quem tenta libertar os outros arrisca a própria vida. É parte da alegoria, não uma regra para cada conversa.” |
| “Agora” soar como dever escolar | 2 | Trocar “Um aluno que aprende…” por “Quem aprende algo novo e volta para um grupo que ainda não viu o mesmo…” (menos imperativo). Só se playtest mostrar leitura de dever. |
| Retrato de Platão no beat 5 parecer julgamento | 5 | Ajustar pose/descrição para “peso da lei”, não “desaprovação do prisioneiro”. |

---

## Recomendações para downstream (não reescrever roteiro)

1. **exercise-designer:** especificar `unlockOnMiss` / retry visível nos três exercícios; documentar regra de Continuar escondido.
2. **implementer:** validar overflow em 320px nos beats com exercício; Platão fora do tabuleiro nos modais de atividade.
3. **validator:** checar takeaways da recompensa contra tabela de riscos 517a e obrigação sem culpa.
4. **art-director:** beat 4 — riso dos outros sem humilhação visual extrema (prisioneiro de pé, fora do ritmo, não de joelhos).

---

## Apêndice — Filtragem de mecânicas (beats 3, 4, 5)

**Base:** `04-mechanic-concepts.md` filtrado contra `02-story.md` e esta revisão.  
**Pipeline para aqui.** Nenhuma mecânica está aprovada até escolha humana.

---

### Beat 3 — A escuridão de voltar

**Movimento do roteiro:** comparar duas visões do mesmo trecho (readaptação vs. olho acostumado); tropeço = custo sensorial, não fracasso.

| Conceito | Serve ao aprendizado vs. só prende | Culpa / vergonha | Clone de EX-02 / EX-04? |
|----------|-------------------------------------|------------------|-------------------------|
| **3-A — Lentes duplas** | **Aprendizado.** Alternar duas lentes sobre a mesma cena materializa o reframe antes do acerto. Autonomia na exploração; competência ao nomear a causa do tropeço. | **Baixo.** O roteiro e o feedback previstos deslocam culpa para adaptação. Risco só se a lente “pior” for tratada como resposta errada moral. | **Não é clone.** EX-02 desmonta mecanismo causal em sequência; EX-04 amplia recorte e pede revisão de interpretação. Aqui são duas leituras simultâneas do mesmo quadro, sem “o que estava fora”. |
| **3-B — Regiões interpretadas** | **Aprendizado parcial.** Reforça perspectiva por zona, mas 3–4 regiões numa tela quebra “uma ideia por tela” e dilui o gancho do tropeço na pedra. | **Baixo** se cada erro explicar adaptação, não incapacidade. | **Não é clone de motor**, mas a superfície (mapa de regiões anotadas) se aproxima de EX-02 na UI. Risco de implementação derivar para reveal sequencial por região. |
| **3-C — Par de quadros** | **Aprendizado**, se limitado ao trecho da pedra (como no roteiro). Dois quadros + frases é claro; escopo maior vira repetição de 3-A/3-B. | **Baixo** se feedback repetir “erro sensorial esperado, não moral”. | **Não é clone semântico** de EX-04 (não há crop → revelação → revisão). Pode gerar **déjà vu visual** (dois painéis lado a lado) para quem fez Dóxa. |

**Recomendação:** **3-A — inventar** motor de lentes comparativas.  
**Reusar ou inventar:** inventar (1 motor novo do capítulo).  
**Alternativa honesta:** 3-C restrito à pedra, se o humano preferir amarrar o exercício ao gesto narrativo literal em vez da cena inteira.

---

### Beat 4 — Os jogos de sombra

**Movimento do roteiro:** diante da evidência (errar, ser lento, ser gozado), escolher qual modelo explica melhor: “ficou burro” vs. “perdeu prática num jogo específico”.

| Conceito | Serve ao aprendizado vs. só prende | Culpa / vergonha | Notas |
|----------|-------------------------------------|------------------|-------|
| **4-A — Reusar EX-06 (invertido)** | **Aprendizado.** Pico de autonomia cognitiva do capítulo: evidência dada → modelo escolhido. Mesmo movimento de EX-06 (avaliar explicações concorrentes), direção invertida. | **Médio na copy, baixo na mecânica.** O rótulo “burro” espelha a crença falsa; feedback tem de ser “Ainda não é isso” + retry imediato, nunca “você também seria gozado”. | Reuso **honesto**: variante documentada, não novo ID decorativo. |
| **4-B — Mapear evidência → modelo** | **Aprendizado**, se o aluno processar vários indícios. Reforça competência (padrão convergente). | **Médio-alto** no item “ser gozado”: ridículo social não apoia limpo nenhum dos dois modelos; mal calibrado vira vergonha ou confusão. | Pode viver **dentro** de EX-06 como configuração multi-evidência; não precisa de motor novo. |
| **4-C — Escolha em imagem (hotspots)** | **Misto.** Hotspots na cena do riso tendem a **prender** (caça ao detalhe) mais do que ensinar, salvo briefing muito curto. | **Médio.** Clicar no riso pode reativar vergonha social se o feedback não deslocar na hora. | Conflita com preferência Folio de evitar zonas de imagem como tabuleiro (cf. EX-09). |

**Reusar EX-06 é honesto?** Sim. O movimento cognitivo do beat 4 é o mesmo domínio de EX-06: testar modelos concorrentes. Inverter prova (evidência → modelo, em vez de modelo → teste diagnóstico) é extensão legítima, desde que `unlockOnMiss`, Continuar escondido e briefing desarmem ridículo = burrice.

**Recomendação:** **4-A — reusar EX-06** (configuração evidence-to-model).  
**Reusar ou inventar:** reusar.  
**Alternativa:** 4-B só se o humano quiser múltiplas observações na mesma sessão; ainda enquadrado em EX-06, não motor novo.

---

### Beat 5 — A dívida com a cidade

**Movimento do roteiro:** empilhar três camadas na ordem de **peso estrutural** (memória → custo sensorial → obrigação/anankē), mantendo medo e dever como verdades simultâneas.

| Conceito | Serve ao aprendizado vs. só prende | Culpa / vergonha | Reuso de EX-03 |
|----------|-------------------------------------|------------------|----------------|
| **5-A — Camadas de uma decisão** | **Aprendizado.** Ordenação + feedback sobre peso crescente cumpre a síntese do capítulo. | **Médio.** “Obrigação em cima” é fiel ao texto; risco se ordem errada soar “não entendeu Platão” ou “deveria se sentir culpado”. Feedback: qual camada está fora e por quê, sem punição. | Motor de ordenação igual ao EX-03; diferença está no **feedback semântico** (peso estrutural, não causal física). |
| **5-B — Cadeia com setas de força** | **Decorativo provável.** “Esta camada basta sozinha?” adiciona carga sem o roteiro pedir; uma ideia a mais por tela. | **Baixo-médio.** Pode moralizar se “obrigação sozinha” for tratada como resposta certa única. | Não justifica motor novo para engajamento. |
| **5-C — Reusar EX-03** | **Aprendizado**, com ressalva de copy. Ordenar três blocos faz o trabalho cognitivo; o aluno já conhece o gesto de As Sombras. | **Médio** (mesmo de 5-A). Tolerância escolar a repetição de motor é **maior** que em app de lazer; aqui ajuda retrieval. | **Honesto**, se o feedback não falar em “cadeia causal quebrada” no sentido luz → sombra. Precisa dizer explicitamente: ordem pedagógica de peso, não cronologia pura. |

**Reusar EX-03 é honesto?** Sim, para o orçamento de **2 motores novos** (lentes no 3 + nenhum inventado no 4). A repetição do gesto “ordenar” é pedagógica, não lazy UI, desde que o modal “Como jogar” e o feedback diferenciem motivos de decisão de causas físicas.

**Recomendação:** **5-C — reusar EX-03** com feedback de camadas (mesmo conteúdo de 5-A, sem novo ID).  
**Reusar ou inventar:** reusar.  
**Alternativa:** promover a **5-A** como 2.º ou 3.º motor novo **só** se o humano quiser feedback e briefing dedicados a “peso estrutural” visualmente distintos do EX-03 de As Sombras; ganho de engajamento marginal frente ao custo de implementação.

---

### O que o humano deve escolher

Escolha **uma letra por beat** (3-A/B/C, 4-A/B/C, 5-A/B/C) e confirme o orçamento de motores novos:

| Opção | Beat 3 | Beat 4 | Beat 5 | Motores novos no capítulo |
|-------|--------|--------|--------|---------------------------|
| **A (recomendada)** | 3-A inventar | 4-A reusar EX-06 | 5-C reusar EX-03 | **1** (lentes comparativas) |
| **B** | 3-C inventar (pedra) | 4-B multi-evidência em EX-06 | 5-A inventar camadas | **2–3** |
| **C** | 3-B inventar | 4-C hotspots | 5-B setas de força | **1+**; 4-C e 5-B **não recomendados** por engajamento |

**Decisões explícitas pedidas:**

1. Beat 3: lentes na cena inteira (**3-A**) ou par de quadros só na pedra (**3-C**)?
2. Beat 4: uma evidência central (**4-A**) ou várias observações (**4-B**) dentro de EX-06?
3. Beat 5: EX-03 com feedback de peso (**5-C**) ou motor novo de camadas (**5-A**)?
4. Orçamento: **1 motor novo** (recomendado) ou **2–3**?

**Não avançar** para exercise-designer / implementer até resposta humana. Esta filtragem não formaliza props nem aprova catálogo.
