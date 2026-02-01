/**
 * PortfolioRenderer - Displays portfolio HTML generated from Profile JSON
 *
 * Shows a live preview of the portfolio that will be published to GitHub Pages.
 * Profile data (including introduction.avatarUrl) comes from state; when saved
 * JSON exists, we merge state into it so the preview always reflects current
 * state (e.g. GitHub avatar set in create-profile effect).
 *
 * Uses a blob URL for the iframe so the document loads reliably (srcDoc can
 * appear blank in some browsers/sandbox combinations).
 */

import React, { useEffect, useState, useRef } from "react";
import { useContext } from "react";
import { StateContext } from "../../pages/_app";
import { stateToProfileJson } from "../../lib/profile/stateBridge";
import { renderPortfolio } from "../../lib/profile/portfolio";
import { loadProfileJson } from "../../lib/profile";

export default function PortfolioRenderer() {
  const { state } = useContext(StateContext);
  const [iframeSrc, setIframeSrc] = useState(null);
  const [error, setError] = useState(null);
  const prevBlobUrlRef = useRef(null);
  const lastContentKeyRef = useRef(null);

  // Only create a new blob when portfolio content actually changes.
  // stateToProfileJson() sets updatedAt to now every call, so we must not
  // include updatedAt in the content key or we'd create a new blob every run
  // (constant URL churn, iframe never loads).
  useEffect(() => {
    try {
      setError(null);
      const savedJson = loadProfileJson();

      let profileJson;
      if (savedJson) {
        const stateJson = stateToProfileJson(state);
        profileJson = {
          ...savedJson,
          profile: stateJson.profile,
          updatedAt: stateJson.updatedAt,
        };
      } else {
        profileJson = stateToProfileJson(state);
      }

      // Stable key: only profile + portfolio (exclude updatedAt so we don't loop)
      const { updatedAt, ...contentForKey } = profileJson;
      const contentKey = JSON.stringify(contentForKey);
      if (lastContentKeyRef.current === contentKey && prevBlobUrlRef.current) {
        return;
      }
      lastContentKeyRef.current = contentKey;

      const html = renderPortfolio(profileJson);
      const blob = new Blob([html], { type: "text/html; charset=utf-8" });
      const url = URL.createObjectURL(blob);

      if (prevBlobUrlRef.current) {
        URL.revokeObjectURL(prevBlobUrlRef.current);
      }
      prevBlobUrlRef.current = url;
      setIframeSrc(url);
    } catch (err) {
      console.error("Error generating portfolio:", err);
      setError(err.message);
      setIframeSrc(null);
    }
  }, [state]);

  // Revoke blob URL only on unmount to avoid leaks
  useEffect(() => {
    return () => {
      if (prevBlobUrlRef.current) {
        URL.revokeObjectURL(prevBlobUrlRef.current);
        prevBlobUrlRef.current = null;
      }
    };
  }, []);

  if (error) {
    return (
      <div className="p-4 text-red-600 dark:text-red-400 text-sm">
        Failed to generate preview: {error}
      </div>
    );
  }

  if (!iframeSrc) {
    return (
      <div className="p-4 text-gray-500 dark:text-gray-400">
        Generating portfolio preview…
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[600px] flex flex-col">
      <iframe
        src={iframeSrc}
        className="flex-1 w-full min-h-[600px] border border-gray-300 dark:border-dark-600 rounded bg-white dark:bg-dark-800"
        title="Portfolio Preview"
        sandbox="allow-same-origin allow-scripts allow-popups"
      />
    </div>
  );
}
