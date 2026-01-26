/**
 * JavaScript adapter for Profile JSON system
 * 
 * This allows existing JavaScript code to use the TypeScript profile system.
 * Next.js will handle the TypeScript imports.
 */

// Re-export storage functions
export {
  loadProfileJson,
  saveProfileJson,
  getProfileJson,
  clearProfileJson,
  getLastKnownSha,
  setLastKnownSha,
  getLastKnownEtag,
  setLastKnownEtag,
  getLastGitHubCheckAt,
  setLastGitHubCheckAt,
  clearGitHubCache,
  STORAGE_KEYS,
} from "./storage";

// Re-export renderer
export { renderReadme } from "./renderer";

// Re-export portfolio renderer
export { renderPortfolio } from "./portfolio";

// Re-export migration
export { migrateProfileJson, getDefaultProfileJson } from "./migrate";

// Re-export state bridge
export {
  stateToProfileJson,
  profileJsonToState,
  syncStateToJson,
  loadJsonToState,
} from "./stateBridge";

// Re-export schema for validation
export { profileJsonSchema } from "./schema";
