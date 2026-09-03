export const O_RETORNO_ASSETS = {
  bocaDaCaverna: {
    src: "/images/story/o-retorno/beat-01-boca-da-caverna-v1.png",
    width: 2752,
    height: 1536,
    alt: "O prisioneiro parado na boca da caverna, a luz do dia atrás dele, o corpo já voltado para a escuridão adiante",
    focalPoint: { x: 0.5, y: 0.48 },
  },
  lenteOlhoReadaptando: {
    src: "/images/story/o-retorno/beat-03-lente-olho-readaptando-v3.png",
    width: 2752,
    height: 1536,
    alt: "O prisioneiro entra na caverna quase escura, os olhos semicerrados, tentando enxergar sem fogueira nem tocha",
    label: "Olho readaptando",
    caption: "O olho que acabou de sair da luz do dia",
  },
  lenteOlhoAcostumado: {
    src: "/images/story/o-retorno/beat-03-lente-olho-acostumado-v3.png",
    width: 2752,
    height: 1536,
    alt: "A mesma entrada da caverna, um pouco mais clara, com pinturas e sombras visíveis na parede",
    label: "Olho acostumado",
    caption: "O olho de quem já vê no escuro",
  },
  oTropeco: {
    src: "/images/story/o-retorno/beat-03-o-tropeco-v3.png",
    width: 2752,
    height: 1536,
    alt: "O prisioneiro no chão da caverna quase escura, as mãos na pedra em que acabou de tropeçar, só um fio de luz numa fresta",
    focalPoint: { x: 0.5, y: 0.55 },
  },
  jogosDeSombra: {
    src: "/images/story/o-retorno/beat-04-jogos-de-sombra-v4.png",
    width: 2752,
    height: 1536,
    alt: "O prisioneiro de túnica azul clara em pé, tentando nomear uma sombra, enquanto só dois amigos sentados, de amarelo e de vermelho, ainda olham a parede",
    focalPoint: { x: 0.5, y: 0.5 },
  },
  aDescida: {
    src: "/images/story/o-retorno/beat-06-a-descida-v1.png",
    width: 2752,
    height: 1536,
    alt: "O prisioneiro pequeno no quadro, descendo pelo caminho escuro, a luz do dia encolhendo atrás dele",
    focalPoint: { x: 0.48, y: 0.5 },
  },
} as const;

export type ORetornoAssetKey = keyof typeof O_RETORNO_ASSETS;
