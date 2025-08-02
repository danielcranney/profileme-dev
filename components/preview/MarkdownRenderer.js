import React from "react";

export default function MarkdownRenderer({
  renderedMarkdown,
  state,
  sectionOrder,
  socialsShowing,
  badgesShowing,
  markdownSkillsEmpty,
  buildMarkdownSkill,
  supportStore,
  socialsOrder,
  skillsOrder,
}) {
  const assembleSupportLink = (key) => {
    if (!state.support || !state.support[key]) {
      return "";
    }
    return `${state.support[key].linkPrefix || ""}${
      state.support[key].linkSuffix || ""
    }`;
  };

  const getSupportPreviewIMG = (key, value) => {
    if (!supportStore[key]) {
      return "";
    }
    return value?.previewIMG ?? supportStore[key].previewIMG;
  };

  const renderMarkdownSection = (sectionType) => {
    switch (sectionType) {
      case "introduction":
        return renderedMarkdown.introduction ? (
          <p
            key="introduction"
            className="text-xs whitespace-pre-line break-all"
          >
            {renderedMarkdown.introduction}
          </p>
        ) : null;

      case "badges":
        return (
          <div key="badges">
            {!renderedMarkdown.badges.githubFollowers.selected ? null : (
              <span className="text-xs break-all whitespace-pre-line">
                {`<a href="${state.socials?.github?.linkPrefix || ""}${
                  state.socials?.github?.linkSuffix || ""
                }" target="_blank" rel="noreferrer"><img
                src="https://img.shields.io/github/followers/${
                  state.socials?.github?.linkSuffix || ""
                }?logo=github&style=for-the-badge&color=${
                  state.badges?.cardStyle?.iconColor || ""
                }&labelColor=${state.badges?.cardStyle?.bgColor || ""}" /></a>`}
              </span>
            )}
            {!renderedMarkdown.badges.twitterFollowers.selected ? null : (
              <span className="text-xs break-all whitespace-pre-line">
                {`<a href="${state.socials?.twitter?.linkPrefix || ""}${
                  state.socials?.twitter?.linkSuffix || ""
                }" target="_blank" rel="noreferrer"><img
                src="https://img.shields.io/twitter/follow/${
                  state.socials?.twitter?.linkSuffix || ""
                }?logo=twitter&style=for-the-badge&color=${
                  state.badges?.cardStyle?.iconColor || ""
                }&labelColor=${state.badges?.cardStyle?.bgColor || ""}"
              /></a>`}
              </span>
            )}
            {!renderedMarkdown.badges.twitchStatus.selected ? null : (
              <span className="text-xs break-all whitespace-pre-line">
                {`<a href="${state.socials?.twitch?.linkPrefix || ""}${
                  state.socials?.twitch?.linkSuffix || ""
                }" target="_blank" rel="noreferrer"><img
                src="https://img.shields.io/twitch/status/${
                  state.socials?.twitch?.linkSuffix || ""
                }?logo=twitchsx&style=for-the-badge&color=${
                  state.badges?.cardStyle?.iconColor || ""
                }&labelColor=${
                  state.badges?.cardStyle?.bgColor || ""
                }&label=TWITCH+STATUS" /></a>`}
              </span>
            )}

            {badgesShowing ? (
              <p className="mt-4 break-all whitespace-pre-line">{`### Badges`}</p>
            ) : null}

            {renderedMarkdown.badges.githubStatsCard.selected ||
            renderedMarkdown.badges.githubCommitsGraph.selected ||
            renderedMarkdown.badges.githubStreak.selected ? (
              <p className="break-all whitespace-pre-line">{`<b>My GitHub Stats</b>`}</p>
            ) : null}
            {!renderedMarkdown.badges.githubStatsCard.selected ? null : (
              <p className="mb-0 break-all">
                {`<a
                    href="http://www.github.com/${
                      state.socials.github.linkSuffix
                    }"><img src="https://github-readme-stats.vercel.app/api?username=${
                  state.socials.github.linkSuffix
                }&show_icons=true&hide=${
                  state.badges.githubStatsCard.stars ? "" : "stars,"
                }${state.badges.githubStatsCard.commits ? "" : "commits,"}${
                  state.badges.githubStatsCard.prs ? "" : "prs,"
                }${state.badges.githubStatsCard.issues ? "" : "issues,"}${
                  state.badges.githubStatsCard.contribs ? "" : "contribs"
                }${
                  state.badges.githubStatsCard.privateCommits
                    ? "&count_private=true"
                    : ""
                }&title_color=${state.badges.cardStyle.titleColor}&text_color=${
                  state.badges.cardStyle.textColor
                }&icon_color=${state.badges.cardStyle.iconColor}&bg_color=${
                  state.badges.cardStyle.bgColor
                }&hide_border=true&show_icons=true" alt="${
                  state.socials.github.linkSuffix
                }'s GitHub stats" /></a>`}
              </p>
            )}

            {!renderedMarkdown.badges.githubStreak.selected ? null : (
              <p className="mb-0 break-all">
                {`<a
                    href="http://www.github.com/${state.socials.github.linkSuffix}"><img
                src="https://github-readme-streak-stats.herokuapp.com/?user=${state.socials.github.linkSuffix}&stroke=${state.badges.cardStyle.textColor}&background=${state.badges.cardStyle.bgColor}&ring=${state.badges.cardStyle.titleColor}&fire=${state.badges.cardStyle.titleColor}&currStreakNum=${state.badges.cardStyle.textColor}&currStreakLabel=${state.badges.cardStyle.titleColor}&sideNums=${state.badges.cardStyle.textColor}&sideLabels=${state.badges.cardStyle.textColor}&dates=${state.badges.cardStyle.textColor}&hide_border=true" /></a>`}
              </p>
            )}

            {!renderedMarkdown.badges.topLangsCard.selected ? null : (
              <p className="mb-0 break-all whitespace-pre-line">
                {`<a href="https://github.com/${state.socials.github.linkSuffix}" align="left"><img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${state.socials.github.linkSuffix}&langs_count=10&title_color=${state.badges.cardStyle.titleColor}&text_color=${state.badges.cardStyle.textColor}&icon_color=${state.badges.cardStyle.iconColor}&bg_color=${state.badges.cardStyle.bgColor}&hide_border=true&locale=en&custom_title=Top%20%Languages" alt="Top Languages" /></a>`}
              </p>
            )}

            {renderedMarkdown.badges.reposCard.selected ? (
              <p className="mt-4 whitespace-pre-line">
                {`<b>Top Repositories</b>`}
              </p>
            ) : null}

            <p className="mt-4 break-all whitespace-pre-line">
              {renderedMarkdown.badges.reposCard.selected ? (
                <>{`<div width="100%" align="center">`}</>
              ) : null}

              {renderedMarkdown.badges.reposCard.selected &&
              state.badges.reposCard.repoOne ? (
                <>
                  {`<a href="https://github.com/${state.socials.github.linkSuffix}/${state.badges.reposCard.repoOne}" align="left"><img align="left" width="45%" src="https://github-readme-stats.vercel.app/api/pin/?username=${state.socials.github.linkSuffix}&repo=${state.badges.reposCard.repoOne}&title_color=${state.badges.cardStyle.titleColor}&text_color=${state.badges.cardStyle.textColor}&icon_color=${state.badges.cardStyle.iconColor}&bg_color=${state.badges.cardStyle.bgColor}&hide_border=true&locale=en" /></a>`}
                </>
              ) : null}

              {renderedMarkdown.badges.reposCard.selected &&
              state.badges.reposCard.repoTwo ? (
                <>
                  {`<a href="https://github.com/${state.socials.github.linkSuffix}/${state.badges.reposCard.repoTwo}" align="right"><img align="right" width="45%" src="https://github-readme-stats.vercel.app/api/pin/?username=${state.socials.github.linkSuffix}&repo=${state.badges.reposCard.repoTwo}&title_color=${state.badges.cardStyle.titleColor}&text_color=${state.badges.cardStyle.textColor}&icon_color=${state.badges.cardStyle.iconColor}&bg_color=${state.badges.cardStyle.bgColor}&hide_border=true&locale=en" /></a>`}
                </>
              ) : null}

              {renderedMarkdown.badges.reposCard.selected ? (
                <>{`</div><br /><br /><br /><br /><br /><br /><br />`}</>
              ) : null}
            </p>

            <p className="mt-4 break-all whitespace-pre-line">
              {renderedMarkdown.badges.reposCard.selected &&
              state.badges.reposCard.repoThree ? (
                <>{`<br /><br /><br /><br /><br />`}</>
              ) : null}
            </p>

            <p className="mt-4 break-all whitespace-pre-line">
              {renderedMarkdown.badges.reposCard.selected &&
              state.badges.reposCard.repoThree ? (
                <>{`<div width="100%" align="center">`}</>
              ) : null}

              {renderedMarkdown.badges.reposCard.selected &&
              state.badges.reposCard.repoThree ? (
                <>
                  {`<a href="https://github.com/${state.socials.github.linkSuffix}/${state.badges.reposCard.repoThree}" align="left"><img align="left" width="45%" src="https://github-readme-stats.vercel.app/api/pin/?username=${state.socials.github.linkSuffix}&repo=${state.badges.reposCard.repoThree}&title_color=${state.badges.cardStyle.titleColor}&text_color=${state.badges.cardStyle.textColor}&icon_color=${state.badges.cardStyle.iconColor}&bg_color=${state.badges.cardStyle.bgColor}&hide_border=true&locale=en" /></a>`}
                </>
              ) : null}

              {renderedMarkdown.badges.reposCard.selected &&
              state.badges.reposCard.repoFour ? (
                <>
                  {`<a href="https://github.com/${state.socials.github.linkSuffix}/${state.badges.reposCard.repoFour}" align="right"><img align="right" width="45%" src="https://github-readme-stats.vercel.app/api/pin/?username=${state.socials.github.linkSuffix}&repo=${state.badges.reposCard.repoFour}&title_color=${state.badges.cardStyle.titleColor}&text_color=${state.badges.cardStyle.textColor}&icon_color=${state.badges.cardStyle.iconColor}&bg_color=${state.badges.cardStyle.bgColor}&hide_border=true&locale=en" /></a>`}
                </>
              ) : null}

              {renderedMarkdown.badges.reposCard.selected &&
              state.badges.reposCard.repoThree ? (
                <>{`</div>`}</>
              ) : null}
            </p>
          </div>
        );

      case "skills":
        return (
          <div key="skills">
            {renderedMarkdown.skillsTitle ? (
              <p className="mt-4 whitespace-pre-line">{`### Skills \n`}</p>
            ) : null}

            <div className="break-all whitespace-pre-line">
              {markdownSkillsEmpty ? null : <span>{`<p align="left">\n`}</span>}

              {skillsOrder && skillsOrder.length > 0
                ? skillsOrder.map((skill, index) => (
                    <span key={`markdown-skill-${skill.path}-${index}`}>
                      {`<a href="${
                        skill.link
                      }" target="_blank" rel="noreferrer"><img src="${
                        skill.darkPath
                          ? `https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${skill.iTag}-colored-dark.svg`
                          : `https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${skill.iTag}-colored.svg`
                      }" alt="${skill.name}" title="${
                        skill.name
                      }" width="36" height="36" /></a>`}
                    </span>
                  ))
                : Object.keys(renderedMarkdown.skills).map((category) =>
                    renderedMarkdown.skills[category].length > 0
                      ? buildMarkdownSkill(renderedMarkdown.skills[category])
                      : null
                  )}

              {markdownSkillsEmpty ? null : (
                <span>{`
                  </p>
                  `}</span>
              )}
            </div>
          </div>
        );

      case "socials":
        return (
          <div key="socials">
            {socialsShowing ? (
              <span className="mt-4 whitespace-pre-line">{`
                ### Socials
                
                `}</span>
            ) : null}

            {socialsShowing ? (
              <span>{`
              <p align="left">`}</span>
            ) : null}
            {socialsOrder.map(({ key, data }, index) => {
              return data.linkSuffix ? (
                <span key={`profile-${key}-${index}`}>
                  {`
                    <a href="${data?.linkPrefix || ""}${
                    data?.linkSuffix || ""
                  }${
                    data?.linkSuffixTwo ? `${data.linkSuffixTwo}` : ""
                  }" target="_blank" rel="noreferrer">
                  <picture>
                  <source media="(prefers-color-scheme: dark)" srcset="${`${
                    data?.darkPath || ""
                  }`}" />
                  <source media="(prefers-color-scheme: light)" srcset="${`${
                    data?.path || ""
                  }`}" />
                  <img src="${`${
                    data?.path || ""
                  }`}" width="32" height="32" alt="${
                    data?.label || ""
                  }" title="${data?.label || ""}" />
                  </picture>
                  </a>`}
                </span>
              ) : null;
            })}
            {socialsShowing ? <span>{`</p>`}</span> : null}
          </div>
        );

      case "support":
        return Object.values(renderedMarkdown.support).every(
          (value) => value.linkSuffix === ""
        ) ? null : (
          <div key="support">
            <p className="mt-4 whitespace-pre-line">### Support Me</p>
            <p>{`<ul style="list-style-type: none; margin: 0;">`}</p>
            {Object.entries(renderedMarkdown.support).map(([key, value]) =>
              !value.linkSuffix ? null : (
                <p key={key}>
                  {`<li style="display: inline-block; margin-right: 0.25rem;"><a href="${assembleSupportLink(
                    key
                  )}"><img src="${getSupportPreviewIMG(
                    key,
                    value
                  )}" width="150"/></a></li>`}
                </p>
              )
            )}
            {`</ul>`}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <article id="markdown-container" className="relative">
      {!renderedMarkdown ? (
        <div>You have not rendered any code yet</div>
      ) : (
        <>
          {sectionOrder.map((sectionType) =>
            renderMarkdownSection(sectionType)
          )}
        </>
      )}
    </article>
  );
}
