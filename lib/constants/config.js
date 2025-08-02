export const PROJECT_URL =
  process.env.NODE_ENV === "production"
    ? "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public"
    : "http://localhost:3000";
