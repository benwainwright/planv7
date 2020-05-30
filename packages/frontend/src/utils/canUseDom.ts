/**
 * Credit to https://stackoverflow.com/questions/32216383/in-react-how-do-i-detect-if-my-component-is-rendering-from-the-client-or-the-se
 */

const canUseDom = Boolean(
  typeof window !== "undefined" &&
    /* eslint-disable @typescript-eslint/no-unnecessary-condition */
    window.document &&
    window.document.createElement
    /* eslint-enable @typescript-eslint/no-unnecessary-condition */
);

export default canUseDom;
