import React, { useEffect, useContext, useState, useMemo } from "react";
import { useTheme } from "next-themes";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { colorStore } from "../lib/constants/colorStore";
import { supportStore } from "../lib/constants/supportStore";

// Import components
import Introduction from "../components/sections/Introduction";
import Skills from "../components/sections/Skills";
import Socials from "../components/sections/Socials";
import Badges from "../components/sections/Badges";
import Support from "../components/sections/Support";
import FormLayout from "../components/layouts/FormLayout";
import PreviewRenderer from "../components/preview/PreviewRenderer";
import MarkdownRenderer from "../components/preview/MarkdownRenderer";
import JsonViewer from "../components/preview/JsonViewer";
import LinksPageRenderer from "../components/preview/LinksPageRenderer";
import LinksPageGate from "../components/preview/LinksPageGate";
import PreviewControls from "../components/preview/PreviewControls";
import GitHubPagesSettings from "../components/sponsor/GitHubPagesSettings";

// Import hooks
import { StateContext } from "./_app";
import { ACTIONS } from "../lib/constants/actions";
import { useAuth } from "../hooks/useAuth";
import {
  useMarkdownGeneration,
  usePreviewState,
  useIconToggle,
  useBadgeHandlers,
  useScrollHandling,
  useSocialDragDrop,
  useSkillsDragDrop,
  useAutoRestore,
} from "../hooks";
import { loadProfileJson, stateToProfileJson } from "../lib/profile";

