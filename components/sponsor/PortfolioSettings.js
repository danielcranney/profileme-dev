/**
 * Portfolio Settings Component (Sponsors Only)
 *
 * Allows users to select portfolio template and configure options.
 */

import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useContext } from "react";
import { StateContext } from "../../pages/_app";
import { ACTIONS } from "../../lib/constants/actions";
import { loadProfileJson, saveProfileJson } from "../../lib/profile";

const TEMPLATES = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Dark, clean, minimal design",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Light, colorful, modern gradient",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional, professional style",
  },
];

export default function PortfolioSettings() {
  const { isSponsor, isAuthenticated } = useAuth();
  const { state, dispatch } = useContext(StateContext);
  const [selectedTemplate, setSelectedTemplate] = useState("minimal");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load current template from profile JSON
    const profileJson = loadProfileJson();
    if (profileJson?.portfolio?.template) {
      setSelectedTemplate(profileJson.portfolio.template);
    } else {
      // If no saved template, use default and ensure it's saved
      setSelectedTemplate("minimal");
      // Ensure default portfolio settings are saved
      const { stateToProfileJson } = require("../../lib/profile/stateBridge");
      const defaultJson = stateToProfileJson(state);
      saveProfileJson(defaultJson);
    }
  }, []);

  if (!isAuthenticated || !isSponsor) {
    return null;
  }

  const handleTemplateChange = async (templateId) => {
    setSelectedTemplate(templateId);
    setSaving(true);

    try {
      // Load current profile JSON or create from state
      let profileJson = loadProfileJson();

      if (!profileJson) {
        // If no JSON exists, create from current state
        const { stateToProfileJson } = require("../../lib/profile/stateBridge");
        profileJson = stateToProfileJson(state);
      }

      // Update portfolio template
      profileJson.portfolio = {
        ...profileJson.portfolio,
        template: templateId,
      };

      // Save to LocalStorage
      saveProfileJson(profileJson);

      // Force portfolio preview to refresh by triggering a state update
      // The PortfolioRenderer will pick up the new template from JSON
      // We can trigger a small state update to force re-render
      dispatch({
        type: ACTIONS.SELECT_RENDER_MODE,
        payload: state.renderMode, // Re-set current mode to trigger refresh
      });
    } catch (error) {
      console.error("Failed to save template:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-3 border border-gray-300 dark:border-dark-700 rounded bg-white dark:bg-dark-800 shadow-sm mb-3">
      <h4 className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">
        Portfolio Template
      </h4>
      <div className="space-y-2">
        {TEMPLATES.map((template) => (
          <label
            key={template.id}
            className={`flex items-start gap-2 p-2 rounded cursor-pointer border transition-colors ${
              selectedTemplate === template.id
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-dark-700 hover:border-gray-300 dark:hover:border-dark-600"
            }`}
          >
            <input
              type="radio"
              name="portfolio-template"
              value={template.id}
              checked={selectedTemplate === template.id}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-900 dark:text-gray-100">
                {template.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {template.description}
              </div>
            </div>
          </label>
        ))}
      </div>
      {saving && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Saving...
        </p>
      )}
    </div>
  );
}
