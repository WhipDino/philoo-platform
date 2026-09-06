import { libraryGroups } from "@/domains/curriculum-catalog/library-catalog";
import { getPathMapTrail } from "./student-path-map-content";

/** Grupo da biblioteca → trilha de moedas (1 mapa por módulo). */
export const libraryTrailByGroup = {
  cave: "saindo-da-caverna",
  presocratics: "primeiros-pensadores",
} as const;

export type LibraryModuleId = keyof typeof libraryTrailByGroup;

export function getTrailIdForLibraryGroup(groupId: string): string | null {
  if (groupId in libraryTrailByGroup) {
    return libraryTrailByGroup[groupId as LibraryModuleId];
  }
  return null;
}

export function getLibraryGroupForTrailId(trailId: string): LibraryModuleId | null {
  const entry = Object.entries(libraryTrailByGroup).find(([, id]) => id === trailId);
  return entry ? (entry[0] as LibraryModuleId) : null;
}

export function getActiveLibraryModuleId(): LibraryModuleId {
  const current = libraryGroups.find((group) => group.status === "current");
  if (current && current.id in libraryTrailByGroup) {
    return current.id as LibraryModuleId;
  }
  return "cave";
}

export function buildLibraryModuleUrl(moduleId: string): string {
  return `/inicio?view=explore&module=${moduleId}`;
}

export function buildTrailUrl(trailId?: string): string {
  const resolved =
    trailId ?? getTrailIdForLibraryGroup(getActiveLibraryModuleId()) ?? "saindo-da-caverna";
  return `/inicio?view=trail&trail=${resolved}`;
}

export function resolveTrailIdFromParam(trailParam: string | null): string {
  if (trailParam && getPathMapTrail(trailParam)) {
    return trailParam;
  }
  return getTrailIdForLibraryGroup(getActiveLibraryModuleId()) ?? "saindo-da-caverna";
}

export function isLibraryModuleMapAvailable(groupId: string): boolean {
  const trailId = getTrailIdForLibraryGroup(groupId);
  if (!trailId) {
    return false;
  }
  const trail = getPathMapTrail(trailId);
  return Boolean(trail && trail.status !== "coming" && trail.status !== "locked");
}
