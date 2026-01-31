/**
 * Zod schema for Profile JSON validation
 */

import { z } from "zod";

// Skill Icon Schema
const skillIconSchema = z.object({
  name: z.string(),
  path: z.string(),
  darkPath: z.string().optional(),
  link: z.string().optional(),
});

// Social Profile Schema
const socialProfileSchema = z.object({
  label: z.string(),
  path: z.string(),
  darkPath: z.string().optional(),
  linkPrefix: z.string(),
  linkSuffix: z.string(),
  linkSuffixTwo: z.string().optional(),
});

// Badge Config Schemas
const badgeConfigSchema = z.object({
  selected: z.boolean(),
});

const githubStatsCardConfigSchema = badgeConfigSchema.extend({
  stars: z.boolean(),
  commits: z.boolean(),
  prs: z.boolean(),
  issues: z.boolean(),
  contribs: z.boolean(),
  privateCommits: z.boolean(),
});

const reposCardConfigSchema = badgeConfigSchema.extend({
  repoOne: z.string(),
  repoTwo: z.string().nullable(),
  repoThree: z.string().nullable(),
  repoFour: z.string().nullable(),
});

const cardStyleConfigSchema = z.object({
  selected: z.boolean(),
  titleColor: z.string(),
  titleColorEdit: z.boolean(),
  textColor: z.string(),
  textColorEdit: z.boolean(),
  iconColor: z.string(),
  iconColorEdit: z.boolean(),
  bgColor: z.string(),
  bgColorEdit: z.boolean(),
  hideBorder: z.boolean(),
  showIcons: z.boolean(),
});

// Introduction Schema
const introductionSchema = z.object({
  name: z.string(),
  avatarUrl: z.string().optional(),
  animatedHand: z.union([z.literal(0), z.literal(1)]),
  shortDescription: z.string(),
  longDescription: z.string(),
  location: z.string(),
  portfolioTitle: z.string(),
  portfolioLink: z.string(),
  emailMe: z.string(),
  workingOnTitle: z.string(),
  workingOnLink: z.string(),
  learning: z.string(),
  collaborateOn: z.string(),
  additionalInfo: z.string(),
});

// Support Profile Schema
const supportProfileSchema = z.object({
  path: z.string(),
  previewIMG: z.string(),
  linkPrefix: z.string(),
  linkSuffix: z.string(),
});

// Profile Data Schema
const profileDataSchema = z.object({
  introduction: introductionSchema,
  skills: z.record(z.string(), z.array(skillIconSchema)),
  socials: z.record(z.string(), socialProfileSchema),
  badges: z.object({
    twitterFollowers: badgeConfigSchema,
    githubFollowers: badgeConfigSchema,
    githubVisits: badgeConfigSchema,
    githubStatsCard: githubStatsCardConfigSchema,
    githubCommitsGraph: badgeConfigSchema,
    githubStreak: badgeConfigSchema,
    twitchStatus: badgeConfigSchema,
    topLangsCard: badgeConfigSchema,
    reposCard: reposCardConfigSchema,
    cardStyle: cardStyleConfigSchema,
  }),
  support: z.record(z.string(), supportProfileSchema),
  sectionOrder: z.array(z.string()),
  socialOrder: z.array(z.string()),
  skillsOrder: z.array(z.string()),
});

// Render Options Schema
const renderOptionsSchema = z.object({
  readmeTemplate: z.string().optional(),
  readmeOptions: z.record(z.any(), z.any()).optional(),
});

// Portfolio Options Schema
const portfolioOptionsSchema = z.object({
  template: z.string().optional(),
  font: z.string().optional(), // Google Font name
  accentColor: z.string().optional(), // Hex color code
  options: z.record(z.any(), z.any()).optional(),
});

// Main Profile JSON Schema
export const profileJsonSchema = z.object({
  schemaVersion: z.number(),
  updatedAt: z.string(), // ISO 8601
  generator: z.object({
    name: z.literal("ProfileMe.dev"),
    version: z.string().optional(),
  }),
  profile: profileDataSchema,
  render: renderOptionsSchema,
  portfolio: portfolioOptionsSchema.optional(),
});

// Type inference from schema
export type ProfileJson = z.infer<typeof profileJsonSchema>;
export type ProfileData = z.infer<typeof profileDataSchema>;
export type IntroductionData = z.infer<typeof introductionSchema>;
