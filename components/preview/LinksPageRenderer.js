/**
 * LinksPageRenderer - Displays Links page HTML generated from Profile JSON
 *
 * Shows a live preview of the simple links page that will be published to GitHub Pages.
 * Profile data (including introduction.avatarUrl) comes from state; when saved
 * JSON exists, we merge state into it so the preview always reflects current
 * state (e.g. GitHub avatar set in create-profile effect).
 *
 * When the user is authenticated, we fetch links page OG image and featured
 * GitHub repos from the enrich API and merge them into the preview so the
 * card and Projects section show before the first sync.
 *
 * Uses a blob URL for the iframe so the document loads reliably (srcDoc can
 * appear blank in some browsers/sandbox combinations).
 */

import React, { useEffect, useState, useRef } from "react";
import { useContext } from "react";
import { StateContext } from "../../pages/_app";
import { useAuth } from "../../hooks/useAuth";
import { stateToProfileJson } from "../../lib/profile/stateBridge";
import { renderLinksPage } from "../../lib/profile/links-page";
import { loadProfileJson } from "../../lib/profile";

export default function LinksPageRenderer() {
  const { state } = useContext(StateContext);
  const { githubToken } = useAuth();
  const [iframeSrc, setIframeSrc] = useState(null);
  const [error, setError] = useState(null);
  const [enriched, setEnriched] = useState({ portfolioOgImage: null, featuredRepos: [] });
  const prevBlobUrlRef = useRef(null);
  const lastContentKeyRef = useRef(null);

  // Fetch OG image and featured repos for preview when authenticated
  const portfolioLink = state?.introduction?.portfolioLink?.trim?.();
  useEffect(() => {
    if (!githubToken) {
      setEnriched({ portfolioOgImage: null, featuredRepos: [] });
      return;
    }
    let cancelled = false;
    fetch("/api/github/enrich-links-page", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ portfolioLink: portfolioLink || undefined }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(res.statusText))))
      .then((data) => {
        if (!cancelled) {
          setEnriched({
            portfolioOgImage: data.portfolioOgImage ?? null,
            featuredRepos: Array.isArray(data.featuredRepos) ? data.featuredRepos : [],
          });
        }
      })
      .catch(() => {
        if (!cancelled) setEnriched({ portfolioOgImage: null, featuredRepos: [] });
      });
    return () => { cancelled = true; };
  }, [githubToken, portfolioLink]);

  // Only create a new blob when content actually changes.
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

      // Merge enriched preview data (OG image, featured repos) when available
      if (enriched.portfolioOgImage || enriched.featuredRepos.length > 0) {
        profileJson = {
          ...profileJson,
          portfolio: {
            ...profileJson.portfolio,
            options: {
              ...profileJson.portfolio?.options,
              ...(enriched.portfolioOgImage && { portfolioOgImage: enriched.portfolioOgImage }),
              ...(enriched.featuredRepos.length > 0 && { featuredRepos: enriched.featuredRepos }),
            },
          },
        };
      }

      // Stable key: only profile + portfolio (exclude updatedAt so we don't loop)
      const { updatedAt, ...contentForKey } = profileJson;
      const contentKey = JSON.stringify(contentForKey);
      if (lastContentKeyRef.current === contentKey && prevBlobUrlRef.current) {
        return;
      }
      lastContentKeyRef.current = contentKey;

      const html = renderLinksPage(profileJson);
      const blob = new Blob([html], { type: "text/html; charset=utf-8" });
      const url = URL.createObjectURL(blob);

      if (prevBlobUrlRef.current) {
        URL.revokeObjectURL(prevBlobUrlRef.current);
      }
      prevBlobUrlRef.current = url;
      setIframeSrc(url);
    } catch (err) {
      console.error("Error generating links page preview:", err);
      setError(err.message);
      setIframeSrc(null);
    }
  }, [state, enriched]);

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
        Generating links page preview…
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[600px] flex flex-col">
      <iframe
        src={iframeSrc}
        className="flex-1 w-full min-h-[600px] border border-gray-300 dark:border-dark-600 rounded bg-white dark:bg-dark-800"
        title="Links page Preview"
        sandbox="allow-same-origin allow-scripts allow-popups"
      />
    </div>
  );
}
