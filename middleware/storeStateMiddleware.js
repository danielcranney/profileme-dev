import { STORED_STATE_KEY } from "../pages/_app";
import { syncStateToJson } from "../lib/profile/stateBridge";

/**
 * Middleware that syncs state to both:
 * 1. Legacy format (for backward compatibility during migration)
 * 2. New JSON format (canonical)
 */
export default (action, state) => {
  // Save legacy format (for now, during migration)
  localStorage.setItem(STORED_STATE_KEY, JSON.stringify(state));
  
  // Sync to new JSON format
  syncStateToJson(state);
};
