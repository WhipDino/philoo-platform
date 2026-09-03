export const HERACLITUS_ASSETS = {
  efesoPanorama: {
    src: "/images/story/heraclitus/beat-02-efeso-panorama-v1.png",
    width: 2752,
    height: 1536,
    alt: "Éfeso imaginada: pedra clara, templo ao longe e rio cortando a cidade",
    focalPoint: { x: 0.5, y: 0.42 },
  },
  rioFluxo: {
    src: "/images/story/heraclitus/beat-03-rio-fluxo-v1.png",
    width: 2752,
    height: 1536,
    alt: "Alguém entra no rio mediterrâneo; a correnteza passa, o nome fica",
    focalPoint: { x: 0.5, y: 0.52 },
  },
  paraleloFluxo: {
    src: "/images/story/heraclitus/beat-04-paralelo-fluxo-v1.png",
    width: 2752,
    height: 1536,
    alt: "Paralelo de agora: feed, estação e corpo em movimento sugerido",
    focalPoint: { x: 0.5, y: 0.5 },
  },
} as const;

export type HeraclitusAssetKey = keyof typeof HERACLITUS_ASSETS;
