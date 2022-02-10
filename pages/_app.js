import React, { useReducer, createContext } from "react";
import "../styles/globals.css";

export const StateContext = createContext(null);

export const ACTIONS = {
  // Introduction actions
  ADD_INTRODUCTION: "add-introduction",
  // Select render
  SELECT_RENDER_MODE: "select-render-mode",
  // Skills actions
  ADD_SKILL: "add-skill",
  REMOVE_SKILL: "remove-skill",
  // Profile actions
  ADD_PROFILE: "add-profile",
  // UPDATE MARKDOWN
  UPDATE_MARKDOWN_CODE: "update-markdown-code",
};

export const frontendIcons = [
  {
    name: "HTML5",
    type: "html5-plain",
  },
  {
    name: "Javascript",
    type: "javascript-plain",
  },
  {
    name: "Typescript",
    type: "typescript-plain",
  },
  {
    name: "React",
    type: "react-plain",
  },
  {
    name: "NextJs",
    type: "nextjs-plain",
  },
  {
    name: "Vue",
    type: "vuejs-plain",
  },
  {
    name: "Angular",
    type: "angularjs-plain",
  },
  {
    name: "JQuery",
    type: "jquery-plain",
  },
  {
    name: "Swift",
    type: "swift-plain",
  },
  {
    name: "CSS3",
    type: "css3-plain",
  },
  {
    name: "Sass",
    type: "sass-plain",
  },
  {
    name: "TailwindCSS",
    type: "tailwindcss-plain",
  },
  {
    name: "Bootstrap",
    type: "bootstrap-plain",
  },
];

// Color State
const initialState = {
  section: "introduction",
  renderMode: "preview",
  // Introduction State
  introduction: {
    firstName: null,
    surname: null,
    location: null,
    workingOn: null,
    learning: null,
    collaborateOn: null,
    aboutMe: null,
    additionalInfo: null,
  },
  // Profiles State
  profiles: {
    gitHub: null,
    portfolio: null,
    linkedIn: null,
    medium: null,
    hashnode: null,
    twitter: null,
    facebook: null,
    instagram: null,
    tiktok: null,
  },
  // Skills State
  skills: {
    frontend: [],
  },
  rendered: {
    preview: null,
    markdown: null,
  },
};
// Color Reducer
function reducer(state, action) {
  switch (action.type) {
    // Show Sections
    case ACTIONS.SHOW_SECTION:
      return {
        ...state,
        section: action.payload,
      };
    // Select Render Mode
    case ACTIONS.SELECT_RENDER_MODE:
      return {
        ...state,
        renderMode: action.payload,
      };
    // Introduction Actions
    case ACTIONS.ADD_INTRODUCTION:
      return {
        ...state,
        introduction: {
          ...state.introduction,
          [action.payload.title]: action.payload.value,
        },
      };
    // Skills Sections
    case ACTIONS.ADD_SKILL:
      return {
        ...state,
        skills: {
          ...state.skills,
          [action.payload.type]: [
            ...state.skills[action.payload.type],
            action.payload.icon,
          ],
        },
      };
    case ACTIONS.REMOVE_SKILL:
      return {
        ...state,
        skills: {
          [action.payload.type]: state.skills[action.payload.type].filter(
            (item) => item !== action.payload.icon
          ),
        },
      };
    // Profiles
    case ACTIONS.ADD_PROFILE:
      return {
        ...state,
        profiles: {
          ...state.profiles,
          [action.payload.title]: action.payload.value,
        },
      };
    default:
      throw new Error();
  }
}

function MyApp({ Component, pageProps }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={{ state, dispatch }}>
      <Component {...pageProps} />
    </StateContext.Provider>
  );
}

export default MyApp;
