# Padrão de personagem: Platão

Este documento define como criar novas poses do Platão sem perder sua
identidade visual nem a ligação com a cena.

## Única referência visual

Use sempre, e somente, `public/images/plato/reference/plato-canonical.png`
como referência de identidade. Uma pose gerada nunca deve servir de referência
para a próxima, pois isso acumula diferenças no rosto e nas proporções.

## Antes de gerar uma pose

1. Leia o texto e o estado exatos em que a imagem aparece.
2. Abra o componente da cena e confirme onde ficam Platão, diálogo, ilustração
   e atividade.
3. Defina para onde os olhos, o rosto, o tronco e as mãos devem conduzir.
4. Confira também o empilhamento mobile. Quando Platão fica abaixo do conteúdo,
   o olhar deve continuar levemente para cima.

“Direita” e “esquerda” sempre significam o que o estudante vê na tela, não o
lado anatômico do personagem.

## Identidade bloqueada

- filósofo adulto, baixo e largo, com aproximadamente 2,2–2,4 cabeças de altura;
- mesmo rosto redondo, olhos castanhos, sobrancelhas, nariz, cabelo, bigode e
  barba da referência;
- uma única coroa de louros, visível no lado direito da tela;
- manto roxo de um ombro com trança dourada, túnica marfim, cinto e sandálias;
- renderização 3D suave e detalhada, acolhedora sem parecer infantil;
- a pose pode mudar; rosto, idade, altura, proporções, roupa e materiais não.

## Contrato do arquivo: poses de cena

- corpo inteiro, sem cortes;
- PNG RGBA transparente;
- enquadramento consistente, com margem curta e uniforme;
- sem cenário, piso, sombra retangular, texto, logotipo ou outro personagem;
- caminho registrado em `src/domains/lessons/plato-pose-catalog.ts`;
- nome semântico ligado ao estado da cena, não apenas à emoção.

## Exceção documentada: retrato de atividade

Atividades que usam o padrão
`docs/product/activity-patterns/guided-classification-board.md` exigem um
retrato próprio de cabeça, ombros e parte superior do tronco. Essa imagem:

- continua usando somente a referência canônica;
- mostra expressão de fala e gesto compatível com a instrução;
- mantém PNG transparente e não inclui cenário ou moldura;
- é posicionada atrás da borda frontal do cartão para parecer sair dele;
- nunca aparece como cabeça solta ou busto flutuante;
- usa nome semântico específico de orientação de atividade.

Essa exceção não autoriza cortar poses de cena existentes. O retrato deve ser
gerado do zero para esse contrato e validado no cartão real.

## Validação obrigatória

- comparar rosto, altura e proporções com a referência canônica;
- confirmar direção do olhar e do gesto no layout real;
- verificar mãos, pés e bordas transparentes;
- confirmar apenas um louro, no lado direito da tela;
- testar a imagem na cena em desktop e no empilhamento responsivo;
- rejeitar e gerar novamente quando qualquer item falhar.

As versões anteriores foram retiradas do projeto para não serem reutilizadas
por engano. Elas continuam recuperáveis pelo histórico do Git.
