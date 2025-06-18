# ProfileMe.dev

ProfileMe.dev helps developers create an amazing GitHub profile in minutes.

## Demo

A live version of this project can be found at https://www.profileme.dev.

## Features

Users can easily build and customise their GitHub profile, working with the following:

- Introduction section (to include basic information, links to portfolio and any current projects that are of note.)
- Skills icons (with over 60 technologies and softwares available to choose from)
- Socials links (with 18 social media platforms to choose from)
- Badges and statistics (graphic elements to add to your profile, such as GitHub stats badges, Twitter follower counts and Twitch streaming status)
- Links to support sites (such as BuyMeACoffee).

## Tech Stack

This project was built with:

- NextJS
- TailwindCSS

## Installation

ProfileMe.dev has a very simple, two-step installation process.

**1. Install dependencies**

```bash
npm install
```

**2. Run development server**

```bash
npm run dev
```

## Contributing

Contributions are always welcome! Here's a few tips on how to get started.

- ### Issues

  To get started, please take a look at the ['Issues'](https://github.com/danielcranney/profileme-dev/issues) tab, where you will find open issues that exist within the project. If you see one that interests you, create a branch and submit a PR for review and approval.

- ### How to add an icon

  If you would like to add a new icon to the skills section, please follow the following steps:

  - #### **1. Create SVGs**

    You should first create _three_ variations of the icon you are intending to add.
    All icons should be square (we recommend 128px x 128px).

    - [iconName]-colored.svg: This should be the full-color version of the icon. Please ensure it stays loyal to the brand colors and guidelines set out by the brand itself.
    - [iconName].svg: This icon will be the one that renders in light mode.
    - [iconName]-dark.svg: This icon will be the one that renders in dark mode.

    Please create SVG icon (we recommend using Adobe Illustrator, Figma or another vector-based graphics program)

  - #### **2. Add data to {iconData}**

    In \_app.js, all icon data is stored in an object called iconData.

    Inside of this object, there are four keys, with strings as values:

    ```json
    {
    name: "JavaScript",
    path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/javascript-colored.svg",
    iTag: "javascript",
    link: "https://www.javascript.com/",
    },
    ```

    | Key  | Value                                                                                                                                                                                                                                                   |
    | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | name | eg: "JavaScript". This value will be the one shown to the user via the tooltip.                                                                                                                                                                                                                            |
    | path | The path for where the full-color version will be stored. Once the pull request has been merged, the icons you add will be found at "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/[iconName]-colored.svg". |
    | iTag | The name that will be used for the CSS class, all lower case.                                                                                                                                                                                           |
    | link | The URL for the official website of the language/technology being added.                                                                                                                                                                                |

  - #### **3. Add icons to CSS**

    Adding your new icons to the site CSS is very simple. In styles/global.css, add the following block (replacing 'javascript' with the iTag you added in the last step).

    ```
    .javascript {
    @apply bg-[url('https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/javascript.svg')] dark:bg-[url('https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/javascript-dark.svg')];
    }
    .javascript.colored {
    @apply bg-[url('https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/javascript-colored.svg')];
    }
    ```

## License

ProfileMe is available under the [GNU AGPLv3 license](https://choosealicense.com/licenses/agpl-3.0/). Please read the terms of this license before making modifications to this project.
