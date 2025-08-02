import React from "react";
import { useTheme } from "next-themes";
import DraggableSocialIcon from "./DraggableSocialIcon";
import DraggableSkillIcon from "./DraggableSkillIcon";

export default function PreviewRenderer({
  state,
  sectionOrder,
  skillsEmpty,
  socialsShowing,
  badgesShowing,
  supportStore,
  withSupport,
  socialsOrder,
  onSocialDragStart,
  onSocialDragOver,
  onSocialDrop,
  isSocialDragging,
  socialDraggedIndex,
  skillsOrder,
  onSkillsDragStart,
  onSkillsDragOver,
  onSkillsDrop,
  isSkillsDragging,
  skillsDraggedIndex,
}) {
  const { theme } = useTheme();

  const renderSection = (sectionType) => {
    switch (sectionType) {
      case "introduction":
        return (
          <div
            className={`${
              state.introduction.name ||
              state.introduction.animatedHand ||
              state.introduction.shortDescription ||
              state.introduction.longDescription ||
              state.introduction.location ||
              (state.introduction.workingOnTitle &&
                state.introduction.workingOnLink) ||
              (state.introduction.portfolioTitle &&
                state.introduction.portfolioLink) ||
              state.introduction.emailMe ||
              state.introduction.learning ||
              state.introduction.collaborateOn ||
              state.introduction.additionalInfo
                ? "mb-4"
                : ""
            }`}
          >
            {!state.introduction.name ? null : (
              <div>
                {state.introduction.animatedHand == 0 && (
                  <h1>Hi 👋 My name is {state.introduction.name}</h1>
                )}
                {state.introduction.animatedHand != 0 && (
                  <h1>
                    Hi{" "}
                    <span>
                      <img
                        style={{ display: "inline" }}
                        height={"36px"}
                        width={"36px"}
                        src={
                          "https://user-images.githubusercontent.com/18350557/176309783-0785949b-9127-417c-8b55-ab5a4333674e.gif"
                        }
                      />
                    </span>
                    My name is {state.introduction.name}
                  </h1>
                )}
              </div>
            )}
            {state.introduction.shortDescription ? (
              <h2>{state.introduction.shortDescription}</h2>
            ) : null}

            {state.introduction.longDescription
              ? state.introduction.longDescription.split("\n").map((line) => (
                  <p className="whitespace-pre-line" key={line}>
                    {line}
                  </p>
                ))
              : null}

            <ul
              className={`${
                state.introduction.location ||
                (state.introduction.workingOnTitle &&
                  state.introduction.workingOnLink) ||
                (state.introduction.portfolioTitle &&
                  state.introduction.portfolioLink) ||
                state.introduction.learning ||
                state.introduction.emailMe ||
                state.introduction.collaborateOn ||
                state.introduction.additionalInfo
                  ? "mt-4 "
                  : ""
              }list-disc list-inside`}
            >
              {state.introduction.location ? (
                <li>
                  🌍&nbsp; I&apos;m based in {state.introduction.location}
                </li>
              ) : null}
              {state.introduction.portfolioTitle &&
              state.introduction.portfolioLink ? (
                <li>
                  🖥️&nbsp; See my portfolio at{" "}
                  <a
                    href={`http://${state.introduction.portfolioLink}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {state.introduction.portfolioTitle}
                  </a>
                </li>
              ) : null}
              {state.introduction.emailMe ? (
                <li>
                  ✉️&nbsp; You can contact me at{" "}
                  <a href={`mailto:${state.introduction.emailMe}`}>
                    {state.introduction.emailMe}
                  </a>
                </li>
              ) : null}
              {state.introduction.workingOnTitle &&
              state.introduction.workingOnLink ? (
                <li>
                  🚀&nbsp; I&apos;m currently working on{" "}
                  <a
                    href={`http://${state.introduction.workingOnLink}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {state.introduction.workingOnTitle}
                  </a>
                </li>
              ) : null}
              {state.introduction.learning ? (
                <li>
                  🧠&nbsp; I&apos;m learning {state.introduction.learning}
                </li>
              ) : null}
              {state.introduction.collaborateOn ? (
                <li>
                  🤝&nbsp; I&apos;m open to collaborating on{" "}
                  {state.introduction.collaborateOn}
                </li>
              ) : null}
              {state.introduction.additionalInfo ? (
                <li>⚡&nbsp; {state.introduction.additionalInfo}</li>
              ) : null}
            </ul>
          </div>
        );

      case "badges":
        return (
          <>
            {/* GitHub, Twitter and Twitch Badges */}
            <div
              className={`flex flex-wrap gap-x-2 gap-y-2 ${
                state.badges.githubFollowers.selected ||
                state.badges.twitterFollowers.selected
                  ? "mb-4"
                  : "mb-0"
              }`}
            >
              {state.badges.githubFollowers.selected ? (
                <img
                  src={`https://img.shields.io/github/followers/${state.socials.github.linkSuffix}?logo=github&style=for-the-badge&color=${state.badges.cardStyle.iconColor}&labelColor=${state.badges.cardStyle.bgColor}`}
                  className="object-scale-down"
                />
              ) : null}
              {state.badges.twitterFollowers.selected ? (
                <img
                  src={`https://img.shields.io/twitter/follow/${state.socials.twitter.linkSuffix}?logo=twitter&style=for-the-badge&color=${state.badges.cardStyle.iconColor}&labelColor=${state.badges.cardStyle.bgColor}`}
                  className="object-scale-down"
                />
              ) : null}
              {state.badges.twitchStatus.selected ? (
                <img
                  src={`https://img.shields.io/twitch/status/${state.socials.twitch.linkSuffix}?logo=twitchsx&style=for-the-badge&color=${state.badges.cardStyle.iconColor}&labelColor=${state.badges.cardStyle.bgColor}&label=TWITCH+STATUS`}
                  className="object-scale-down"
                />
              ) : null}
            </div>

            <div className="flex">{badgesShowing ? <h3>Badges</h3> : null}</div>

            {/* Badges Section Preview */}
            <div className="flex flex-col items-start gap-x-2 gap-y-2">
              {state.badges.githubStatsCard.selected ||
              state.badges.githubCommitsGraph.selected ||
              state.badges.githubStreak.selected ||
              state.badges.topLangsCard.selected ? (
                <p className="font-bold">My GitHub Stats</p>
              ) : null}

              {state.badges.githubStatsCard.selected ? (
                <a
                  href={`http://www.github.com/${state.socials.github.linkSuffix}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={`https://github-readme-stats.vercel.app/api?username=${
                      state.socials.github.linkSuffix
                    }&hide=${
                      state.badges.githubStatsCard.stars ? "" : "stars,"
                    }${state.badges.githubStatsCard.commits ? "" : "commits,"}${
                      state.badges.githubStatsCard.prs ? "" : "prs,"
                    }${state.badges.githubStatsCard.issues ? "" : "issues,"}${
                      state.badges.githubStatsCard.contribs ? "" : "contribs"
                    }${
                      state.badges.githubStatsCard.privateCommits
                        ? "&count_private=true"
                        : ""
                    }&title_color=${
                      state.badges.cardStyle.titleColor
                    }&text_color=${
                      state.badges.cardStyle.textColor
                    }&icon_color=${state.badges.cardStyle.iconColor}&bg_color=${
                      state.badges.cardStyle.bgColor
                    }&hide_border=true&border_radius=0&show_icons=true`}
                    className="object-scale-down"
                  />
                </a>
              ) : null}

              {state.badges.githubStreak.selected ? (
                <a
                  href={`http://www.github.com/${state.socials.github.linkSuffix}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={`https://github-readme-streak-stats.herokuapp.com/?user=${state.socials.github.linkSuffix}&stroke=${state.badges.cardStyle.textColor}&background=${state.badges.cardStyle.bgColor}&ring=${state.badges.cardStyle.titleColor}&fire=${state.badges.cardStyle.titleColor}&currStreakNum=${state.badges.cardStyle.textColor}&currStreakLabel=${state.badges.cardStyle.titleColor}&sideNums=${state.badges.cardStyle.textColor}&sideLabels=${state.badges.cardStyle.textColor}&dates=${state.badges.cardStyle.textColor}&hide_border=true`}
                    className="object-scale-down"
                  />
                </a>
              ) : null}

              {state.badges.githubCommitsGraph.selected ? (
                <a
                  href={`http://www.github.com/${state.socials.github.linkSuffix}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={`https://github-readme-activity-graph.vercel.app/graph?username=${state.socials.github.linkSuffix}&bg_color=${state.badges.cardStyle.bgColor}&color=${state.badges.cardStyle.textColor}&line=${state.badges.cardStyle.iconColor}&point=${state.badges.cardStyle.textColor}&area_color=${state.badges.cardStyle.bgColor}&area=true&hide_border=true&custom_title=GitHub%20Commits%20Graph`}
                  />
                </a>
              ) : null}

              {state.badges.topLangsCard.selected ? (
                <a
                  href={`http://www.github.com/${state.socials.github.linkSuffix}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={`https://github-readme-stats.vercel.app/api/top-langs/?username=danielcranney&langs_count=10&title_color=${state.badges.cardStyle.titleColor}&text_color=${state.badges.cardStyle.textColor}&icon_color=${state.badges.cardStyle.iconColor}&bg_color=${state.badges.cardStyle.bgColor}&hide_border=true&locale=en&custom_title=Top%20%Languages`}
                  />
                </a>
              ) : null}

              {/* Repo Cards */}
              {state.badges.reposCard.selected ? (
                <>
                  <p className="mt-2 font-bold text-dark-300">
                    Top Repositories
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {state.badges.reposCard.repoOne ? (
                      <a
                        href={`https://www.github.com/${state.socials.github.linkSuffix}/${state.badges.reposCard.repoOne}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={`https://github-readme-stats.vercel.app/api/pin/?username=${state.socials.github.linkSuffix}&repo=${state.badges.reposCard.repoOne}&title_color=${state.badges.cardStyle.titleColor}&text_color=${state.badges.cardStyle.textColor}&icon_color=${state.badges.cardStyle.iconColor}&bg_color=${state.badges.cardStyle.bgColor}&hide_border=true&locale=en`}
                        />
                      </a>
                    ) : (
                      <span className="text-sm">
                        Please enter a repository name.
                      </span>
                    )}

                    {state.badges.reposCard.repoTwo ? (
                      <a
                        href={`https://www.github.com/${state.socials.github.linkSuffix}/${state.badges.reposCard.repoTwo}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={`https://github-readme-stats.vercel.app/api/pin/?username=${state.socials.github.linkSuffix}&repo=${state.badges.reposCard.repoTwo}&title_color=${state.badges.cardStyle.titleColor}&text_color=${state.badges.cardStyle.textColor}&icon_color=${state.badges.cardStyle.iconColor}&bg_color=${state.badges.cardStyle.bgColor}&hide_border=true&locale=en`}
                        />
                      </a>
                    ) : null}

                    {state.badges.reposCard.repoThree ? (
                      <a
                        href={`https://www.github.com/${state.socials.github.linkSuffix}/${state.badges.reposCard.repoThree}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={`https://github-readme-stats.vercel.app/api/pin/?username=${state.socials.github.linkSuffix}&repo=${state.badges.reposCard.repoThree}&title_color=${state.badges.cardStyle.titleColor}&text_color=${state.badges.cardStyle.textColor}&icon_color=${state.badges.cardStyle.iconColor}&bg_color=${state.badges.cardStyle.bgColor}&hide_border=true&locale=en`}
                        />
                      </a>
                    ) : null}

                    {state.badges.reposCard.repoFour ? (
                      <a
                        href={`https://www.github.com/${state.socials.github.linkSuffix}/${state.badges.reposCard.repoFour}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={`https://github-readme-stats.vercel.app/api/pin/?username=${state.socials.github.linkSuffix}&repo=${state.badges.reposCard.repoFour}&title_color=${state.badges.cardStyle.titleColor}&text_color=${state.badges.cardStyle.textColor}&icon_color=${state.badges.cardStyle.iconColor}&bg_color=${state.badges.cardStyle.bgColor}&hide_border=true&locale=en`}
                        />
                      </a>
                    ) : null}
                  </div>
                </>
              ) : null}
            </div>
          </>
        );

      case "skills":
        return (
          <>
            {/* Skills Section Preview */}
            <div className="flex">{skillsEmpty ? null : <h3>Skills</h3>}</div>

            {/* Skills Section Preview */}
            <div
              className={`flex flex-wrap gap-y-1.5 gap-x-1.5 ${
                skillsEmpty ? "mb-0" : "mb-4"
              }`}
            >
              {/* Icons Display */}
              {skillsOrder && skillsOrder.length > 0 ? (
                <div className="flex gap-x-1.5 flex-wrap gap-y-1.5">
                  {skillsOrder.map((skill, index) => (
                    <DraggableSkillIcon
                      key={`skill-${skill.path}-${index}`}
                      skill={skill}
                      index={index}
                      onDragStart={onSkillsDragStart}
                      onDragOver={onSkillsDragOver}
                      onDrop={onSkillsDrop}
                      isDragging={isSkillsDragging}
                      draggedIndex={skillsDraggedIndex}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </>
        );

      case "socials":
        return (
          <>
            {/* Socials Title Preview */}
            <div className="flex">
              {socialsShowing ? <h3>Socials</h3> : null}
            </div>

            {/* Socials Section Preview */}
            <div
              className={`flex flex-wrap gap-x-2 gap-y-2 ${
                socialsShowing ? "mb-4" : ""
              }`}
            >
              {/* Show socials based on order, but only those with links */}
              {socialsOrder && socialsOrder.length > 0
                ? socialsOrder.map(({ key, data }, index) => (
                    <DraggableSocialIcon
                      key={`social-${key}-${index}`}
                      socialKey={key}
                      socialData={data}
                      index={index}
                      onDragStart={onSocialDragStart}
                      onDragOver={onSocialDragOver}
                      onDrop={onSocialDrop}
                      isDragging={isSocialDragging}
                      draggedIndex={socialDraggedIndex}
                    />
                  ))
                : null}
            </div>
          </>
        );

      case "support":
        return (
          <div
            className={`flex flex-col gap-x-2 gap-y-2 ${
              !!withSupport ? "mt-4" : ""
            }`}
          >
            {!!withSupport && (
              <>
                <h3>Support</h3>
                <ul className="list-none">
                  {Object.entries(state.support).map(([key, value]) =>
                    value && value.linkSuffix ? (
                      <li
                        className="inline-block p-1"
                        key={`${value.linkPrefix || ""}${
                          value.linkSuffix || ""
                        }`}
                      >
                        <a
                          href={`${value.linkPrefix || ""}${
                            value.linkSuffix || ""
                          }`}
                        >
                          <img
                            src={
                              value?.previewIMG ?? supportStore[key].previewIMG
                            }
                            className="object-scale-down"
                            width="150"
                          />
                        </a>
                      </li>
                    ) : null
                  )}
                </ul>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <article id="preview-container" className="relative">
      {sectionOrder.map((sectionType, index) => (
        <React.Fragment key={`section-${sectionType}-${index}`}>
          {renderSection(sectionType)}
        </React.Fragment>
      ))}
    </article>
  );
}
