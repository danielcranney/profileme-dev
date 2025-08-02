import React, { useContext } from "react";
import { StateContext } from "../../pages/_app";
import { ACTIONS } from "../../lib/constants/actions";
import Image from "next/image";

const CopyModal = () => {
  const { dispatch } = useContext(StateContext);
  return (
    <div className="fixed z-50 flex flex-col flex-grow overflow-hidden transform -translate-x-1/2 -translate-y-1/2 p-6 bg-white border-0 rounded-sm shadow-md w-4/10 dark:bg-dark-800 md:mx-0 md:top-1/2 md:left-1/2 top-1/2 left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-11/12 lg:w-2/3 xl:w-4/5 gap-y-5 border-t-8 border-brand">
      <div className="flex items-center w-full">
        <h1
          className={`mb-0 text-lg sm:text-xl transition-all duration-150 ease-in-out text-dark-900 dark:text-white`}
        >
          ProfileMe
          <span
            className={`transition-all duration-150 ease-in-out text-brand-alt`}
          >
            .dev
          </span>
        </h1>
        <button
          onClick={() => {
            dispatch({
              type: ACTIONS.TOGGLE_COPY_MODAL,
              payload: false,
            });
          }}
          className="btn-sm btn-gray ml-auto"
        >
          Close
        </button>
      </div>
      <div className="w-40 h-0.5 bg-brand"></div>

      <div className="flex gap-x-8 flex-col md:flex-row md:items-start">
        <div className="flex flex-col w-full md:w-1/2">
          <h2 className="mb-4">🎉 Success! Code Copied.</h2>
          <p className="text-base">
            Your code has been generated, and in just a few clicks you&apos;ll
            have a fancy new GitHub profile.
          </p>
          <p className="text-base font-bold">Here&apos;s what to do next:</p>
          <ul className="list-disc list-inside flex flex-col mb-0">
            <li className="dark:text-dark-300 text-dark-600 transition-all duration-150 ease-in-out text-sm">
              Visit your GitHub profile (eg: https://www.github.com/[YourName])
            </li>
            <li className="dark:text-dark-300 text-dark-600 transition-all duration-150 ease-in-out text-sm">
              Click the{" "}
              <svg
                className="w-4 h-4 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                ></path>
              </svg>{" "}
              button on [YourName]/ReadMe.md.
            </li>
            <li className="dark:text-dark-300 text-dark-600 transition-all duration-150 ease-in-out text-sm">
              Paste your code into the &apos;Edit file&apos; text editor.
            </li>
            <li className="dark:text-dark-300 text-dark-600 transition-all duration-150 ease-in-out text-sm">
              Click the &apos;Preview&apos; tab to preview your new profile.
            </li>
            <li className="dark:text-dark-300 text-dark-600 transition-all duration-150 ease-in-out text-sm">
              Click &apos;Commit Changes&apos; to save your new GitHub profile.
            </li>
          </ul>
          <a
            className="transition-all duration-150 ease-in-out btn-gray btn-sm sm:btn-sm tracking-wide self-start mt-4"
            href="https://github.com/sponsors/danielcranney"
            rel="noreferrer"
            target="_blank"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-2 icon icon-tabler icon-tabler-heart"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path>
            </svg>
            Sponsor Project
          </a>
        </div>
        <div className="w-full md:w-1/2 flex-col hidden md:flex">
          <Image
            src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/how-to-use-profile-me.gif"
            layout={"responsive"}
            width={600}
            height={292}
            alt="How to use ProfileMe.dev animation"
          />
          <p className="text-xs mt-2">
            How to use ProfileMe to update your GitHub profile
          </p>
        </div>
      </div>
    </div>
  );
};
export default CopyModal;
