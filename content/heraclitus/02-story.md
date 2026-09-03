# Heráclito de Éfeso: Roteiro narrativo

**Jornada:** Depois da Caverna (filósofos)  
**Capítulo:** Heráclito de Éfeso (aula completa, um tema)  
**Público:** 12 a 17 anos, escolas brasileiras  
**Guia:** Heráclito, em 1ª pessoa de si. Platão não narra.  
**Palavra-conceito:** πάντα ῥεῖ (*panta rhei*). Fogo é imagem da resposta, não o vocábulo da tela `named-concept`.  
**Rail:** 6 rotas Folio. História antes do exercício. Sem travessão no texto do aluno.  
**Fonte da tese:** fragmentos citados por autores posteriores (DK 22B12, B49a para o rio; B30 para o fogo). A fórmula exata *panta rhei* é resumo tardio.

Este roteiro não escolhe motor de exercício. Nos beats de prática há só o `thinkingMove`.

---

## Ficha visual do guia (vale em todo beat)

Heráclito fala na camada de UI. **Nunca** entra colado no panorama 16:9.

Proposta Philoo (fisionomia é invenção pedagógica, não retrato):

- Homem maduro, pele mediterrânea quente, **barba castanha cacheada**, olhar atento.
- **Túnica escura**, **manto terracota** com borda que lembra chamas (sem auréola, sem fogo literal na mão).
- **Sem púrpura. Sem louros. Sem toga de senador romano.**
- Âncora de identidade: `heraclitus-identity-anchor-v1.png`, chroma `#00FF00`, mãos vazias ou abertas. Toda pose seguinte edita a partir dela.
- Se parecer Platão ou Tales com túnica trocada, a arte falhou.

Cidade: Éfeso imaginada, **rio** visível, pedra clara, templo ao longe, luz quente mediterrânea. Sem placa de museu, sem skyline moderno, **sem texto na imagem**.

---

## Mapa do rail (6 rotas / sceneIds)

| # | sceneId | Estágio | Templates |
|---|---------|---------|-----------|
| 1 | `ola` | Eu sou Heráclito | `guide-voice` |
| 2 | `efeso` | Éfeso e o movimento | `story-panel`, `guide-voice` |
| 3 | `o-rio` | O mesmo rio, outras águas | `guide-voice`, `story-panel` (`historia_contada`) |
| 4 | `panta-rhei` | Panta rhei | `named-concept` (3 momentos) |
| 5 | `praticar` | Praticar o fluxo | `guide-voice` + 2 pontos de exercício |
| 6 | `fecho` | E o que fica? | `guide-voice`, `reward` |

Rotas sugeridas: `/aula/heraclitus/ola` … `/aula/heraclitus/fecho`. Destino de reward: `/inicio`.

---

## Rota 1: `ola`

**Tipo:** apresentação  
**ideia do estágio:** um guia novo assume a sala; ponte curta com quem veio de Tales; Heráclito se apresenta.

### Beat 1.1 — Olá

**sceneId:** `ola`  
**Template:** `guide-voice`  
**poseId:** `identity-anchor`  
**guideSide:** `end`  
**necessidade_de_imagem:** `personagem_isolado`  
**actionLabel:** Continuar

**Título:** Olá, eu sou Heráclito  
**Lead:** Se o fundo é um, ainda falta ver como ele se move. Olá, eu sou Heráclito.

**O que o aluno sente:** reconhecimento do Folio e a troca de voz. A ponte com Tales cabe numa frase, sem recontar Mileto.  
**thinkingMove:** nenhum

---

### Beat 1.2 — De onde eu vim

**sceneId:** `ola`  
**Template:** `guide-voice`  
**poseId:** `point-river`  
**guideSide:** `start`  
**necessidade_de_imagem:** `personagem_isolado`  
**actionLabel:** Ver Éfeso

**Título:** Eu vim de Éfeso  
**Lead:** Eu vim de Éfeso, na Jônia, onde o rio passa o dia inteiro e nunca traz a mesma água duas vezes. Fiquei conhecido por insistir: tudo flui, mesmo quando parece parado.

**O que o aluno sente:** curiosidade pelo lugar, ainda sem o quadro. O rio entra como paisagem da vida dele, não como tese ainda.  
**thinkingMove:** nenhum

