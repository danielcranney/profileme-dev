/**
 * Links Page Renderer
 *
 * Generates a GitHub Pages-compatible simple links page from Profile JSON.
 * Re-exports the portfolio renderer (profile JSON key remains "portfolio" for backward compatibility).
 */

export { renderPortfolio as renderLinksPage } from "./portfolio";
