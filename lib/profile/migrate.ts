/**
 * Profile JSON Migration System
 * 
 * Handles migrations between schema versions.
 * Each migration function transforms data from version N to N+1.
 */

import { profileJsonSchema, ProfileJson } from "./schema";

const CURRENT_SCHEMA_VERSION = 1;

/**
 * Migrate profile JSON to current schema version
 */
export function migrateProfileJson(data: any): ProfileJson {
  const version = data.schemaVersion || 0;

  if (version === CURRENT_SCHEMA_VERSION) {
    // Already at current version, just validate
    return profileJsonSchema.parse(data);
  }

  // Apply migrations sequentially
  let migrated = data;
  for (let v = version; v < CURRENT_SCHEMA_VERSION; v++) {
    migrated = applyMigration(migrated, v, v + 1);
  }

  // Validate final result
  return profileJsonSchema.parse(migrated);
}

/**
 * Apply migration from one version to the next
 */
function applyMigration(data: any, fromVersion: number, toVersion: number): any {
  switch (fromVersion) {
    case 0:
      // Migration from legacy format (old LocalStorage) to v1
      return migrateFromLegacyToV1(data);
    case 1:
      // Future migrations go here
      return data;
    default:
      throw new Error(`Unknown migration path: ${fromVersion} -> ${toVersion}`);
  }
}

/**
 * Migrate from legacy LocalStorage format to Profile JSON v1
 * 
 * Legacy format had:
 * - _version: "1.0.0" (string)
 * - Mixed UI state with profile data
 * - No schemaVersion, updatedAt, generator fields
 */
function migrateFromLegacyToV1(legacyData: any): ProfileJson {
  const now = new Date().toISOString();

  // Extract profile data from legacy state
  const profile = {
    introduction: legacyData.introduction || {
      name: "",
      animatedHand: 0,
      shortDescription: "",
      longDescription: "",
      location: "",
      portfolioTitle: "",
      portfolioLink: "",
      emailMe: "",
      workingOnTitle: "",
      workingOnLink: "",
      learning: "",
      collaborateOn: "",
      additionalInfo: "",
    },
    skills: legacyData.skills || {},
    socials: legacyData.socials || {},
    badges: legacyData.badges || {
      twitterFollowers: { selected: false },
      githubFollowers: { selected: false },
      githubVisits: { selected: false },
      githubStatsCard: {
        selected: false,
        stars: true,
        commits: true,
        prs: true,
        issues: true,
        contribs: true,
        privateCommits: true,
      },
      githubCommitsGraph: { selected: false },
      githubStreak: { selected: false },
      twitchStatus: { selected: false },
      topLangsCard: { selected: false },
      reposCard: {
        selected: false,
        repoOne: "",
        repoTwo: null,
        repoThree: null,
        repoFour: null,
      },
      cardStyle: {
        selected: false,
        titleColor: "0891b2",
        titleColorEdit: false,
        textColor: "ffffff",
        textColorEdit: false,
        iconColor: "0891b2",
        iconColorEdit: false,
        bgColor: "1c1917",
        bgColorEdit: false,
        hideBorder: true,
        showIcons: true,
      },
    },
    support: legacyData.support || {},
    sectionOrder: legacyData.sectionOrder || [
      "introduction",
      "skills",
      "socials",
      "badges",
      "support",
    ],
    socialOrder: legacyData.socialOrder || [],
    skillsOrder: legacyData.skillsOrder || [],
  };

  // Fix reposCard typo (reporFour -> repoFour)
  if (profile.badges.reposCard && "reporFour" in profile.badges.reposCard) {
    profile.badges.reposCard.repoFour = profile.badges.reposCard.reporFour;
    delete profile.badges.reposCard.reporFour;
  }

  return {
    schemaVersion: 1,
    updatedAt: now,
    generator: {
      name: "ProfileMe.dev",
    },
    profile,
    render: {
      readmeTemplate: "default",
      readmeOptions: {},
    },
    portfolio: undefined,
  };
}

/**
 * Get default empty profile JSON
 */
export function getDefaultProfileJson(): ProfileJson {
  const now = new Date().toISOString();

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    updatedAt: now,
    generator: {
      name: "ProfileMe.dev",
    },
    profile: {
      introduction: {
        name: "",
        animatedHand: 0,
        shortDescription: "",
        longDescription: "",
        location: "",
        portfolioTitle: "",
        portfolioLink: "",
        emailMe: "",
        workingOnTitle: "",
        workingOnLink: "",
        learning: "",
        collaborateOn: "",
        additionalInfo: "",
      },
      skills: {},
      socials: {},
      badges: {
        twitterFollowers: { selected: false },
        githubFollowers: { selected: false },
        githubVisits: { selected: false },
        githubStatsCard: {
          selected: false,
          stars: true,
          commits: true,
          prs: true,
          issues: true,
          contribs: true,
          privateCommits: true,
        },
        githubCommitsGraph: { selected: false },
        githubStreak: { selected: false },
        twitchStatus: { selected: false },
        topLangsCard: { selected: false },
        reposCard: {
          selected: false,
          repoOne: "",
          repoTwo: null,
          repoThree: null,
          repoFour: null,
        },
        cardStyle: {
          selected: false,
          titleColor: "0891b2",
          titleColorEdit: false,
          textColor: "ffffff",
          textColorEdit: false,
          iconColor: "0891b2",
          iconColorEdit: false,
          bgColor: "1c1917",
          bgColorEdit: false,
          hideBorder: true,
          showIcons: true,
        },
      },
      support: {},
      sectionOrder: ["introduction", "skills", "socials", "badges", "support"],
      socialOrder: [],
      skillsOrder: [],
    },
    render: {
      readmeTemplate: "default",
      readmeOptions: {},
    },
    portfolio: {
      template: "minimal",
      options: {},
    },
  };
}
