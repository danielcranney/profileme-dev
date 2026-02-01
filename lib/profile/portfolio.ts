/**
 * Portfolio Renderer
 * 
 * Generates a GitHub Pages-compatible HTML portfolio from Profile JSON.
 * Supports multiple templates.
 */

import type { ProfileJson } from "./types";
import { renderPortfolioWithTemplate } from "./portfolio-templates";

export { getOrderedLinkBlocks } from "./portfolio-templates";
export type { LinkBlock, LinkOptions } from "./portfolio-templates";

/**
 * Render portfolio HTML from Profile JSON
 */
export function renderPortfolio(profileJson: ProfileJson): string {
  const { portfolio } = profileJson;

  // Get portfolio template (default to "minimal")
  const template = (portfolio?.template || "minimal") as "minimal" | "modern" | "classic";

  return renderPortfolioWithTemplate(profileJson, template);
}
