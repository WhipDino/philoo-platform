# Quando usar cada exercício

Ferramenta obrigatória do **exercise-designer**. Não escolha widget por
variedade. Comece do **movimento de pensamento** do beat no roteiro.

Os onze ids existem. Nem todos devem entrar em Tales. A Caverna usou vários
para **descobrir** a linguagem; depois dela, use só o que o gesto pede.

Fonte tipada (mesmos campos `reuseScope` / `whenToUse` / `doNotUseWhen`):
`src/domains/lesson-library/exercise-catalog.ts`.

## Como decidir

1. Leia o movimento no roteiro (uma frase).
2. Procure `reuseScope: "any-lesson"` que casa com essa frase.
3. Só então `when-move-fits`.
4. Nunca `avoid-by-default` sem pedido humano.
5. Um capítulo: **dois ou três** exercícios. Um só se houver um único gesto.
   Quatro ou mais: corte o roteiro. Rode `selectExercisesForChapter` com os
   `thinkingMove` dos beats e os EX das aulas anteriores da jornada.
6. História primeiro. Briefing: passos do motor + `purpose` desta cena.

## Mapa curto

| Id | Use quando o aluno precisa… | Não use quando… |
| --- | --- | --- |
| **EX-05** | classificar frases (viram / acharam / não podiam saber, ou equivalente) | a tarefa é só escolher uma de duas explicações (EX-06) |
| **EX-06** | escolher qual modelo explica a evidência (previsão / dois modelos) | há três pesos coexistindo (EX-11) ou uma cadeia A→B→C (EX-03) |
| **EX-09** | ligar pares (ideia–exemplo, nome–sentido) | a ordem é uma pilha de peso ou uma causa em linha |
| **EX-03** | ordenar uma cadeia causal | os itens **coexistem** (medo + dever); isso é EX-11 |
| **EX-11** | empilhar motivos do mais leve ao que pesa mais | a ordem é tempo/causa (EX-03) |
| **EX-10** | comparar **duas lentes da mesma cena** | as imagens são lugares ou tempos diferentes |
| **EX-01** | olhar uma imagem e escolher o rótulo certo em rodadas | precisa revelar pedaços do sistema (EX-02) |
| **EX-02** | revelar partes de **um** mecanismo na mesma imagem | o gesto é duas óticas (EX-10) ou só um quiz (EX-01) |
| **EX-04** | o enquadramento engana; o recuo mostra outra coisa | você só quer ensinar a palavra grega (`named-concept` basta) |
| **EX-07** | — | aula nova: evitar. Tela antiga da Subida, fora do rail |
| **EX-08** | — | aula nova: evitar. Idem; revisão já cabe em EX-06 / retry |

Preferidos nas aulas de filósofo: **EX-05, EX-06, EX-09, EX-03, EX-11**.
EX-10, EX-01, EX-02 e EX-04 só com o gesto **e** a arte. **EX-07 e EX-08
não entram no ecossistema** (telas antigas da Subida). Detalhe do que falta
para o visual viver só no motor: `docs/reference/SCALABLE_CONTENT_SYSTEM.md`.

## Preferência pós-Caverna

Qualidade primeiro: o gesto manda. Variedade depois: a função
`selectExercisesForChapter` penaliza o mesmo EX nas aulas recentes e empurra
um motor que está há tempo sem aparecer, **sem** trocar o gesto.

Pode repetir EX-06 em Tales e de novo em Heráclito se os dois tiverem o gesto
“duas explicações”. Variedade vazia é proibida; repetir o gesto certo não é.
