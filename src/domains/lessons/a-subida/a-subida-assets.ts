export const A_SUBIDA_ASSETS = {
  depoisDaVirada: {
    src: "/images/story/a-subida/beat-01-depois-da-virada-v1.png",
    width: 1672,
    height: 941,
    alt: "O prisioneiro, ainda de joelhos no chão da caverna, vira o corpo para trás enquanto a luz do fogo pinta a pedra ao redor",
    focalPoint: { x: 0.45, y: 0.62 },
  },
  fogoEEstatuas: {
    src: "/images/story/a-subida/beat-02-fogo-e-estatuas-v1.png",
    width: 1672,
    height: 941,
    alt: "O prisioneiro em pé atrás da parede baixa vê o fogo alto, as figuras que carregam objetos e as sombras que esses objetos projetam",
    focalPoint: { x: 0.58, y: 0.55 },
  },
  aSubidaDolorosa: {
    src: "/images/story/a-subida/beat-03-a-subida-dolorosa-v1.png",
    width: 1672,
    height: 941,
    alt: "O prisioneiro sobe uma rampa rochosa e íngreme protegendo os olhos com um braço, enquanto a luz da entrada cresce à sua frente",
    focalPoint: { x: 0.58, y: 0.48 },
  },
  platoOfuscado: {
    src: "/images/story/a-subida/beat-04-plato-ofuscado-v1.png",
    width: 1024,
    height: 1024,
    alt: "Platão estende as mãos abertas na direção de um cartão de conceito, apresentando a palavra periagōgē",
    focalPoint: { x: 0.5, y: 0.42 },
  },
  sombrasLaFora: {
    src: "/images/story/a-subida/beat-05-sombras-la-fora-v1.png",
    width: 1672,
    height: 941,
    alt: "Do lado de fora da caverna, o prisioneiro senta-se em uma pedra baixa e olha hesitante para a sombra projetada no chão sob a luz do crepúsculo",
    focalPoint: { x: 0.4, y: 0.55 },
  },
  reflexosNaAgua: {
    src: "/images/story/a-subida/beat-06-reflexos-na-agua-v1.png",
    width: 1672,
    height: 941,
    alt: "O prisioneiro se ajoelha à beira da água e aponta do reflexo de uma árvore e de uma pedra para os objetos reais acima da margem",
    focalPoint: { x: 0.42, y: 0.58 },
  },
  objetosEstrelasELua: {
    src: "/images/story/a-subida/beat-07-objetos-estrelas-e-lua-v1.png",
    width: 1672,
    height: 941,
    alt: "O prisioneiro, de pé no mundo aberto, estende a mão em direção a uma árvore e a uma pedra reais sob um céu noturno com estrelas e lua crescente",
    focalPoint: { x: 0.55, y: 0.55 },
  },
  oSol: {
    src: "/images/story/a-subida/beat-08-o-sol-v1.png",
    width: 1672,
    height: 941,
    alt: "Ao amanhecer, o prisioneiro protege os olhos com uma mão diante do sol nascente, mas mantém o olhar firme",
    focalPoint: { x: 0.4, y: 0.45 },
  },
} as const;

export type ASubidaAssetKey = keyof typeof A_SUBIDA_ASSETS;
