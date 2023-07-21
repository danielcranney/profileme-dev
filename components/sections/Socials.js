import React, { useRef, useContext } from "react";
import { ACTIONS } from "../../pages/_app";
import { StateContext } from "../../pages/_app";
import NextSection from "../buttons/NextSection";
import PreviousSection from "../buttons/PreviousSection";
import IconSelector from "../IconSelector";
import SectionHeader from "../SectionHeader";
import SocialItem from "../../components/SocialItem";

const Socials = React.forwardRef((props, ref) => {
  const { state, dispatch } = useContext(StateContext);
  // Socials refs
  const behanceRef = useRef();
  const codesandboxRef = useRef();
  const codepenRef = useRef();
  const devdottoRef = useRef();
  const discordRef = useRef();
  const dribbbleRef = useRef();
  const facebookRef = useRef();
  const githubRef = useRef();
  const hashnodeRef = useRef();
  const polyworkRef = useRef();
  const instagramRef = useRef();
  const linkedinRef = useRef();
  const mediumRef = useRef();
  const rssRef = useRef();
  const stackoverflowRef = useRef();
  const twitchRef = useRef();
  const twitterRef = useRef();
  const youtubeRef = useRef();

  return (
    <>
      <section className="section-header-wrapper">
        <SectionHeader
          header={"Socials"}
          subhead={`Connect with your visitors by adding links to your socials.`}
        />
        <div className="flex mt-4">
          <PreviousSection sectionToGoTo={"skills"} />
          <NextSection sectionToGoTo={"badges"} />
        </div>
      </section>
      <section className="flex flex-col overflow-y-auto">
        <div ref={ref}></div>
        <section className="flex flex-col p-6 gap-y-5">
          {/* GitHub Input */}
          <SocialItem
            ref={githubRef}
            section={"socials"}
            account={"github"}
            inputPlaceholder={"yourname"}
            formLabelText={"GitHub profile:"}
            linkPrefix={state.socials.github.linkPrefix}
            action={ACTIONS.ADD_SOCIAL_PROFILE}
          />

          {/* Twitter Input */}
          <SocialItem
            ref={twitterRef}
            section={"socials"}
            account={"twitter"}
            inputPlaceholder={"yourname"}
            formLabelText={"Twitter profile:"}
            linkPrefix={state.socials.twitter.linkPrefix}
            action={ACTIONS.ADD_SOCIAL_PROFILE}
          />

          {/* Hashnode Input */}
          <SocialItem
            ref={hashnodeRef}
            section={"socials"}
            account={"hashnode"}
            inputPlaceholder={"yourname"}
            formLabelText={"Hashnode profile:"}
            linkPrefix={state.socials.hashnode.linkPrefix}
            action={ACTIONS.ADD_SOCIAL_PROFILE}
            linkSuffixTwo={
              <>
                <div className="flex items-center text-sm">
                  <span className="py-2 pr-2 leading-4 select-none">
                    .hashnode.dev
                  </span>
                </div>
              </>
            }
          />

          {/* Medium Input */}
          <SocialItem
            ref={mediumRef}
            section={"socials"}
            account={"medium"}
            inputPlaceholder={"yourname"}
            formLabelText={"Medium profile:"}
            linkPrefix={state.socials.medium.linkPrefix}
            action={ACTIONS.ADD_SOCIAL_PROFILE}
          />

          {/* DevDotTo Input */}
          <SocialItem
            ref={devdottoRef}
            section={"socials"}
            account={"devdotto"}
            inputPlaceholder={"yourname"}
            formLabelText={"Dev.to profile:"}
            linkPrefix={state.socials.devdotto.linkPrefix}
            action={ACTIONS.ADD_SOCIAL_PROFILE}
          />

          {/* LinkedIn Input */}
          <SocialItem
            ref={linkedinRef}
            section={"socials"}
            account={"linkedin"}
            inputPlaceholder={"yourname"}
            formLabelText={"LinkedIn profile:"}
            linkPrefix={state.socials.linkedin.linkPrefix}
            action={ACTIONS.ADD_SOCIAL_PROFILE}
          />

          {/* Polywork Input */}
          <SocialItem
            ref={polyworkRef}
            section={"socials"}
            account={"polywork"}
            inputPlaceholder={"yourname"}
            formLabelText={"Polywork profile:"}
            linkPrefix={state.socials.polywork.linkPrefix}
            action={ACTIONS.ADD_SOCIAL_PROFILE}
          />

          {/* Twitch Input */}
          <SocialItem
            ref={twitchRef}
            section={"socials"}
            account={"twitch"}
            inputPlaceholder={"yourname"}
            formLabelText={"Twitch channel:"}
            linkPrefix={state.socials.twitch.linkPrefix}
            action={ACTIONS.ADD_SOCIAL_PROFILE}
          />

          {/* YouTube Input */}
          <SocialItem
            ref={youtubeRef}
            section={"socials"}
            account={"youtube"}
            inputPlaceholder={"yourname"}
            formLabelText={"YouTube channel:"}
            linkPrefix={state.socials.youtube.linkPrefix}
            action={ACTIONS.ADD_SOCIAL_PROFILE}
          />

          {/* Discord Input */}
          <SocialItem
            ref={discordRef}
            section={"socials"}
            account={"discord"}
            inputPlaceholder={"yourname"}
            formLabelText={"Discord code:"}
            linkPrefix={state.socials.discord.linkPrefix}
            action={ACTIONS.ADD_SOCIAL_PROFILE}
          />

          {/* Instagram Input */}
          <SocialItem
            ref={instagramRef}
            section={"socials"}
            account={"instagram"}
            inputPlaceholder={"yourname"}
            formLabelText={"Instagram profile:"}
            linkPrefix={state.socials.instagram.linkPrefix}
            action={ACTIONS.ADD_SOCIAL_PROFILE}
          />

          {/* Facebook Input */}
          <SocialItem
            ref={facebookRef}
            section={"socials"}
            account={"facebook"}
            inputPlaceholder={"yourname"}
            formLabelText={"Facebook profile:"}
            linkPrefix={state.socials.facebook.linkPrefix}
            action={ACTIONS.ADD_SOCIAL_PROFILE}
          />

          {/* Dribbble Input */}
          <SocialItem
            ref={dribbbleRef}
            section={"socials"}
            account={"dribbble"}
            inputPlaceholder={"yourname"}
            formLabelText={"Dribbble profile:"}
            linkPrefix={state.socials.dribbble.linkPrefix}
            action={ACTIONS.ADD_SOCIAL_PROFILE}
          />

          {/* Behance Input */}
          <SocialItem
            ref={behanceRef}
            section={"socials"}
            account={"behance"}
            inputPlaceholder={"yourname"}
            formLabelText={"Behance profile:"}
            linkPrefix={state.socials.behance.linkPrefix}
            action={ACTIONS.ADD_SOCIAL_PROFILE}
          />

          {/* Code Sandbox Input */}
          <SocialItem
            ref={codesandboxRef}
            section={"socials"}
            account={"codesandbox"}
            inputPlaceholder={"yourname"}
            formLabelText={"CodeSandbox profile:"}
            linkPrefix={state.socials.codesandbox.linkPrefix}
            action={ACTIONS.ADD_SOCIAL_PROFILE}
          />

          {/* Codepen Input */}
          <SocialItem
            ref={codepenRef}
            section={"socials"}
            account={"codepen"}
            inputPlaceholder={"yourname"}
            formLabelText={"Codepen profile:"}
            linkPrefix={state.socials.codepen.linkPrefix}
            action={ACTIONS.ADD_SOCIAL_PROFILE}
          />

          {/* Stack Overflow Input */}
          <SocialItem
            ref={stackoverflowRef}
            section={"socials"}
            account={"stackoverflow"}
            inputPlaceholder={"yourname"}
            formLabelText={"StackOverflow profile:"}
            linkPrefix={state.socials.stackoverflow.linkPrefix}
            action={ACTIONS.ADD_SOCIAL_PROFILE}
          />

          {/* RSS Input */}
          <SocialItem
            ref={rssRef}
            section={"socials"}
            account={"rss"}
            inputPlaceholder={"yourname"}
            formLabelText={"RSS url:"}
            linkPrefix={state.socials.rss.linkPrefix}
            action={ACTIONS.ADD_SOCIAL_PROFILE}
          />
          <section className="flex mt-4">
            <PreviousSection sectionToGoTo={"skills"} />
            <NextSection sectionToGoTo={"badges"} />
          </section>
        </section>
      </section>
    </>
  );
});

Socials.displayName = "Socials";
export default Socials;
