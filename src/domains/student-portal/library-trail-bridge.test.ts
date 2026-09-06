import { describe, expect, it } from "vitest";
import {
  buildLibraryModuleUrl,
  buildTrailUrl,
  getActiveLibraryModuleId,
  getTrailIdForLibraryGroup,
  isLibraryModuleMapAvailable,
  resolveTrailIdFromParam,
} from "./library-trail-bridge";

describe("libraryTrailBridge", () => {
  it("maps library groups to coin-map trails", () => {
    expect(getTrailIdForLibraryGroup("cave")).toBe("saindo-da-caverna");
    expect(getTrailIdForLibraryGroup("presocratics")).toBe("primeiros-pensadores");
    expect(getTrailIdForLibraryGroup("helenism")).toBeNull();
  });

  it("builds explore URLs with module scope", () => {
    expect(buildLibraryModuleUrl("cave")).toBe("/inicio?view=explore&module=cave");
  });

  it("builds trail URLs for the active module", () => {
    expect(buildTrailUrl()).toBe("/inicio?view=trail&trail=saindo-da-caverna");
    expect(buildTrailUrl("primeiros-pensadores")).toBe(
      "/inicio?view=trail&trail=primeiros-pensadores",
    );
    expect(resolveTrailIdFromParam(null)).toBe("saindo-da-caverna");
  });

  it("uses the current module for active trail links", () => {
    expect(getActiveLibraryModuleId()).toBe("cave");
    expect(isLibraryModuleMapAvailable("cave")).toBe(true);
    expect(isLibraryModuleMapAvailable("presocratics")).toBe(true);
  });
});
