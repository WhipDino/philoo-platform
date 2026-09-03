export const TALES_ASSETS = {
  portoMileto: {
    src: "/images/story/tales/beat-02-porto-mileto-v1.png",
    width: 2752,
    height: 1536,
    alt: "O porto de Mileto visto do cais: barcos, ânforas, gente em movimento e o mar no horizonte",
    focalPoint: { x: 0.5, y: 0.48 },
  },
  terraSobreAgua: {
    src: "/images/story/tales/beat-03-terra-sobre-agua-v1.png",
    width: 2752,
    height: 1536,
    alt: "Um pedaço de terra firme sobre um grande corpo de água, como se o chão se apoiasse no úmido",
    focalPoint: { x: 0.5, y: 0.52 },
  },
  mesaAlmoco: {
    src: "/images/story/tales/beat-04-mesa-almoco-v1.png",
    width: 2752,
    height: 1536,
    alt: "Uma mesa de almoço de agora, com pão, fruta e um copo de suco, muitas caras na mesma mesa",
    focalPoint: { x: 0.5, y: 0.5 },
  },
} as const;

export type TalesAssetKey = keyof typeof TALES_ASSETS;
