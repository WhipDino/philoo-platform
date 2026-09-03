# Aula de um filósofo (depois da Caverna)

Ferramenta obrigatória do **story-writer**, **philosophy-specialist**,
**art-director** e **exercise-designer** em qualquer capítulo que não seja
As Sombras, A Subida ou O Retorno.

A Caverna ensinou a duvidar da primeira aparência. Daqui em diante **cada
capítulo é um filósofo e o tema dele, completo**. Não abra três aulas para
a mesma ideia. Seja conciso; não coma o que o aluno precisa para entender.

Detalhe do fio: `docs/reference/STORY_THREAD.md`.
Escolha de exercício: `docs/reference/EXERCISE_SELECTION.md`.
Layout: `docs/reference/FOLIO_LAYOUT_CONTRACT.md`.

## Quem guia

O guia da aula é **sempre o filósofo daquela aula**. Tales guia Tales.
Heráclito guia Heráclito. Platão não narra os pré-socráticos.

Na Caverna, Platão **contava** o prisioneiro em 3ª pessoa. Aqui o filósofo
fala em **1ª pessoa** de si: “Olá, eu sou Tales. Eu vim de Mileto.” Quando
ele conta um caso sobre outra pessoa ou sobre o mundo, aí sim 3ª pessoa.

## Tamanho

Espelho de um capítulo da Caverna: cerca de **5 a 7 estágios no rail**,
não dez rotas. Uma ideia por tela. Cabe em uma sessão de aula.

Ordem típica (ajuste se o dossiê pedir, não invente um segundo capítulo):

1. **Apresentação** — `guide-voice`. Só o filósofo + texto. Nome, de onde
   veio, o que o tornou conhecido. Biografia curta para 12–17 anos. Sem
   tratado, sem data demais, sem lista de obras.
2. **A cidade / o lugar** — `story-panel`. Enquanto ele fala de onde veio,
   o aluno **vê** a cidade (ou o porto, o rio, o mercado). Imagem 16:9 ao
   lado da voz. Pose alinhada ao que ele diz.
3. **O que ele acreditava** — o fio: uma crença central, em linguagem de
   criança, ligada ao porquê ele ficou famoso.
4. **A palavra-conceito** — `named-concept` (palavra → esta cena → agora).
5. **Ensinar o aluno** — o paralelo de agora mostra a **estrutura** da ideia,
   não um dever de casa.
6. **Dois ou três exercícios** do catálogo (`selectExercisesForChapter`), só
   depois que a cena mostrou o gesto. Depois fecho + `reward`.

Pré-socráticos: pouca ênfase em vida íntima. O peso está em **por que ficou
famoso** e **no que acreditava**.

## A palavra

Tem de ser o **conceito da crença**, não um grego decorativo.

- Tales: o que ele dizia que o mundo era (ex.: *arché*), não “viajar” em grego.
- Se o tema é paradoxo, a palavra é o paradoxo (em grego **ou** só em
  português, com a glossa). Não empilhe dois conceitos na mesma tela.
- Três momentos: a palavra → o que ela faz nesta cena → um paralelo de agora.
- Se a glossa cabe em “isso só quer dizer que ele estava andando”, troque a
  palavra.

O philosophy-specialist **escolhe essa palavra no dossiê** e justifica. O
story-writer não troca por outra mais “bonita”.

## Imagens e poses

- **Filósofo isolado** (`personagem_isolado`): fundo chroma `#00FF00`, depois
  o script de transparência. A primeira pose isolada é a **âncora de
  identidade**. Toda pose seguinte edita a partir dela. Gesto combina com a
  fala (explicar, apontar para a cidade, surpresa), no mesmo espírito das
  mãos nos olhos do Platão na luz.
- **Cidade, panorama, cena da ideia** (`cena_completa`): 16:9, **sem** chroma.
  O filósofo da aula **não é colado** dentro do panorama; ele fica na camada
  UI, como Platão na Caverna.
- Estilo: mesmo universo chibi/Pixar (`plato-reference-01.jpeg` como âncora
  de mundo). Roupa e rosto do novo filósofo vêm da ficha do roteiro + âncora
  isolada.
- Sem texto na imagem. Várias poses são esperadas. Não recicle teaching-pointer.

### História que o filósofo conta

Muitos filósofos ensinam com um caso (Aquiles e a tartaruga, o rio, o feixe
de palha). Se a cena pede que o aluno **veja** o caso, isso é
`cena_completa` 16:9, **sem** chroma, **sem** o filósofo colado no quadro.

A figura da história deve ser reconhecível, não um extra genérico: Aquiles
como o corredor da história que a criança já ouviu (armadura, corrida), a
tartaruga como tartaruga, o rio como rio. O art-director ancora no
referente cultural conhecido, no mesmo estilo chibi/Pixar do mundo Philoo.
O guia continua na camada UI, ao lado, narrando.

O story-writer marca `necessidade_de_imagem: historia_contada` nesse beat.
Sem essa marca, o art-director não inventa um desenho “bonito” no lugar do
conceito.

O implementer registra o filósofo em `src/domains/character-library/` (como
Platão) e um catálogo de poses. A cena não hardcoda caminho de arquivo.

## Primeira aula depois da Caverna

Tales de Mileto. Não recapitule o mito inteiro. No máximo uma frase de
ponte (“você viu que a primeira imagem não era o mundo inteiro”) e o Tales
assume. Quem já fez a Caverna reconhece o Folio; o guia é outro.

## O que o pipeline ainda não faz sozinho

O objetivo é você não vigiar cada tela. Mesmo assim o fluxo **para** se:

- o catálogo não cobrir o gesto (não inventar EX-12);
- o dossiê não tiver certeza da fonte;
- o arquivo de arte marcar `dúvida`;
- o validador achar overflow, Continuar cedo, ou copy com travessão.

A primeira âncora visual de um filósofo novo é gerada sem pausa humana,
salvo `dúvida`. Se o rosto sair errado, o validador aponta; não peça três
variações no art-director.
