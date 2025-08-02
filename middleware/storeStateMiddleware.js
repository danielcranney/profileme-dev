import { STORED_STATE_KEY } from "../pages/_app";

export default (action, state) => {
  localStorage.setItem(STORED_STATE_KEY, JSON.stringify(state));
};
