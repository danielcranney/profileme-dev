import React, { useRef } from "react";
import NextSection from "../buttons/NextSection";
import IntroItem from "../IntroItem";
import IntroLinkItem from "../IntroLinkItem";
import IntroTextarea from "../IntroTextarea";
import SectionHeader from "../SectionHeader";

const Introduction = React.forwardRef((props, ref) => {
  // Introduction refs
  const nameRef = useRef();
  const animatedHandRef = useRef();
  const shortDescriptionRef = useRef();
  const longDescriptionRef = useRef();
  const locationRef = useRef();
  const workingOnTitleRef = useRef();
  const workingOnLinkRef = useRef();
  const portfolioTitleRef = useRef();
  const portfolioLinkRef = useRef();
  const emailMeRef = useRef();
  const learningRef = useRef();
  const collaborateOnRef = useRef();
  const additionalInfoRef = useRef();

  return (
    <>
      <section className="section-header-wrapper">
        <SectionHeader
          header={"Introduction"}
          subhead={`Introduce yourself. Tell visitors about you and who you are.`}
        />
        <div className="flex mt-4">
          <NextSection sectionToGoTo={"skills"} />
        </div>
      </section>
      <section className="flex flex-col overflow-y-auto">
        <div ref={ref}></div>
        <section className="flex flex-col p-6 gap-y-5">
          {/* Name */}
          <IntroItem
            ref={nameRef}
            formLabelText={"Hi! My name is:"}
            formLabelIcon={"👋"}
            section={"introduction"}
            type={"name"}
            inputPlaceholder={"Peter Parker"}
          />
           {/* Animated Hand */}
           <IntroItem ref={animatedHandRef}
                      formLabelText={'Waving Hand Animation?'}
                      section={'introduction'}
                      type={'animatedHand'}
                      dropdown={true}
                      inputPlaceholder={'No'}
           />
          {/* Short Description */}
          <IntroItem
            ref={shortDescriptionRef}
            formLabelText={"Subtitle:"}
            formLabelIcon={"💡"}
            section={"introduction"}
            type={"shortDescription"}
            inputPlaceholder={"Web Developer and Designer"}
          />
          {/* Long Description */}
          <IntroTextarea
            ref={longDescriptionRef}
            formLabelText={"Long Description:"}
            formLabelIcon={"✏️"}
            section={"introduction"}
            type={"longDescription"}
            inputPlaceholder={
              "eg: I've been learning to code for 5 years, after switching careers. I started with HTML, but have really found a passion for backend development..."
            }
          />
          {/* Location */}
          <h4 className="mb-0">About me</h4>
          <IntroItem
            ref={locationRef}
            formLabelText={"I'm based in:"}
            formLabelIcon={"🌍"}
            section={"introduction"}
            type={"location"}
            inputPlaceholder={"New York"}
          />
          {/* Portfolio  */}
          <article className="flex flex-col gap-y-2">
            <IntroItem
              ref={portfolioTitleRef}
              formLabelText={"See my portfolio:"}
              formLabelIcon={"🖥️"}
              section={"introduction"}
              type={"portfolioTitle"}
              inputPlaceholder={"MyPortfolio"}
            />
            <IntroLinkItem
              ref={portfolioLinkRef}
              section={"introduction"}
              linkPrefix={"http://"}
              type={"portfolioLink"}
              inputPlaceholder={"myapp.com"}
            />
          </article>
          {/* Email  */}
          <IntroItem
            ref={emailMeRef}
            formLabelText={"Contact me at:"}
            formLabelIcon={"✉️"}
            section={"introduction"}
            type={"emailMe"}
            inputPlaceholder={"myemail@gmail.com"}
          />
          {/* Currently working on */}
          <article className="flex flex-col gap-y-2">
            <IntroItem
              ref={workingOnTitleRef}
              formLabelText={"I'm currently working on:"}
              formLabelIcon={"🚀"}
              section={"introduction"}
              type={"workingOnTitle"}
              inputPlaceholder={"MyApp"}
            />
            <IntroLinkItem
              ref={workingOnLinkRef}
              section={"introduction"}
              type={"workingOnLink"}
              linkPrefix={"http://"}
              inputPlaceholder={"myapp.com"}
            />
          </article>

          {/* Currently learning */}
          <IntroItem
            ref={learningRef}
            formLabelText={"I'm currently learning:"}
            formLabelIcon={"🧠"}
            section={"introduction"}
            type={"learning"}
            inputPlaceholder={"a new framework"}
          />
          {/* Collaborate on */}
          <IntroItem
            ref={collaborateOnRef}
            formLabelText={"I'm open to collaborating on:"}
            formLabelIcon={"🤝"}
            section={"introduction"}
            type={"collaborateOn"}
            inputPlaceholder={"interesting projects"}
          />
          {/* Additional info */}
          <IntroItem
            ref={additionalInfoRef}
            formLabelText={"Anything else:"}
            formLabelIcon={"⚡"}
            section={"introduction"}
            type={"additionalInfo"}
            inputPlaceholder={"I'm secretly Spiderman... but don't tell anyone"}
          />
          <section className="flex mt-4">
            <NextSection sectionToGoTo={"skills"} />
          </section>
        </section>
      </section>
    </>
  );
});

Introduction.displayName = "Introduction";
export default Introduction;
