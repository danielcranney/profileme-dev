/**
 * LocalStorage helpers for Profile JSON
 * 
 * Storage keys:
 * - profileme.profileJson: Canonical profile JSON (all users)
 * - profileme.githubCache.sha: Last known SHA for .profile/profile.json (sponsors)
 * - profileme.githubCache.etag: Last known ETag (sponsors)
 * - profileme.githubCache.lastCheckAt: Timestamp of last GitHub check (sponsors)
 */

import { ProfileJson } from "./schema";
import { migrateProfileJson, getDefaultProfileJson } from "./migrate";
import { profileJsonSchema } from "./schema";

// Storage keys
export const STORAGE_KEYS = {
  PROFILE_JSON: "profileme.profileJson",
  GITHUB_SHA: "profileme.githubCache.sha",
  GITHUB_ETAG: "profileme.githubCache.etag",
  GITHUB_LAST_CHECK: "profileme.githubCache.lastCheckAt",
  // Legacy key (for migration)
  LEGACY_STATE: "ProfileMe_LocalState",
} as const;

/**
 * Load profile JSON from LocalStorage
 * Handles migration from legacy format if needed
 */
export function loadProfileJson(): ProfileJson | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    // Try new format first
    const jsonString = localStorage.getItem(STORAGE_KEYS.PROFILE_JSON);
    if (jsonString) {
      const parsed = JSON.parse(jsonString);
      return migrateProfileJson(parsed);
    }

    // Try legacy format for migration
    const legacyString = localStorage.getItem(STORAGE_KEYS.LEGACY_STATE);
    if (legacyString) {
      const legacyData = JSON.parse(legacyString);
      const migrated = migrateProfileJson(legacyData);
      
      // Save in new format and remove legacy
      saveProfileJson(migrated);
      localStorage.removeItem(STORAGE_KEYS.LEGACY_STATE);
      
      return migrated;
    }

    return null;
  } catch (error) {
    console.error("Error loading profile JSON from LocalStorage:", error);
    return null;
  }
}

/**
 * Save profile JSON to LocalStorage
 */
export function saveProfileJson(profileJson: ProfileJson): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    // Update timestamp
    const updated: ProfileJson = {
      ...profileJson,
      updatedAt: new Date().toISOString(),
    };

    // Validate before saving
    profileJsonSchema.parse(updated);

    localStorage.setItem(STORAGE_KEYS.PROFILE_JSON, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving profile JSON to LocalStorage:", error);
    throw error;
  }
}

/**
 * Get default profile JSON (creates new if none exists)
 */
export function getProfileJson(): ProfileJson {
  const existing = loadProfileJson();
  if (existing) {
    return existing;
  }

  const defaultProfile = getDefaultProfileJson();
  saveProfileJson(defaultProfile);
  return defaultProfile;
}

/**
 * Clear profile JSON from LocalStorage
 */
export function clearProfileJson(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(STORAGE_KEYS.PROFILE_JSON);
  localStorage.removeItem(STORAGE_KEYS.LEGACY_STATE);
}

// GitHub cache helpers (for sponsors)

/**
 * Get last known SHA for .profile/profile.json
 */
export function getLastKnownSha(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(STORAGE_KEYS.GITHUB_SHA);
}

/**
 * Set last known SHA
 */
export function setLastKnownSha(sha: string): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEYS.GITHUB_SHA, sha);
}

/**
 * Get last known ETag
 */
export function getLastKnownEtag(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(STORAGE_KEYS.GITHUB_ETAG);
}

/**
 * Set last known ETag
 */
export function setLastKnownEtag(etag: string): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEYS.GITHUB_ETAG, etag);
}

/**
 * Get timestamp of last GitHub check
 */
export function getLastGitHubCheckAt(): number | null {
  if (typeof window === "undefined") {
    return null;
  }

  const timestamp = localStorage.getItem(STORAGE_KEYS.GITHUB_LAST_CHECK);
  return timestamp ? parseInt(timestamp, 10) : null;
}

/**
 * Set timestamp of last GitHub check
 */
export function setLastGitHubCheckAt(timestamp: number = Date.now()): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEYS.GITHUB_LAST_CHECK, timestamp.toString());
}

/**
 * Clear all GitHub cache
 */
export function clearGitHubCache(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(STORAGE_KEYS.GITHUB_SHA);
  localStorage.removeItem(STORAGE_KEYS.GITHUB_ETAG);
  localStorage.removeItem(STORAGE_KEYS.GITHUB_LAST_CHECK);
}
