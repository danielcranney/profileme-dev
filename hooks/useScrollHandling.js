import { useEffect, useRef } from "react";
import { useContext } from "react";
import { StateContext } from "../pages/_app";

export const useScrollHandling = () => {
  const { state } = useContext(StateContext);

  // Section Refs
  const introductionRef = useRef(null);
  const skillsTitleRef = useRef(null);
  const skillsRef = useRef(null);
  const socialsTitleRef = useRef(null);
  const socialsRef = useRef(null);
  const badgesTitleRef = useRef(null);
  const badgesRef = useRef(null);
  const supportRef = useRef(null);

  // Markdown Container
  const markdownRef = useRef();

  // Scrollable Refs
  const introductionAnchorRef = useRef();
  const skillsAnchorRef = useRef();
  const socialsAnchorRef = useRef();
  const badgesAnchorRef = useRef();
  const supportAnchorRef = useRef();

  const executeScroll = (ref) => {
    if (!ref.current) return;
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    if (state.section == "introduction") {
      executeScroll(introductionAnchorRef);
    } else if (state.section == "skills") {
      executeScroll(skillsAnchorRef);
    } else if (state.section == "socials") {
      executeScroll(socialsAnchorRef);
    } else if (state.section == "badges") {
      executeScroll(badgesAnchorRef);
    } else if (state.section == "support") {
      executeScroll(supportAnchorRef);
    } else return;
  }, [state.section]);

  return {
    // Section refs
    introductionRef,
    skillsTitleRef,
    skillsRef,
    socialsTitleRef,
    socialsRef,
    badgesTitleRef,
    badgesRef,
    supportRef,

    // Markdown ref
    markdownRef,

    // Anchor refs
    introductionAnchorRef,
    skillsAnchorRef,
    socialsAnchorRef,
    badgesAnchorRef,
    supportAnchorRef,
  };
};