export default function CreateProfile() {
  const { state, dispatch } = useContext(StateContext);
  const { isSponsor, user, loading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const [copySuccess, setCopySuccess] = useState("Copy");

  // Default profile picture to GitHub avatar when user is logged in (if not already set)
  useEffect(() => {
    const avatarUrl = user?.user_metadata?.avatar_url;
    const currentAvatar = state.introduction?.avatarUrl?.trim();
    if (avatarUrl && !currentAvatar) {
      dispatch({
        type: ACTIONS.ADD_INTRODUCTION,
        payload: { title: "avatarUrl", value: avatarUrl },
      });
    }
  }, [
    user?.user_metadata?.avatar_url,
    state.introduction?.avatarUrl,
    dispatch,
  ]);

  // Generate markdown from JSON (canonical source)
  const [markdownString, setMarkdownString] = useState("");

  useEffect(() => {
    if (!mounted) return;
    try {
      const { stateToProfileJson, renderReadme } = require("../lib/profile");
      const profileJson = stateToProfileJson(state);
      const markdown = renderReadme(profileJson);
      setMarkdownString(markdown);
    } catch (error) {
      console.error("Error generating markdown:", error);
    }
  }, [state, mounted]);

  // Profile JSON for JSON view (only after mount to avoid server/client hydration mismatch)
  const profileJsonString = useMemo(() => {
    if (!mounted) return "";
    try {
      const saved = loadProfileJson();
      const stateJson = stateToProfileJson(state);
      const merged = saved
        ? { ...saved, profile: stateJson.profile, updatedAt: stateJson.updatedAt }
        : stateJson;
      return JSON.stringify(merged, null, 2);
    } catch (e) {
      return "";
    }
  }, [state, mounted]);

  // Legacy hooks (still needed for preview rendering)
  const { renderedMarkdown, buildMarkdownSkill } = useMarkdownGeneration(
    state,
    mounted,
    theme
  );
  const { socialsShowing, badgesShowing } = usePreviewState(
    renderedMarkdown,
    mounted
  );
  const { handleIconToggle, clearAllSkills } = useIconToggle();
  const {
    handleBadgeToggle,
    handleBadgeElementToggle,
    handleStyleBadge,
    handleChangeBadgeColor,
  } = useBadgeHandlers();
  const {
    markdownRef,
    introductionAnchorRef,
    skillsAnchorRef,
    socialsAnchorRef,
    badgesAnchorRef,
    supportAnchorRef,
  } = useScrollHandling();

  // Social drag and drop functionality
  const {
    draggedIndex: socialDraggedIndex,
    isDragging: isSocialDragging,
    handleDragStart: onSocialDragStart,
    handleDragOver: onSocialDragOver,
    handleDrop: onSocialDrop,
    getOrderedSocials,
    resetSocialOrder,
  } = useSocialDragDrop();

  // Skills drag and drop functionality
  const {
    draggedIndex: skillsDraggedIndex,
    isDragging: isSkillsDragging,
    handleDragStart: onSkillsDragStart,
    handleDragOver: onSkillsDragOver,
    handleDrop: onSkillsDrop,
    getOrderedSkills,
    resetSkillsOrder,
  } = useSkillsDragDrop();

  // Auto-restore for sponsors
  const { checkAndRestore } = useAutoRestore();

  // Computed values
  const skillsEmpty = Object.keys(state.skills).every(
    (key) => state.skills[key].length === 0
  );
  const markdownSkillsEmpty = Object.keys(renderedMarkdown.skills).every(
    (key) => renderedMarkdown.skills[key].length === 0
  );
  const withSupport =
    state && state.support
      ? Object.values(state.support).some(
          (value) =>
            value &&
            value.linkSuffix !== undefined &&
            value.linkSuffix !== null &&
            value.linkSuffix !== ""
        )
      : false;

  // Get ordered socials for rendering
  const socialsOrder = getOrderedSocials();

  // Get ordered skills for rendering
  const skillsOrder = getOrderedSkills();

  // Effects
  useEffect(() => {
    state.sidebarOpen
      ? disableBodyScroll(document)
      : enableBodyScroll(document);
  }, [state.sidebarOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* COLUMN 2 - INPUTS */}
      <section
        className={`input-column-wrapper ${
          state.sidebarOpen ? "ml-0 md:ml-64 " : ""
        }`}
      >
        {/* Section Displays */}
        {state.section === "introduction" ? (
          <Introduction ref={introductionAnchorRef} />
        ) : state.section === "skills" ? (
          <Skills
            ref={skillsAnchorRef}
            handleIconToggle={handleIconToggle}
            clearAllSkills={clearAllSkills}
          />
        ) : state.section === "socials" ? (
          <Socials ref={socialsAnchorRef} />
        ) : state.section === "badges" ? (
          <Badges
            ref={badgesAnchorRef}
            colorStore={colorStore}
            handleStyleBadge={handleStyleBadge}
            handleChangeBadgeColor={handleChangeBadgeColor}
            handleBadgeToggle={handleBadgeToggle}
            handleBadgeElementToggle={handleBadgeElementToggle}
            badgesShowing={badgesShowing}
          />
        ) : state.section === "support" ? (
          <Support ref={supportAnchorRef} />
        ) : null}
      </section>

      {/* COLUMN 3 - PREVIEW & MARKDOWN */}
      <section className="preview-column-wrapper">
        {/* Preview, Markdown and Copy Buttons */}
        <PreviewControls
          copySuccess={copySuccess}
          setCopySuccess={setCopySuccess}
          markdownRef={markdownRef}
          resetSocialOrder={resetSocialOrder}
          resetSkillsOrder={resetSkillsOrder}
        />

        {/* Preview Section */}
        <div className={state.renderMode === "preview" ? "relative" : "hidden"}>
          <PreviewRenderer
            state={state}
            sectionOrder={state.sectionOrder}
            skillsEmpty={skillsEmpty}
            socialsShowing={socialsShowing}
            badgesShowing={badgesShowing}
            supportStore={supportStore}
            withSupport={withSupport}
            socialsOrder={socialsOrder}
            onSocialDragStart={onSocialDragStart}
            onSocialDragOver={onSocialDragOver}
            onSocialDrop={onSocialDrop}
            isSocialDragging={isSocialDragging}
            socialDraggedIndex={socialDraggedIndex}
            skillsOrder={skillsOrder}
            onSkillsDragStart={onSkillsDragStart}
            onSkillsDragOver={onSkillsDragOver}
            onSkillsDrop={onSkillsDrop}
            isSkillsDragging={isSkillsDragging}
            skillsDraggedIndex={skillsDraggedIndex}
          />
        </div>

        {/* Markdown Section Preview */}
        <div
          className={state.renderMode === "markdown" ? "relative" : "hidden"}
        >
          <MarkdownRenderer
            markdownString={markdownString}
            markdownRef={markdownRef}
          />
        </div>

        {/* JSON view (shared data source for profile and Links page) */}
        <div
          className={
            state.renderMode === "json"
              ? "relative flex flex-1 min-h-0 flex-col my-auto"
              : "hidden"
          }
        >
          <JsonViewer jsonString={profileJsonString} placeholder={!mounted ? "Loading…" : null} />
        </div>

        {/* Links page section: full access for sponsors, gate prompt for non-sponsors */}
        <div
          className={
            state.renderMode === "linksPage"
              ? "relative flex flex-1 min-h-0 flex-col my-auto"
              : "hidden"
          }
        >
          {authLoading ? (
            <div className="flex flex-1 items-center justify-center p-6 text-sm text-gray-500 dark:text-gray-400">
              Checking access…
            </div>
          ) : isSponsor ? (
            <LinksPageRenderer />
          ) : (
            <LinksPageGate />
          )}
        </div>
      </section>
    </>
  );
}

CreateProfile.getLayout = function getLayout(page) {
  return <FormLayout>{page}</FormLayout>;
};
