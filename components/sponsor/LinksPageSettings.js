/**
 * LinksPage Settings Component (Sponsors Only)
 *
 * Allows users to select Links page template, configure options,
 * reorder links, and add custom links.
 * (Stored JSON key remains "portfolio" for backward compatibility.)
 */

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useContext } from "react";
import { StateContext } from "../../pages/_app";
import { ACTIONS } from "../../lib/constants/actions";
import { loadProfileJson, saveProfileJson, getOrderedLinkBlocks, stateToProfileJson } from "../../lib/profile";
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
  const [showGitHubSection, setShowGitHubSection] = useState(true);
  const [showSkillsSection, setShowSkillsSection] = useState(true);
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState("");
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
      const opts = profileJson.portfolio.options;
      if (opts && typeof opts.showGitHubSection === "boolean") {
        setShowGitHubSection(opts.showGitHubSection);
      }
      if (opts && typeof opts.showSkillsSection === "boolean") {
        setShowSkillsSection(opts.showSkillsSection);
      }
      if (opts && typeof opts.youtubeVideoUrl === "string") {
        setYoutubeVideoUrl(opts.youtubeVideoUrl);
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

  // Merge into portfolio.options (for linkOrder, customLinks)
  const updateLinksPageOptions = async (optionsUpdate) => {
    setSaving(true);
    try {
      let profileJson = loadProfileJson();
      if (!profileJson) {
        profileJson = stateToProfileJson(state);
      }
      const currentOptions = profileJson.portfolio?.options || {};
      profileJson.portfolio = {
        ...profileJson.portfolio,
        options: { ...currentOptions, ...optionsUpdate },
      };
      saveProfileJson(profileJson);
      markAsChanged();
      dispatch({ type: ACTIONS.SELECT_RENDER_MODE, payload: state.renderMode });
    } catch (err) {
      console.error("Failed to save links page options:", err);
    } finally {
      setSaving(false);
    }
  };

  // Build profileJson for link blocks (saved JSON + current state profile)
  const profileJsonForLinks = useMemo(() => {
    const saved = loadProfileJson();
    const stateJson = stateToProfileJson(state);
    if (!saved) return stateJson;
    return { ...saved, profile: stateJson.profile };
  }, [state]);

  const linkBlocks = useMemo(() => getOrderedLinkBlocks(profileJsonForLinks), [profileJsonForLinks]);

  const moveLink = async (index, direction) => {
    if (index <= 0 && direction === -1) return;
    if (index >= linkBlocks.length - 1 && direction === 1) return;
    const newOrder = [...linkBlocks.map((b) => b.id)];
    const swap = newOrder[index + direction];
    newOrder[index + direction] = newOrder[index];
    newOrder[index] = swap;
    await updateLinksPageOptions({ linkOrder: newOrder });
  };

  const addCustomLink = async (url, label) => {
    const opts = profileJsonForLinks.portfolio?.options || {};
    const customLinks = Array.isArray(opts.customLinks) ? [...opts.customLinks] : [];
    const newId = `custom-${Date.now()}`;
    customLinks.push({ id: newId, url: (url || "").trim(), label: (label || "Link").trim() || "Link" });
    const linkOrder = Array.isArray(opts.linkOrder) ? [...opts.linkOrder] : linkBlocks.map((b) => b.id);
    linkOrder.push(newId);
    await updateLinksPageOptions({ customLinks, linkOrder });
  };

  const removeCustomLink = async (id) => {
    const opts = profileJsonForLinks.portfolio?.options || {};
    const customLinks = (Array.isArray(opts.customLinks) ? opts.customLinks : []).filter((c) => c.id !== id);
    const linkOrder = (Array.isArray(opts.linkOrder) ? opts.linkOrder : linkBlocks.map((b) => b.id)).filter((lid) => lid !== id);
    await updateLinksPageOptions({ customLinks, linkOrder });
  };

  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkLabel, setNewLinkLabel] = useState("");

  const handleAddCustomLink = async (e) => {
    e.preventDefault();
    if (!newLinkUrl.trim()) return;
    await addCustomLink(newLinkUrl, newLinkLabel);
    setNewLinkUrl("");
    setNewLinkLabel("");
  };

  const handleShowGitHubSectionChange = async (checked) => {
    setShowGitHubSection(checked);
    await updateLinksPageOptions({ showGitHubSection: checked });
  };

  const handleShowSkillsSectionChange = async (checked) => {
    setShowSkillsSection(checked);
    await updateLinksPageOptions({ showSkillsSection: checked });
  };

  const handleYoutubeVideoUrlChange = async (url) => {
    const value = (url ?? "").trim();
    setYoutubeVideoUrl(value);
    await updateLinksPageOptions({ youtubeVideoUrl: value || undefined });
  };

  return (
    <>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        Appearance and Links page options. Accent color applies to both profile and Links page; options below apply to your Links page only.
      </p>
      {/* Template selector temporarily hidden – users cannot change template for now */}
      {/* <div className="p-3 border border-gray-300 dark:border-dark-700 rounded bg-white dark:bg-dark-800 shadow-sm mb-3">
        <h4 className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">Links page template</h4>
        <div className="space-y-2">
          {TEMPLATES.map((template) => (
            <label key={template.id} className={...}>
              <input type="radio" name="links-page-template" value={template.id} checked={selectedTemplate === template.id} onChange={(e) => handleTemplateChange(e.target.value)} />
              <div className="flex-1"><div className="text-xs font-medium">...</div><div className="text-xs text-gray-500">...</div></div>
            </label>
          ))}
        </div>
      </div> */}

      <div className="p-3 border border-gray-300 dark:border-dark-700 rounded bg-white dark:bg-dark-800 shadow-sm mb-3">
        <h4 className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
          Page sections
          <span className="text-[10px] font-normal text-gray-400 dark:text-gray-500 uppercase">Links page only</span>
        </h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showGitHubSection}
              onChange={(e) => handleShowGitHubSectionChange(e.target.checked)}
              className="rounded border-gray-300 dark:border-dark-600"
            />
            <span className="text-xs text-gray-700 dark:text-gray-300">Show GitHub section (contribution graph)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showSkillsSection}
              onChange={(e) => handleShowSkillsSectionChange(e.target.checked)}
              className="rounded border-gray-300 dark:border-dark-600"
            />
            <span className="text-xs text-gray-700 dark:text-gray-300">Show Skills section</span>
          </label>
        </div>
      </div>

      <div className="p-3 border border-gray-300 dark:border-dark-700 rounded bg-white dark:bg-dark-800 shadow-sm mb-3">
        <h4 className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
          YouTube video
          <span className="text-[10px] font-normal text-gray-400 dark:text-gray-500 uppercase">Links page only</span>
        </h4>
        <input
          type="url"
          value={youtubeVideoUrl}
          onChange={(e) => setYoutubeVideoUrl(e.target.value)}
          onBlur={(e) => handleYoutubeVideoUrlChange(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full px-2.5 py-1.5 text-xs border border-gray-300 dark:border-dark-700 rounded bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Optional. Paste a YouTube video URL to embed it on your Links page (after the links section).
        </p>
      </div>

      <div className="p-3 border border-gray-300 dark:border-dark-700 rounded bg-white dark:bg-dark-800 shadow-sm mb-3">
        <h4 className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
          Font
          <span className="text-[10px] font-normal text-gray-400 dark:text-gray-500 uppercase">Links page only</span>
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
        <h4 className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
          Accent color
          <span className="text-[10px] font-normal text-gray-400 dark:text-gray-500 uppercase">Profile & Links page</span>
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

      <div className="p-3 border border-gray-300 dark:border-dark-700 rounded bg-white dark:bg-dark-800 shadow-sm mb-3">
        <h4 className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
          Links on your page
          <span className="text-[10px] font-normal text-gray-400 dark:text-gray-500 uppercase">Links page only</span>
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Reorder or add custom links. Order is reflected in the preview.
        </p>
        <div className="space-y-1.5 mb-3">
          {linkBlocks.map((block, index) => (
            <div
              key={block.id}
              className="flex items-center gap-1.5 py-1.5 px-2 rounded border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-900"
            >
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => moveLink(index, -1)}
                  disabled={index === 0}
                  className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-dark-600 disabled:opacity-40 disabled:pointer-events-none"
                  aria-label="Move up"
                >
                  <svg className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => moveLink(index, 1)}
                  disabled={index === linkBlocks.length - 1}
                  className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-dark-600 disabled:opacity-40 disabled:pointer-events-none"
                  aria-label="Move down"
                >
                  <svg className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate block">{block.label}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate block">{block.source}</span>
              </div>
              {block.source === "Custom" && (
                <button
                  type="button"
                  onClick={() => removeCustomLink(block.id)}
                  className="flex-shrink-0 p-1 rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  aria-label="Remove link"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        <form onSubmit={handleAddCustomLink} className="flex flex-col gap-2">
          <input
            type="url"
            value={newLinkUrl}
            onChange={(e) => setNewLinkUrl(e.target.value)}
            placeholder="https://..."
            className="px-2.5 py-1.5 text-xs border border-gray-300 dark:border-dark-700 rounded bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          />
          <input
            type="text"
            value={newLinkLabel}
            onChange={(e) => setNewLinkLabel(e.target.value)}
            placeholder="Link label"
            className="px-2.5 py-1.5 text-xs border border-gray-300 dark:border-dark-700 rounded bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newLinkUrl.trim() || saving}
            className="btn-sm btn-gray text-xs"
          >
            Add custom link
          </button>
        </form>
      </div>

      {saving && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 mb-3">
          Saving...
        </p>
      )}
    </>
  );
}
