export default interface LoginSessionDestroyer {
  /**
   * Kill the current login session
   */
  killSession: () => void;
}
