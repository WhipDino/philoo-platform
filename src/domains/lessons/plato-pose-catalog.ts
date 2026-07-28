export const PLATO_POSES = {
  invitation: {
    src: "/images/story/plato-v2/plato-invitation-v3.png",
    alt: "Platão abre as mãos e convida você a entrar na história",
  },
  descent: {
    src: "/images/story/plato-v2/plato-descent-v2.png",
    alt: "Platão guia você pela descida com uma lamparina e aponta o caminho",
  },
  "deeper-entrance-fades": {
    src: "/images/story/plato-v2/plato-deeper-entrance-fades-v2.png",
    alt: "Platão olha para a entrada que ficou para trás e guia você adiante",
  },
  "prisoners-empathy": {
    src: "/images/story/plato-v2/plato-prisoners-empathy-v2.png",
    alt: "Platão observa os prisioneiros com cuidado e aponta para eles",
  },
  "first-wall-reveal": {
    src: "/images/story/plato-v2/plato-first-wall-reveal-v2.png",
    alt: "Platão apresenta a parede iluminada com a mão aberta",
  },
  "observe-with-them": {
    src: "/images/story/plato-v2/plato-observe-with-them-v2.png",
    alt: "Platão se abaixa para observar a parede na altura dos prisioneiros",
  },
  "listening-prisoner": {
    src: "/images/story/plato-v2/plato-listening-prisoner-v2.png",
    alt: "Platão se inclina com atenção para ouvir o prisioneiro",
  },
  "shadow-expert": {
    src: "/images/story/plato-v2/plato-shadow-expert-v2.png",
    alt: "Platão reconhece com respeito quem aprendeu a prever as sombras",
  },
  "appearance-source": {
    src: "/images/story/plato-v2/plato-appearance-source-v2.png",
    alt: "Platão liga com um gesto a sombra ao que pode existir atrás dela",
  },
  "first-question": {
    src: "/images/story/plato-v2/plato-first-question-v2.png",
    alt: "Platão pensa por um instante e oferece uma pergunta a você",
  },
  "diagnose-anomaly": {
    src: "/images/story/plato-v2/plato-diagnose-anomaly-v2.png",
    alt: "Platão compara uma pista com a explicação e convida você a investigar",
  },
  "prediction-model": {
    src: "/images/story/plato-v2/plato-prediction-model-v2.png",
    alt: "Platão indica uma ligação do modelo e projeta o resultado com a mão",
  },
  "review-evidence": {
    src: "/images/story/plato-v2/plato-review-evidence-v2.png",
    alt: "Platão apresenta as cartas da atividade e convida você a examiná-las",
  },
  "review-argument": {
    src: "/images/story/plato-v2/plato-review-argument-v2.png",
    alt: "Platão acolhe seu argumento e pede uma nova pista para testá-lo",
  },
  "celebrate-discovery": {
    src: "/images/story/plato-v2/plato-celebrate-discovery-v2.png",
    alt: "Platão reconhece com alegria tranquila a descoberta feita por você",
  },
  "gentle-retry": {
    src: "/images/story/plato-v2/plato-gentle-retry-v2.png",
    alt: "Platão indica a atividade com cuidado e convida você a olhar novamente",
  },
  "revision-change": {
    src: "/images/story/plato-v2/plato-revision-change-v2.png",
    alt: "Platão marca com a mão uma mudança feita a partir de uma nova pista",
  },
  "revision-maintain": {
    src: "/images/story/plato-v2/plato-revision-maintain-v2.png",
    alt: "Platão equilibra com as mãos a ideia inicial e as evidências",
  },
  "revision-uncertainty": {
    src: "/images/story/plato-v2/plato-revision-uncertainty-v2.png",
    alt: "Platão pensa e abre a mão em direção ao próximo teste possível",
  },
  "frame-versus-claim": {
    src: "/images/story/plato-v2/plato-frame-versus-claim-v2.png",
    alt: "Platão forma um enquadramento com as mãos e aponta para o que ficou de fora",
  },
} as const;

export type PlatoPoseKey = keyof typeof PLATO_POSES;

export function getPlatoPose(key: PlatoPoseKey) {
  return PLATO_POSES[key];
}
