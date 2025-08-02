import React, { useContext, forwardRef, useState, useEffect } from "react";
import { StateContext } from "../../pages/_app";

const MinimalSocialFormInput = forwardRef((props, ref) => {
  const { placeholder, action, type, section } = props;
  const { state, dispatch } = useContext(StateContext);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestedUsername, setSuggestedUsername] = useState("");
  const [suggestedUsernameCount, setSuggestedUsernameCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  // Check if there's a common username already used in other social fields
  useEffect(() => {
    const socialPlatforms = [
      "github",
      "gitlab",
      "twitter",
      "threads",
      "hashnode",
      "medium",
      "devdotto",
      "linkedin",
      "polywork",
      "twitch",
      "youtube",
      "discord",
      "instagram",
      "facebook",
      "dribbble",
    ];

    const filledUsernames = socialPlatforms
      .filter((platform) => platform !== type)
      .map((platform) => state[section][platform]?.linkSuffix?.trim())
      .filter((username) => username && username.length > 0);

    if (filledUsernames.length > 0) {
      // Find the most common username
      const usernameCounts = {};
      filledUsernames.forEach((username) => {
        usernameCounts[username] = (usernameCounts[username] || 0) + 1;
      });

      const mostCommonUsername = Object.keys(usernameCounts).reduce((a, b) =>
        usernameCounts[a] > usernameCounts[b] ? a : b
      );

      const usageCount = usernameCounts[mostCommonUsername];

      if (
        mostCommonUsername &&
        !state[section][type]?.linkSuffix?.trim() &&
        isFocused
      ) {
        setSuggestedUsername(mostCommonUsername);
        setSuggestedUsernameCount(usernameCounts[mostCommonUsername]);
        setShowSuggestion(true);
      } else {
        setShowSuggestion(false);
      }
    } else {
      setShowSuggestion(false);
    }
  }, [state, section, type, isFocused]);

  const handleUseSuggestion = () => {
    dispatch({
      type: action,
      payload: { title: type, value: suggestedUsername },
    });
    setShowSuggestion(false);
  };

  return (
    <div className="relative">
      <input
        name={type}
        className="minimal-input-field appearance-none"
        placeholder={placeholder}
        ref={ref}
        value={state[section][type]["linkSuffix"]}
        onChange={() =>
          dispatch({
            type: action,
            payload: { title: type, value: ref.current.value },
          })
        }
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          // Don't hide immediately if clicking on the suggestion
          if (
            e.relatedTarget &&
            e.relatedTarget.closest(".suggestion-dropdown")
          ) {
            return;
          }
          setIsFocused(false);
          // Delay hiding suggestion to allow clicking on it
          setTimeout(() => setShowSuggestion(false), 150);
        }}
      />
      {showSuggestion && (
        <div className="suggestion-dropdown absolute top-full left-0 right-0 mt-1 bg-white dark:bg-dark-800 border border-neutral-600 dark:border-neutral-400 rounded-md shadow-xl z-50 p-2 min-w-[280px]">
          <button
            type="button"
            onClick={handleUseSuggestion}
            className="w-full px-3 py-0 text-left text-xs font-medium text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors duration-150 rounded whitespace-nowrap overflow-hidden text-ellipsis"
          >
            📋 Use &apos;{suggestedUsername}&apos; (already used &nbsp;{" "}
            {suggestedUsernameCount} time{suggestedUsernameCount > 1 ? "s" : ""}
            )
          </button>
        </div>
      )}
    </div>
  );
});

MinimalSocialFormInput.displayName = "MinimalSocialFormInput";

export default MinimalSocialFormInput;
