import React, { useRef, useContext } from "react";
import { ACTIONS } from "../../pages/_app";
import { StateContext } from "../../pages/_app";
import NextSection from "../buttons/NextSection";
import PreviousSection from "../buttons/PreviousSection";

import SectionHeader from "../SectionHeader";
import ToggleBadgeButton from "../buttons/ToggleBadgeButton";
import StyleBadgeButton from "../buttons/StyleBadgeButton";
import ToggleBadgeElementCheckbox from "../buttons/ToggleBadgeElementCheckbox";
import AddRepoInput from "../forms/AddRepoInput";
import AddRepo from "../buttons/AddRepo";
import DeleteRepo from "../buttons/DeleteRepo";

const Badges = React.forwardRef((props, ref) => {
  const {
    badgesShowing,
    colorStore,
    handleStyleBadge,
    handleChangeBadgeColor,
    handleBadgeToggle,
    handleBadgeElementToggle,
  } = props;
  const { state, dispatch } = useContext(StateContext);

  // Repo Card Refs
  const repoOneRef = useRef();
  const repoTwoRef = useRef();
  const repoThreeRef = useRef();
  const repoFourRef = useRef();

  return (
    <>
      <section className="section-header-wrapper">
        <SectionHeader
          header={"Badges"}
          subhead={`Add some badges and stats to your profile.`}
        />
        <div className="flex mt-4">
          <PreviousSection sectionToGoTo={"socials"} />
          <NextSection sectionToGoTo={"support"} />
        </div>
      </section>
      <section className="flex flex-col overflow-y-auto">
        <div ref={ref}></div>
        <section className="flex flex-col p-6">
          {/* Customise */}
          <article className="mb-0">
            <p
              className={`mb-2 text-xs font-semibold uppercase dark:text-white`}
            >
              Style badges:
            </p>
            {!badgesShowing ? (
              <p className="text-xs">Select a badge below to customise.</p>
            ) : null}
            <article className="grid grid-cols-1 gap-2 mb-4 xl:grid-cols-2">
              <StyleBadgeButton
                colorList={colorStore.lightColors}
                badgeKeyToStyle={"titleColor"}
                badgeText={"Title"}
                handleStyleBadge={handleStyleBadge}
                badgeKeyToHide={"titleColorEdit"}
                badgesShowing={badgesShowing}
                handleChangeBadgeColor={handleChangeBadgeColor}
              />

              <StyleBadgeButton
                colorList={colorStore.lightColors}
                badgeKeyToStyle={"textColor"}
                badgeText={"Text"}
                handleStyleBadge={handleStyleBadge}
                badgeKeyToHide={"textColorEdit"}
                badgesShowing={badgesShowing}
                handleChangeBadgeColor={handleChangeBadgeColor}
              />

              <StyleBadgeButton
                colorList={colorStore.lightColors}
                badgeKeyToStyle={"iconColor"}
                badgeText={"Icons"}
                handleStyleBadge={handleStyleBadge}
                badgeKeyToHide={"iconColorEdit"}
                badgesShowing={badgesShowing}
                handleChangeBadgeColor={handleChangeBadgeColor}
              />

              <StyleBadgeButton
                colorList={colorStore.darkColors}
                badgeKeyToStyle={"bgColor"}
                badgeText={"Background"}
                handleStyleBadge={handleStyleBadge}
                badgeKeyToHide={"bgColorEdit"}
                badgesShowing={badgesShowing}
                handleChangeBadgeColor={handleChangeBadgeColor}
              />
            </article>
          </article>
          <article className="flex flex-col mb-4 gap-y-4">
            <h3 className="mb-0">GitHub</h3>
            {!state.socials.github.linkSuffix ? (
              <p className="mb-2 text-xs">
                Please{" "}
                <a
                  onClick={() => {
                    dispatch({
                      type: ACTIONS.SHOW_SECTION,
                      payload: "socials",
                    });
                  }}
                >
                  add your GitHub profile
                </a>{" "}
                in the socials section.
              </p>
            ) : null}
            {/* GitHub Stats Card */}
            <article>
              <ToggleBadgeButton
                badgeType={"githubStatsCard"}
                profileLink={"github"}
                badgeText={"Stats Card"}
                handleBadgeToggle={handleBadgeToggle}
              />

              <article
                className={`flex flex-col p-4 border-b border-l border-r dark:border-dark-700 border-light-200 overflow-hidden transform transition-all duration-150 ease-in-out rounded-bl-md rounded-br-md ${
                  state.badges.githubStatsCard.selected
                    ? "block"
                    : "hidden -translate-y-3"
                }`}
              >
                <p
                  className={`mb-2 text-xs font-semibold uppercase transition-all duration-150 ease-in-out ${
                    state.badges.githubStatsCard.selected
                      ? "opacity-100"
                      : "opacity-0 -translate-y-3"
                  }`}
                >
                  Show:
                </p>
                <article className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                  <ToggleBadgeElementCheckbox
                    badgeType={"githubStatsCard"}
                    badgeKeyToHide={"stars"}
                    badgeText={"Stars"}
                    handleBadgeElementToggle={handleBadgeElementToggle}
                  />
                  <ToggleBadgeElementCheckbox
                    badgeType={"githubStatsCard"}
                    badgeKeyToHide={"commits"}
                    badgeText={"Commits"}
                    handleBadgeElementToggle={handleBadgeElementToggle}
                  />
                  <ToggleBadgeElementCheckbox
                    badgeType={"githubStatsCard"}
                    badgeKeyToHide={"prs"}
                    badgeText={"PRs"}
                    handleBadgeElementToggle={handleBadgeElementToggle}
                  />
                  <ToggleBadgeElementCheckbox
                    badgeType={"githubStatsCard"}
                    badgeKeyToHide={"issues"}
                    badgeText={"Issues"}
                    handleBadgeElementToggle={handleBadgeElementToggle}
                  />
                  <ToggleBadgeElementCheckbox
                    badgeType={"githubStatsCard"}
                    badgeKeyToHide={"contribs"}
                    badgeText={"Contributions"}
                    handleBadgeElementToggle={handleBadgeElementToggle}
                  />
                  <ToggleBadgeElementCheckbox
                    badgeType={"githubStatsCard"}
                    badgeKeyToHide={"privateCommits"}
                    badgeText={"Private Commits"}
                    handleBadgeElementToggle={handleBadgeElementToggle}
                  />
                </article>
              </article>
            </article>

            <ToggleBadgeButton
              badgeType={"githubStreak"}
              profileLink={"github"}
              badgeText={"Commit Streak"}
              handleBadgeToggle={handleBadgeToggle}
            />

            {/* GitHub Commits Graph Badge */}
            <ToggleBadgeButton
              badgeType={"githubCommitsGraph"}
              profileLink={"github"}
              badgeText={"Commits Graph"}
              handleBadgeToggle={handleBadgeToggle}
            />

            {/* Top Languages Card */}
            <ToggleBadgeButton
              badgeType={"topLangsCard"}
              profileLink={"github"}
              badgeText={"Top Languages"}
              handleBadgeToggle={handleBadgeToggle}
            />

            {/* Repository Card */}
            <article>
              <ToggleBadgeButton
                badgeType={"reposCard"}
                profileLink={"github"}
                badgeText={"Top Repositories"}
                handleBadgeToggle={handleBadgeToggle}
              />

              <article
                className={`flex flex-col p-4 border-b border-l border-r dark:border-dark-700 border-light-200 overflow-hidden transform transition-all duration-150 ease-in-out rounded-bl-md rounded-br-md ${
                  state.badges.reposCard.selected
                    ? "block"
                    : "hidden -translate-y-3"
                }`}
              >
                <p
                  className={`mb-2 text-xs font-semibold uppercase dark:text-white`}
                >
                  Find Repositories
                </p>
                <p className="text-xs">
                  The repository must be the same as it is on your GitHub
                  (including hyphens, NOT case-sensitive).
                </p>
                <article className="grid grid-cols-1 gap-2 mb-2">
                  <AddRepoInput
                    ref={repoOneRef}
                    section={"reposCard"}
                    type={"repoOne"}
                    placeholder={"repo-name"}
                    action={ACTIONS.ADD_REPO}
                  />

                  {state.badges.reposCard.repoTwo != null ? (
                    <article className="flex gap-x-2 h-9.5">
                      <AddRepoInput
                        ref={repoTwoRef}
                        section={"reposCard"}
                        type={"repoTwo"}
                        placeholder={"repo-name"}
                        action={ACTIONS.ADD_REPO}
                      />
                      <DeleteRepo
                        action={ACTIONS.DELETE_REPO}
                        type={"repoTwo"}
                      />
                    </article>
                  ) : null}

                  {state.badges.reposCard.repoThree != null ? (
                    <article className="flex gap-x-2 h-9.5">
                      <AddRepoInput
                        ref={repoThreeRef}
                        section={"reposCard"}
                        type={"repoThree"}
                        placeholder={"repo-name"}
                        action={ACTIONS.ADD_REPO}
                      />
                      <DeleteRepo
                        action={ACTIONS.DELETE_REPO}
                        type={"repoThree"}
                      />
                    </article>
                  ) : null}

                  {state.badges.reposCard.repoFour != null ? (
                    <article className="flex gap-x-2 h-9.5">
                      <AddRepoInput
                        ref={repoFourRef}
                        section={"reposCard"}
                        type={"repoFour"}
                        placeholder={"repo-name"}
                        action={ACTIONS.ADD_REPO}
                      />
                      <DeleteRepo
                        action={ACTIONS.DELETE_REPO}
                        type={"repoFour"}
                      />
                    </article>
                  ) : null}
                </article>
                {state.badges.reposCard.repoTwo != null ? null : (
                  <>
                    <AddRepo
                      action={ACTIONS.ADD_REPO}
                      repoNumberToAdd={"repoTwo"}
                    />
                  </>
                )}

                {state.badges.reposCard.repoThree != null ||
                state.badges.reposCard.repoTwo == null ? null : (
                  <>
                    <AddRepo
                      action={ACTIONS.ADD_REPO}
                      repoNumberToAdd={"repoThree"}
                    />
                  </>
                )}

                {state.badges.reposCard.repoFour != null ||
                state.badges.reposCard.repoTwo == null ||
                state.badges.reposCard.repoThree == null ? null : (
                  <>
                    <AddRepo
                      action={ACTIONS.ADD_REPO}
                      repoNumberToAdd={"repoFour"}
                    />
                  </>
                )}
              </article>
            </article>

            {/* GitHub Followers Badge */}
            <ToggleBadgeButton
              badgeType={"githubFollowers"}
              profileLink={"github"}
              badgeText={"Follower Count"}
              handleBadgeToggle={handleBadgeToggle}
            />
          </article>
          <article className="flex flex-col mb-4 gap-y-4">
            <h3 className="mb-0">Twitter</h3>
            {!state.socials.twitter.linkSuffix ? (
              <p className="mb-2 text-xs">
                Please{" "}
                <a
                  onClick={() => {
                    dispatch({
                      type: ACTIONS.SHOW_SECTION,
                      payload: "socials",
                    });
                  }}
                >
                  add your Twitter profile
                </a>{" "}
                in the socials section.
              </p>
            ) : null}
            {/* Twitter Followers Badge */}
            <ToggleBadgeButton
              badgeType={"twitterFollowers"}
              profileLink={"twitter"}
              badgeText={"Follower Count"}
              handleBadgeToggle={handleBadgeToggle}
            />
          </article>
          <article className="flex flex-col mb-4 gap-y-4">
            <h3 className="mb-0">Twitch</h3>
            {!state.socials.twitch.linkSuffix ? (
              <p className="mb-2 text-xs">
                Please{" "}
                <a
                  onClick={() => {
                    dispatch({
                      type: ACTIONS.SHOW_SECTION,
                      payload: "socials",
                    });
                  }}
                >
                  add your Twitch profile
                </a>{" "}
                in the socials section.
              </p>
            ) : null}
            {/* Twitch Channel Badge */}
            <ToggleBadgeButton
              badgeType={"twitchStatus"}
              profileLink={"twitch"}
              badgeText={"Streaming Status"}
              handleBadgeToggle={handleBadgeToggle}
            />
          </article>
          <section className="flex mt-4">
            <PreviousSection sectionToGoTo={"socials"} />
            <NextSection sectionToGoTo={"support"} />
          </section>
        </section>
      </section>
    </>
  );
});

Badges.displayName = "Badges";
export default Badges;
