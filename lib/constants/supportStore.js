const PROJECT_URL =
  process.env.NODE_ENV === "production"
    ? "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public"
    : "http://localhost:3000";

/**
 * Temporary store for dynamically creating
 * support anchors for first-time and re-visiting users.
 * */
export const supportStore = {
  buymeacoffee: {
    path: `${PROJECT_URL}/icons/support/buymeacoffee.svg`,
    previewIMG: "https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png",
    linkPrefix: "https://www.buymeacoffee.com/",
    linkSuffix: "",
  },
  kofi: {
    path: `${PROJECT_URL}/icons/support/kofi.svg`,
    previewIMG: "https://storage.ko-fi.com/cdn/kofi2.png?v=3",
    linkPrefix: "https://www.ko-fi.com/",
    linkSuffix: "",
  },
};
