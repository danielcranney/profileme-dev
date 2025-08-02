import { useEffect, useState } from "react";

export const usePreviewState = (renderedMarkdown, mounted) => {
  const [socialsShowing, setSocialsShowing] = useState(false);
  const [badgesShowing, setBadgesShowing] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    let linkSuffixes = [];
    Object.entries(renderedMarkdown.socials).map((social) => {
      linkSuffixes.push(social[1].linkSuffix);
    });

    // True is ANY linkSuffixes are filled
    setSocialsShowing(
      linkSuffixes.some(
        (x) => x !== null && x !== "" && typeof x !== "undefined"
      )
    );
  }, [renderedMarkdown.socials, mounted]);

  useEffect(() => {
    if (!mounted) return;

    let badgesList = [];
    Object.entries(renderedMarkdown.badges).map((badge) => {
      badgesList.push(badge[1].selected);
    });
    // True is ANY badges are switched on are filled
    if (badgesList.length > 0) {
      setBadgesShowing(badgesList.some((x) => x !== null && x !== false));
    } else {
      setBadgesShowing(false);
    }
  }, [renderedMarkdown.badges, mounted]);

  return {
    socialsShowing,
    badgesShowing,
  };
};
