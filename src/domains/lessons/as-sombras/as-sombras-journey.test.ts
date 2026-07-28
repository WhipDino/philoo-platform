import { expect, it } from "vitest";
import { AS_SOMBRAS_JOURNEY_STAGES } from "./as-sombras-journey";

it("defines the complete nine-stage first cave lesson", () => {
  expect(AS_SOMBRAS_JOURNEY_STAGES.map((stage) => stage.id)).toEqual([
    "comeco",
    "descida",
    "quem-vive-aqui",
    "jogo-da-parede",
    "o-que-existe-atras",
    "caminho-da-sombra",
    "doxa",
    "o-que-chegou",
    "primeira-duvida",
  ]);
  expect(AS_SOMBRAS_JOURNEY_STAGES[3].sceneIds).toEqual([
    "eles-dao-nomes",
    "jogo-da-parede",
  ]);
  expect(AS_SOMBRAS_JOURNEY_STAGES.at(-1)?.href).toBe(
    "/aula/as-sombras/a-primeira-duvida",
  );
});
