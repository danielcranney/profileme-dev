/**
 * PortfolioRenderer - Displays portfolio HTML generated from Profile JSON
 * 
 * Shows a live preview of the portfolio that will be published to GitHub Pages.
 */

import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { StateContext } from "../../pages/_app";
import { stateToProfileJson } from "../../lib/profile/stateBridge";
import { renderPortfolio } from "../../lib/profile/portfolio";

export default function PortfolioRenderer() {
  const { state } = useContext(StateContext);
  const [portfolioHtml, setPortfolioHtml] = useState("");
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    try {
      // Convert state to profile JSON
      const profileJson = stateToProfileJson(state);
      
      // Generate portfolio HTML
      const html = renderPortfolio(profileJson);
      setPortfolioHtml(html);
      
      // Force iframe reload by changing key
      setIframeKey(prev => prev + 1);
    } catch (error) {
      console.error("Error generating portfolio:", error);
      setPortfolioHtml("");
    }
  }, [state]);

  if (!portfolioHtml) {
    return (
      <div className="p-4 text-gray-500">
        Generating portfolio preview...
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <iframe
        key={iframeKey}
        srcDoc={portfolioHtml}
        className="w-full h-full border border-gray-300 rounded"
        style={{ minHeight: "600px" }}
        title="Portfolio Preview"
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  );
}
