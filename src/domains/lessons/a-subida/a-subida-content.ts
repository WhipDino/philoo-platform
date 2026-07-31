import type { ASubidaSceneId } from "./a-subida-journey";

export type ASubidaSceneMeta = {
  eyebrow: string;
  title: string;
  context: string;
  footer: string;
  previousHref: string;
  nextHref?: string;
  nextLabel?: string;
};

export const A_SUBIDA_SCENE_META: Record<ASubidaSceneId, ASubidaSceneMeta> = {
  "primeiro-olhar": {
    eyebrow: "A Caverna de Platão · Capítulo 2",
    title: "Virar foi só o começo",
    context:
      "Uma nova direção não entrega respostas prontas. Primeiro, ela desorganiza o que parecia certo.",
    footer: "A dúvida encontra novas pistas",
    previousHref: "/aula/as-sombras/a-primeira-duvida",
    nextHref: "/aula/a-subida/o-fogo",
    nextLabel: "Olhar atrás da parede",
  },
  "o-fogo": {
    eyebrow: "A Subida · Atrás da parede",
    title: "A sombra tinha uma história",
    context:
      "Fogo, objeto e parede: aquilo que parecia uma coisa isolada fazia parte de um mecanismo.",
    footer: "A fonte aparece",
    previousHref: "/aula/a-subida/primeiro-olhar",
    nextHref: "/aula/a-subida/duas-explicacoes",
    nextLabel: "Testar as explicações",
  },
  "duas-explicacoes": {
    eyebrow: "Atividade · Modelos em disputa",
    title: "Qual pista separa duas explicações?",
    context:
      "Uma boa investigação não escolhe a frase mais bonita. Procura uma observação que faria diferença.",
    footer: "Seu teste fica registrado nesta tentativa",
    previousHref: "/aula/a-subida/o-fogo",
  },
  "a-subida-doi": {
    eyebrow: "A Subida · A passagem",
    title: "Nem toda dificuldade é um erro",
    context:
      "No relato de Platão, o prisioneiro é levado por uma subida íngreme. A luz primeiro dói e confunde.",
    footer: "O desconforto da mudança",
    previousHref: "/aula/a-subida/duas-explicacoes",
    nextHref: "/aula/a-subida/ate-onde-posso-afirmar",
    nextLabel: "Deixar os olhos se adaptarem",
  },
  "ate-onde-posso-afirmar": {
    eyebrow: "Atividade · Horizonte de evidências",
    title: "Até onde você pode afirmar?",
    context:
      "Cada nova etapa permite uma afirmação mais forte — mas não qualquer afirmação.",
    footer: "Precisão antes de certeza",
    previousHref: "/aula/a-subida/a-subida-doi",
  },
  periagoge: {
    eyebrow: "Uma palavra de Platão",
    title: "περιαγωγή",
    context:
      "Periagōgē: uma mudança de direção que envolve o olhar, o corpo e a maneira de compreender.",
    footer: "O conceito da jornada",
    previousHref: "/aula/a-subida/ate-onde-posso-afirmar",
    nextHref: "/aula/a-subida/aprender-a-ver",
    nextLabel: "Aprender a ver aos poucos",
  },
  "aprender-a-ver": {
    eyebrow: "A Subida · Fora da caverna",
    title: "Ver melhor exige tempo",
    context:
      "Platão descreve uma ordem: sombras, reflexos, objetos, céu noturno e, por fim, o Sol.",
    footer: "A visão se reorganiza",
    previousHref: "/aula/a-subida/periagoge",
    nextHref: "/aula/a-subida/revisar-o-mundo",
    nextLabel: "Revisar a explicação",
  },
  "revisar-o-mundo": {
    eyebrow: "Atividade · Revisão visível",
    title: "O que muda no seu modelo?",
    context:
      "Revisar não é apagar o que você pensava. É mostrar o que a nova evidência obrigou você a mudar.",
    footer: "Uma ideia em movimento",
    previousHref: "/aula/a-subida/aprender-a-ver",
  },
  "a-decisao": {
    eyebrow: "Fim do Capítulo 2",
    title: "Ele olha de volta",
    context:
      "Agora que conhece um mundo maior, o prisioneiro se lembra de quem ainda está diante da parede.",
    footer: "O Retorno começa aqui",
    previousHref: "/aula/a-subida/revisar-o-mundo",
  },
};

