import React from "react";

/**
 * MarkdownRenderer - Displays markdown generated from Profile JSON
 * 
 * This component now simply displays the markdown string generated
 * by renderReadme() from the canonical JSON format.
 */
export default function MarkdownRenderer({
  markdownString,
  markdownRef,
}) {
  return (
    <article id="markdown-container" className="relative" ref={markdownRef}>
      {!markdownString ? (
        <div>You have not rendered any code yet</div>
      ) : (
        <pre className="text-xs whitespace-pre-line break-all">
          {markdownString}
        </pre>
      )}
    </article>
  );
}
