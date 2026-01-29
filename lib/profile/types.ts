/**
 * Profile JSON Types
 * 
 * This is the canonical JSON structure for ProfileMe.dev profiles.
 * All users (free + sponsors) use this structure internally.
 * Markdown is generated from this JSON.
 */

export interface ProfileJson {
  schemaVersion: number;
  updatedAt: string; // ISO 8601 string
  generator: {
    name: "ProfileMe.dev";
    version?: string;
  };
  profile: ProfileData;
  render: RenderOptions;
  portfolio?: PortfolioOptions;
}

export interface ProfileData {
  introduction: IntroductionData;
  skills: SkillsData;
  socials: SocialsData;
  badges: BadgesData;
  support: SupportData;
  // Ordering preferences
  sectionOrder: string[];
  socialOrder: string[];
  skillsOrder: string[];
}

export interface IntroductionData {
  name: string;
  animatedHand: 0 | 1; // 0 = emoji, 1 = animated gif
  shortDescription: string;
  longDescription: string;
  location: string;
  portfolioTitle: string;
  portfolioLink: string;
  emailMe: string;
  workingOnTitle: string;
  workingOnLink: string;
  learning: string;
  collaborateOn: string;
  additionalInfo: string;
}

export interface SkillsData {
  [category: string]: SkillIcon[];
}

export interface SkillIcon {
  name: string;
  path: string;
  darkPath?: string;
  link?: string;
}

export interface SocialsData {
  [platform: string]: SocialProfile;
}

export interface SocialProfile {
  label: string;
  path: string;
  darkPath?: string;
  linkPrefix: string;
  linkSuffix: string;
  linkSuffixTwo?: string;
}

export interface BadgesData {
  twitterFollowers: BadgeConfig;
  githubFollowers: BadgeConfig;
  githubVisits: BadgeConfig;
  githubStatsCard: GitHubStatsCardConfig;
  githubCommitsGraph: BadgeConfig;
  githubStreak: BadgeConfig;
  twitchStatus: BadgeConfig;
  topLangsCard: BadgeConfig;
  reposCard: ReposCardConfig;
  cardStyle: CardStyleConfig;
}

export interface BadgeConfig {
  selected: boolean;
}

export interface GitHubStatsCardConfig extends BadgeConfig {
  stars: boolean;
  commits: boolean;
  prs: boolean;
  issues: boolean;
  contribs: boolean;
  privateCommits: boolean;
}

export interface ReposCardConfig extends BadgeConfig {
  repoOne: string;
  repoTwo: string | null;
  repoThree: string | null;
  repoFour: string | null;
}

export interface CardStyleConfig {
  selected: boolean;
  titleColor: string;
  titleColorEdit: boolean;
  textColor: string;
  textColorEdit: boolean;
  iconColor: string;
  iconColorEdit: boolean;
  bgColor: string;
  bgColorEdit: boolean;
  hideBorder: boolean;
  showIcons: boolean;
}

export interface SupportData {
  [platform: string]: SupportProfile;
}

export interface SupportProfile {
  path: string;
  previewIMG: string;
  linkPrefix: string;
  linkSuffix: string;
}

export interface RenderOptions {
  readmeTemplate?: string; // Default template identifier
  readmeOptions?: {
    [key: string]: any;
  };
}

export interface PortfolioOptions {
  template?: string;
  font?: string; // Google Font name (e.g., "Inter", "Roboto", "Open Sans")
  accentColor?: string; // Hex color code (e.g., "#3b82f6")
  options?: {
    [key: string]: any;
  };
}