---

## Rota 2: `efeso`

**Tipo:** o lugar e o movimento escondido  
**ideia do estágio:** o aluno **vê** Éfeso; o que parece firme também muda.

### Beat 2.1 — A cidade

**sceneId:** `efeso`  
**Template:** `story-panel`  
**poseId:** `present-panel`  
**guideSide:** `start`  
**imageKey:** `efesoPanorama`  
**necessidade_de_imagem:** `cena_completa`  
**actionLabel:** Continuar

**Text:** Olha Éfeso. Pedra clara, templo ao longe, o rio cortando a cidade.

**Descrição da imagem:** Éfeso jônia imaginada, 16:9, luz quente mediterrânea. Rio visível, pedras claras, templo distante, gente em movimento leve. Sem Heráclito no quadro. Sem texto.

**O que o aluno sente:** estar na cidade com ele, sem ele desenhado dentro do rio.  
**thinkingMove:** nenhum

---

### Beat 2.2 — Mesmo parado, mudando

**sceneId:** `efeso`  
**Template:** `guide-voice`  
**poseId:** `open-hands-flow`  
**guideSide:** `end`  
**necessidade_de_imagem:** `nenhuma`  
**actionLabel:** Continuar

**Título:** Mesmo parado, mudando  
**Lead:** A pedra parece firme. Mas ela desgasta, esquenta, esfria, fica molhada quando chove. O que parece parado também está em movimento, só que em ritmos diferentes.

**O que o aluno sente:** a tese entra pelo corpo, não por fórmula. Ainda sem a palavra grega.  
**thinkingMove:** nenhum

---

### Beat 2.3 — Opostos que se ligam

**sceneId:** `efeso`  
**Template:** `guide-voice`  
**poseId:** `opposites-gesture`  
**guideSide:** `start`  
**necessidade_de_imagem:** `nenhuma`  
**actionLabel:** Ir ao rio

**Título:** Dia e noite se puxam  
**Lead:** Dia e noite não são inimigos soltos. Quente e frio também se respondem. Eu chamo isso de harmonia de tensão, como o arco que só funciona puxando para lados opostos.

**O que o aluno sente:** o mundo não é caos puro; opostos fazem parte do mesmo fio.  
**thinkingMove:** nenhum

Nota: fogo (B30) fica implícito no manto com borda de chamas, não como beat separado. Não vira palavra da barra dourada.

---

## Rota 3: `o-rio`

**Tipo:** a crença central contada como caso  
**ideia do estágio:** o rio ensina o paradoxo do “mesmo” que nunca é idêntico.

### Beat 3.1 — O que eu insisto

**sceneId:** `o-rio`  
**Template:** `guide-voice`  
**poseId:** `hold-paradox`  
**guideSide:** `end`  
**necessidade_de_imagem:** `personagem_isolado`  
**actionLabel:** Continuar

**Título:** O que eu insisto  
**Lead:** Eu insisto numa coisa que parece estranha: você pode entrar duas vezes no mesmo rio e, mesmo assim, nunca encontrar a mesma água.

**O que o aluno sente:** curiosidade pelo caso concreto antes do desenho.  
**thinkingMove:** nenhum

---

### Beat 3.2 — Entrar no rio

**sceneId:** `o-rio`  
**Template:** `story-panel`  
**poseId:** `present-panel`  
**guideSide:** `start`  
**imageKey:** `rioFluxo`  
**necessidade_de_imagem:** `historia_contada`  
**actionLabel:** Continuar

**Text:** Entra alguém no rio. A água corre. O nome “rio” fica, a água não.

**Descrição da imagem:** rio mediterrâneo reconhecível, 16:9. Uma figura entrando na água (pé ou perna visível), correnteza clara, pedras na margem. **Sem** Heráclito colado no quadro. A cena mostra o **caso** que ele conta, não um extra genérico. Sem texto.

**O que o aluno sente:** vê o caso antes de ouvir a fórmula. O guia narrega ao lado.  
**thinkingMove:** nenhum

---

### Beat 3.3 — O mesmo nome, outra água

