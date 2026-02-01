/**
 * Bridge between old state format and new JSON format
 * 
 * This allows gradual migration:
 * - Reducer continues to work with old state shape (for UI state)
 * - Profile data is synced to/from JSON format
 * - Eventually, reducer will work directly with JSON
 */

import { loadProfileJson, saveProfileJson, getProfileJson } from "./storage";
import { migrateProfileJson } from "./migrate";

/**
 * Convert old state format to Profile JSON
 * Preserves portfolio and render settings from saved JSON if they exist
 */
export function stateToProfileJson(state) {
  const now = new Date().toISOString();

  // Load saved JSON to preserve portfolio template and render settings
  const savedJson = loadProfileJson();

  // Ensure introduction has all required fields with defaults
  const introduction = state.introduction || {};
  const introductionWithDefaults = {
    name: introduction.name || "",
    avatarUrl: introduction.avatarUrl || undefined,
    animatedHand: introduction.animatedHand !== undefined ? introduction.animatedHand : 0,
    shortDescription: introduction.shortDescription || "",
    longDescription: introduction.longDescription || "",
    location: introduction.location || "",
    portfolioTitle: introduction.portfolioTitle || "",
    portfolioLink: introduction.portfolioLink || "",
    emailMe: introduction.emailMe || "",
    workingOnTitle: introduction.workingOnTitle || "",
    workingOnLink: introduction.workingOnLink || "",
    learning: introduction.learning || "",
    collaborateOn: introduction.collaborateOn || "",
    additionalInfo: introduction.additionalInfo || "",
  };

  return {
    schemaVersion: 1,
    updatedAt: now,
    generator: {
      name: "ProfileMe.dev",
    },
    profile: {
      introduction: introductionWithDefaults,
      skills: state.skills || {},
      socials: state.socials || {},
      badges: state.badges || {},
      support: state.support || {},
      sectionOrder: state.sectionOrder || [],
      socialOrder: state.socialOrder || [],
      skillsOrder: state.skillsOrder || [],
    },
    render: savedJson?.render || {
      readmeTemplate: "default",
      readmeOptions: {},
    },
    portfolio: savedJson?.portfolio || {
      template: "minimal",
      font: "Inter",
      accentColor: "#3b82f6",
      options: {},
    },
  };
}

/**
 * Convert Profile JSON to old state format (for reducer compatibility)
 * Merges with existing UI state
 */
export function profileJsonToState(profileJson, existingState = {}) {
  if (!profileJson || !profileJson.profile) {
    return existingState;
  }

  const { profile } = profileJson;

  // Merge socials: defaults (e.g. cal) + saved, then remove deprecated polywork
  const mergedSocials = {
    ...(existingState.socials || {}),
    ...(profile.socials || {}),
  };
  delete mergedSocials.polywork;

  // socialOrder: use saved or default, remove polywork, ensure cal present
  let socialOrder = (profile.socialOrder || existingState.socialOrder || []).filter(
    (k) => k !== "polywork"
  );
  if (socialOrder.length > 0 && !socialOrder.includes("cal")) {
    const linkedinIdx = socialOrder.indexOf("linkedin");
    const insertAt = linkedinIdx >= 0 ? linkedinIdx + 1 : 0;
    socialOrder = [...socialOrder.slice(0, insertAt), "cal", ...socialOrder.slice(insertAt)];
  }

  return {
    ...existingState,
    // Profile data from JSON
    introduction: profile.introduction || existingState.introduction,
    skills: profile.skills || existingState.skills,
    socials: mergedSocials,
    badges: profile.badges || existingState.badges,
    support: profile.support || existingState.support,
    sectionOrder: profile.sectionOrder || existingState.sectionOrder,
    socialOrder: socialOrder.length > 0 ? socialOrder : existingState.socialOrder,
    skillsOrder: profile.skillsOrder || existingState.skillsOrder,
    // Keep UI state from existing state
    section: existingState.section,
    renderMode: existingState.renderMode,
    sidebarOpen: existingState.sidebarOpen,
    popOutMenuOpen: existingState.popOutMenuOpen,
    modal: existingState.modal,
    _version: existingState._version || "1.0.0",
  };
}

/**
 * Sync state to JSON (called after state updates)
 * Preserves portfolio and render settings from saved JSON
 */
export function syncStateToJson(state) {
  try {
    // Load existing JSON to preserve portfolio template and render settings
    const existingJson = loadProfileJson();
    const profileJson = stateToProfileJson(state);
    
    // Preserve portfolio and render settings if they exist in saved JSON
    if (existingJson) {
      profileJson.portfolio = existingJson.portfolio || profileJson.portfolio;
      profileJson.render = existingJson.render || profileJson.render;
    }
    
    saveProfileJson(profileJson);
  } catch (error) {
    console.error("Error syncing state to JSON:", error);
  }
}

/**
 * Load JSON and merge with existing state
 */
export function loadJsonToState(existingState = {}) {
  try {
    const profileJson = loadProfileJson();
    if (profileJson) {
      return profileJsonToState(profileJson, existingState);
    }
  } catch (error) {
    console.error("Error loading JSON to state:", error);
  }
  return existingState;
}
