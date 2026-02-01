/**
 * LinksPage Settings Component (Sponsors Only)
 *
 * Allows users to select Links page template and configure options.
 * (Stored JSON key remains "portfolio" for backward compatibility.)
 */

import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useContext } from "react";
import { StateContext } from "../../pages/_app";
import { ACTIONS } from "../../lib/constants/actions";
import { loadProfileJson, saveProfileJson } from "../../lib/profile";
import { useLinksPageChanges } from "../../hooks/useLinksPageChanges";

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

const FONTS = [
  {
    id: "Inter",
    name: "Inter",
    description: "Modern, clean sans-serif",
  },
  {
    id: "Roboto",
    name: "Roboto",
    description: "Geometric, friendly sans-serif",
  },
  {
    id: "Open Sans",
    name: "Open Sans",
    description: "Humanist, readable sans-serif",
  },
  {
    id: "Lato",
    name: "Lato",
    description: "Warm, stable sans-serif",
  },
  {
    id: "Montserrat",
    name: "Montserrat",
    description: "Elegant, geometric sans-serif",
  },
];

export default function LinksPageSettings() {
  const { isSponsor, isAuthenticated } = useAuth();
  const { state, dispatch } = useContext(StateContext);
  const { markAsChanged, initializeBaseline } = useLinksPageChanges();
  const [selectedTemplate, setSelectedTemplate] = useState("minimal");
  const [selectedFont, setSelectedFont] = useState("Inter");
  const [accentColor, setAccentColor] = useState("#3b82f6");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const profileJson = loadProfileJson();
    if (profileJson?.portfolio) {
      if (profileJson.portfolio.template) {
        setSelectedTemplate(profileJson.portfolio.template);
      }
      if (profileJson.portfolio.font) {
        setSelectedFont(profileJson.portfolio.font);
      }
      if (profileJson.portfolio.accentColor) {
        setAccentColor(profileJson.portfolio.accentColor);
      }
    } else {
      setSelectedTemplate("minimal");
      setSelectedFont("Inter");
      setAccentColor("#3b82f6");
      const { stateToProfileJson } = require("../../lib/profile/stateBridge");
      const defaultJson = stateToProfileJson(state);
      saveProfileJson(defaultJson);
    }

    const timer = setTimeout(() => {
      initializeBaseline();
    }, 50);

    return () => clearTimeout(timer);
  }, [initializeBaseline]);

  if (!isAuthenticated || !isSponsor) {
    return null;
  }

  const updateLinksPageSettings = async (updates) => {
    setSaving(true);

    try {
      let profileJson = loadProfileJson();

      if (!profileJson) {
        const { stateToProfileJson } = require("../../lib/profile/stateBridge");
        profileJson = stateToProfileJson(state);
      }

      profileJson.portfolio = {
        ...profileJson.portfolio,
        ...updates,
      };

      saveProfileJson(profileJson);
      markAsChanged();

      dispatch({
        type: ACTIONS.SELECT_RENDER_MODE,
        payload: state.renderMode,
      });
    } catch (error) {
      console.error("Failed to save links page settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleTemplateChange = async (templateId) => {
    setSelectedTemplate(templateId);
    await updateLinksPageSettings({ template: templateId });
  };

  const handleFontChange = async (fontId) => {
    setSelectedFont(fontId);
    await updateLinksPageSettings({ font: fontId });
  };

  const handleColorChange = async (color) => {
    setAccentColor(color);
    await updateLinksPageSettings({ accentColor: color });
  };

  return (
    <>
      <div className="p-3 border border-gray-300 dark:border-dark-700 rounded bg-white dark:bg-dark-800 shadow-sm mb-3">
        <h4 className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Links page template
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
                name="links-page-template"
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
      </div>

      <div className="p-3 border border-gray-300 dark:border-dark-700 rounded bg-white dark:bg-dark-800 shadow-sm mb-3">
        <h4 className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Font
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {FONTS.map((font) => (
            <label
              key={font.id}
              className={`flex items-center justify-center gap-2 p-2 rounded cursor-pointer border transition-colors ${
                selectedFont === font.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-dark-700 hover:border-gray-300 dark:hover:border-dark-600"
              }`}
              style={{ fontFamily: font.id }}
            >
              <input
                type="radio"
                name="links-page-font"
                value={font.id}
                checked={selectedFont === font.id}
                onChange={(e) => handleFontChange(e.target.value)}
                className="sr-only"
              />
              <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                {font.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="p-3 border border-gray-300 dark:border-dark-700 rounded bg-white dark:bg-dark-800 shadow-sm mb-3">
        <h4 className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Accent Color
        </h4>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={accentColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-12 h-8 rounded border border-gray-300 dark:border-dark-700 cursor-pointer"
          />
          <input
            type="text"
            value={accentColor}
            onChange={(e) => handleColorChange(e.target.value)}
            placeholder="#3b82f6"
            className="flex-1 px-2.5 py-1.5 text-xs border border-gray-300 dark:border-dark-700 rounded bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Used for accent bar and highlights
        </p>
      </div>

      {saving && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 mb-3">
          Saving...
        </p>
      )}
    </>
  );
}