**sceneId:** `o-rio`  
**Template:** `guide-voice`  
**poseId:** `point-river`  
**guideSide:** `start`  
**necessidade_de_imagem:** `nenhuma`  
**actionLabel:** Continuar

**Título:** O mesmo nome, outra água  
**Lead:** Nós ainda dizemos “o mesmo rio”. Mas quem entra encontra águas novas. O nome segue. A substância não.

**O que o aluno sente:** o paradoxo cabe na cabeça sem virar truque de linguagem vazio.  
**thinkingMove:** nenhum

---

### Beat 3.4 — Fragmentos, não diário

**sceneId:** `o-rio`  
**Template:** `guide-voice`  
**poseId:** `open-hands-flow`  
**guideSide:** `end`  
**necessidade_de_imagem:** `nenhuma`  
**actionLabel:** Ouvir o nome disso

**Título:** O que sobrou de mim  
**Lead:** Meu livro se perdeu. Só restaram frases citadas por outros. Não tenho diário do rio. Tenho gestos como este, repetidos até virarem provérbio.

**O que o aluno sente:** honestidade sobre a fonte. A ideia vale mesmo sem o texto original inteiro.  
**thinkingMove:** nenhum

---

## Rota 4: `panta-rhei`

**Tipo:** inserção conceitual (`named-concept`, `tone="concept"`, `moment="concept"`)  
**ideia do estágio:** nomear a **crença** de que tudo flui. Fogo continua imagem, não palavra da barra.

A palavra entra **depois** de o rio já ter sido visto e contado.

### Beat 4.1 — A palavra

**sceneId:** `panta-rhei`  
**Template:** `guide-voice` (`named-concept`, momento 1)  
**poseId:** `present-word`  
**guideSide:** `end`  
**moment:** `concept`  
**necessidade_de_imagem:** `nenhuma`  
**actionLabel:** Continuar

**Título:** Panta rhei  
**Lead:** Essa crença tem um nome: panta rhei. Em grego, πάντα ῥεῖ. Tudo flui: nada fica idêntico. Não é o nome do fogo. É o nome do tipo de coisa em que eu acredito.

**O que o aluno sente:** “isso tem nome”, sem cartão de dicionário.  
**thinkingMove:** nenhum

Nota de honestidade (pode ir em guidance curta se couber, ou ficar só neste dossiê): a fórmula exata *panta rhei* **não aparece** nos fragmentos autênticos; é resumo tardio. O gesto vem dos fragmentos do rio.

---

### Beat 4.2 — Esta cena

**sceneId:** `panta-rhei`  
**Template:** `guide-voice` (`named-concept`, momento 2)  
**poseId:** `point-river`  
**guideSide:** `start`  
**moment:** `concept`  
**necessidade_de_imagem:** `nenhuma`  
**actionLabel:** Continuar

**Título:** No rio, tudo flui  
**Lead:** No rio de Éfeso o nome “rio” permanece. A água não. Panta rhei nomeia isso: o que parece o mesmo também está trocando por dentro.

**O que o aluno sente:** a palavra cola no rio que ele já viu.  
**thinkingMove:** nenhum

---

### Beat 4.3 — Agora

**sceneId:** `panta-rhei`  
**Template:** `story-panel` (`named-concept`, momento 3)  
**poseId:** `present-panel`  
**guideSide:** `start`  
**imageKey:** `paraleloFluxo`  
**moment:** `concept`  
**necessidade_de_imagem:** `cena_completa`  
**actionLabel:** Praticar o fluxo

**Text:** O feed atualiza. Seu corpo troca células. A estação muda de roupa. A forma é a mesma: o nome fica, o conteúdo corre.

**Descrição da imagem:** paralelo de agora, 16:9: celular com feed em scroll leve **ou** composição que una relógio/estação/corpo em movimento sugerido (folhas, roupa de inverno vs verão). Sem Heráclito no quadro. Sem rótulos. Sem receita de “como aplicar no dia a dia”.

**O que o aluno sente:** a **estrutura** da ideia no presente, não dever de casa.  
**thinkingMove:** nenhum

Não traduzir panta rhei por entropia, átomo, Big Bang ou “mindfulness”.

---

## Rota 5: `praticar`

