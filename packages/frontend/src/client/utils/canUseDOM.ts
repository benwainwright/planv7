/**
 * Credit to https://stackoverflow.com/questions/32216383/in-react-how-do-i-detect-if-my-component-is-rendering-from-the-client-or-the-se
 */

export const canUseDom = Boolean(
  typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
);
