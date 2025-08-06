import React, { useEffect, useContext, useState } from "react";
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
import PreviewControls from "../components/preview/PreviewControls";

// Import hooks
import { StateContext } from "./_app";
import {
  useMarkdownGeneration,
  usePreviewState,
  useIconToggle,
  useBadgeHandlers,
  useScrollHandling,
  useSocialDragDrop,
  useSkillsDragDrop,
} from "../hooks";

export default function CreateProfile() {
  const { state, dispatch } = useContext(StateContext);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const [copySuccess, setCopySuccess] = useState("Copy");

  // Custom hooks
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
            renderedMarkdown={renderedMarkdown}
            state={state}
            sectionOrder={state.sectionOrder}
            socialsShowing={socialsShowing}
            badgesShowing={badgesShowing}
            markdownSkillsEmpty={markdownSkillsEmpty}
            buildMarkdownSkill={buildMarkdownSkill}
            supportStore={supportStore}
            markdownRef={markdownRef}
            socialsOrder={socialsOrder}
            skillsOrder={skillsOrder}
          />
        </div>
      </section>
    </>
  );
}

CreateProfile.getLayout = function getLayout(page) {
  return <FormLayout>{page}</FormLayout>;
};