**Tipo:** ensinar o aluno, depois dois exercícios  
**ideia do estágio:** o gesto já apareceu na cena; agora o aluno pratica **distinguir** o que parece fixo do que muda e **escolher** como ouvir o “mesmo rio”.  
O guia **não** entra no tabuleiro. Pose só na voz e no modal “Como jogar”, se houver.

### Beat 5.1 — Nome e substância

**sceneId:** `praticar`  
**Template:** `guide-voice` curto, depois ponto de exercício  
**poseId:** `hold-paradox`  
**guideSide:** `start`  
**necessidade_de_imagem:** `nenhuma`  
**actionLabel:** Separar nome e substância

**Título:** Nome e substância  
**Lead:** Vamos separar. Uma coisa é o nome que ficou. Outra é a água, o corpo, o feed, que já trocou.

**Copy do Philoo (camada “por que nesta cena”, uma ou duas frases):**

Nesta cena o que permanece de nome e o que muda de fato não são a mesma coisa.

**O que o aluno sente:** alívio de ter nomes para duas camadas que estavam misturadas.  
**thinkingMove:** `classify`

**Gesto para o exercise-designer:** o aluno classifica frases ou pares em dois grupos equivalentes a (1) só o **nome** ou a forma que parece estável, (2) a **substância** ou o conteúdo que já mudou. Exemplos de conteúdo, não de motor: “Ainda chamamos de rio.” / “A água que passou ontem já foi embora.” / “A pedra parece a mesma.” / “Grãos se soltaram dela.” Feedback sem punição. Continuar do Folio só no acerto.

---

### Beat 5.2 — Exercício 1 (placeholder)

**sceneId:** `praticar`  
**Template:** ponto de exercício (motor a definir pelo exercise-designer)  
**actionLabel:** Continuar

**Nota:** implementação local conforme `thinkingMove: classify`. Briefing com `purpose`, passos e `startLabel: Separar nome e substância`.

---

### Beat 5.3 — Dois jeitos de ouvir o rio

**sceneId:** `praticar`  
**Template:** `guide-voice` curto, depois ponto de exercício  
**poseId:** `opposites-gesture`  
**guideSide:** `start`  
**necessidade_de_imagem:** `nenhuma`  
**actionLabel:** Escolher um jeito

**Título:** Dois jeitos de ouvir  
**Lead:** Tem gente que me ouve assim: se a água muda, não é mais o mesmo rio. Eu não disse isso. Eu disse: o nome fica, a água corre.

**Copy do Philoo (purpose da cena):**

Há dois jeitos de ouvir a cena do rio. Só um casa com o que Heráclito acabou de contar.

**O que o aluno sente:** a tese deixa de ser extravagância; dá para discordar sem rir de quem viu o movimento.  
**thinkingMove:** `compare-models`

**Gesto para o exercise-designer:** o aluno escolhe qual modelo explica a evidência da cena. Modelo A: rio diferente a cada instante, o nome é engano. Modelo B: o nome permanece enquanto a substância flui. O que casa é B. Sem transformar Heráclito em físico moderno. Sem “ele é confuso” como gabarito.

---

### Beat 5.4 — Exercício 2 (placeholder)

**sceneId:** `praticar`  
**Template:** ponto de exercício (motor a definir pelo exercise-designer)  
**actionLabel:** Continuar

**Nota:** implementação local conforme `thinkingMove: compare-models`. Briefing com `startLabel: Escolher um jeito`. Pode reutilizar `imageKey: rioFluxo` no enunciado se couber.

---

## Rota 6: `fecho`

**Tipo:** gancho honesto, recompensa  
**ideia do estágio:** se tudo flui, será que nada fica? Dúvida genuína, sem spoiler de outro filósofo.

### Beat 6.1 — Gancho

**sceneId:** `fecho`  
**Template:** `guide-voice`  
**poseId:** `hook-open`  
**guideSide:** `end`  
**necessidade_de_imagem:** `personagem_isolado`  
**actionLabel:** Continuar

**Título:** E o que fica?  
**Lead:** Se tudo flui, será que nada fica de verdade? Eu insisto no movimento. Ainda não fecho essa conta.

**O que o aluno sente:** dúvida genuína, sem trailer, sem “no próximo episódio”.  
**thinkingMove:** nenhum

