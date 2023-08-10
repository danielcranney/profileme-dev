// Hero Section
export const outerContainer = {
  visible: {
    opacity: 1,
    transition: {
      duration: 0.9,
    },
  },
  hidden: {
    opacity: 0,
  },
};

export const heroItem = {
  visible: { y: "0px", opacity: 100 },
  hidden: { y: "100px", opacity: 0 },
};

// Logo Section
export const topBarContainer = {
  visible: {
    opacity: 1,
    y: "0px",
    transition: {
      type: "spring",
      duration: 0.5,
      bounce: 0.3,
    },
  },
  hidden: {
    y: "-100px",
    opacity: 0,
  },
};

// Skills Section
export const slideUpContainer = {
  visible: {
    y: "0px",
    opacity: 1,
  },
  hidden: {
    y: "200px",
    opacity: 0,
  },
};

export const slideFromLeft = {
  visible: { x: "0px", opacity: 100 },
  hidden: { x: "-100px", opacity: 0 },
};

export const slideFromRight = {
  visible: { x: "0px", opacity: 100 },
  hidden: { x: "100px", opacity: 0 },
};

export const slideFromBottom = {
  visible: { y: "0px", opacity: 100 },
  hidden: { y: "100px", opacity: 0 },
};
