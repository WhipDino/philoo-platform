import type { CharacterId } from "@/domains/character-library";

export type PhilosopherCoinAsset = {
  src: string;
  alt: string;
};

/** Uma moeda dourada por filósofo — usada nos checkpoints do mapa. */
export const philosopherGoldCoins = {
  plato: {
    src: "/images/portal/coins/plato-gold-coin.png",
    alt: "Moeda dourada de Platão",
  },
  thales: {
    src: "/images/portal/coins/thales-gold-coin-v2.png",
    alt: "Moeda dourada de Tales",
  },
  heraclitus: {
    src: "/images/portal/coins/heraclitus-gold-coin-v2.png",
    alt: "Moeda dourada de Heráclito",
  },
} as const satisfies Partial<Record<CharacterId, PhilosopherCoinAsset>>;

export function getPhilosopherGoldCoin(
  characterId: CharacterId,
): PhilosopherCoinAsset | undefined {
  return philosopherGoldCoins[characterId as keyof typeof philosopherGoldCoins];
}