Não nomear Parmênides, Demócrito nem outros pré-socráticos. Não “corrigir” o fluxo com átomos no fecho.

---

### Beat 6.2 — Uma linha antes da recompensa

**sceneId:** `fecho`  
**Template:** `guide-voice`  
**poseId:** `identity-anchor`  
**guideSide:** `end`  
**necessidade_de_imagem:** `nenhuma`  
**actionLabel:** Continuar

**Título:** O que você levou  
**Lead:** Você já pode olhar o que parece parado e perguntar o que está correndo por baixo. Panta rhei fica comigo como nome. O que permanece, a gente ainda olha.

**O que o aluno sente:** fechamento justo. Ele pode duvidar e ainda ter aprendido o gesto.  
**thinkingMove:** nenhum

---

### Beat 6.3 — Recompensa

**sceneId:** `fecho`  
**Template:** `reward`  
**necessidade_de_imagem:** `nenhuma`  
**actionLabel:** Voltar ao meu caminho

**Copy do Philoo (chrome da recompensa):**

Pontos de descoberta. Distintivo deste capítulo. Três lembretes. Destino: `/inicio`. Não inventar rota da aula seguinte.

**Takeaways (texto do aluno):**

1. Panta rhei é a crença de que tudo flui: o nome pode ficar enquanto a substância muda.
2. O rio ensina: “o mesmo” no linguajar não é “o mesmo” na água.
3. Insistir no movimento não é dizer que buscar o que permanece é inútil.

**O que o aluno sente:** fechamento com ganho claro.  
**thinkingMove:** nenhum

---

## Catálogo de imageKeys (story-panels)

| imageKey | Rota | Uso |
|----------|------|-----|
| `efesoPanorama` | `efeso` | Cidade 16:9, beat 2.1 |
| `rioFluxo` | `o-rio` | História contada do rio, beat 3.2; opcional no exercício 5.4 |
| `paraleloFluxo` | `panta-rhei` | Paralelo de agora, beat 4.3 |

---

## Catálogo de poseIds sugeridos

| poseId | whenToUse |
|--------|-----------|
| `identity-anchor` | Apresentação, fecho (existente no catálogo) |
| `point-river` | Indicar o rio ou a cena que virá |
| `present-panel` | Apresentar quadro 16:9 |
| `open-hands-flow` | Mostrar movimento, fluxo, ritmos diferentes |
| `hold-paradox` | Segurar pergunta ou paradoxo do “mesmo” |
| `opposites-gesture` | Dia/noite, quente/frio, tensão harmoniosa |
| `present-word` | Momento da palavra panta rhei |
| `hook-open` | Gancho final, conta aberta |

---

## Notas para os agentes seguintes

- **Engajamento:** Continuar do Folio escondido enquanto o exercício não estiver certo. Erro sem punição. Sem cliffhanger de desenho.
- **Exercício:** ler os dois `thinkingMove` (`classify`, `compare-models`). Não inventar motor. História já mostrou o gesto no rio.
- **Arte:** âncora isolada no beat 1.1; poses seguintes a partir dela. Quadros: Éfeso (2.1), rio com figura entrando (3.2, `historia_contada`), paralelo de agora (4.3). Heráclito fora dos três panoramas.
- **Implementação:** seis rotas (`ola`, `efeso`, `o-rio`, `panta-rhei`, `praticar`, `fecho`), um filósofo no acervo no mesmo commit das rotas. Recompensa no padrão Tales / Caverna. Destino `/inicio`.
- **Não fazer:** Platão narrando; Lição 4 da Caverna; nomear Tales, Parmênides ou Demócrito; fogo como palavra da barra dourada; travessão no texto do aluno.

---

## Checklist de voz

- [ ] Ponte com Tales: uma frase só, no beat 1.1 (sem nomear Tales).
- [ ] Heráclito em 1ª pessoa de si; 3ª pessoa só no caso do rio (“entra alguém”).
- [ ] Sem travessão em texto do aluno.
- [ ] Uma ideia por tela.
- [ ] Palavra da barra dourada: panta rhei, não fogo.
- [ ] Ficha visual (terracota, barba cacheada, sem púrpura) estável em todo beat.
- [ ] Beat 3.2 marcado `historia_contada`.
