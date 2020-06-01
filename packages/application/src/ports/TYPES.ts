export const TYPES = {
  currentLoginSession: Symbol.for("CurrentLoginSession"),
  userRepository: Symbol.for("UserRepository"),
  slugGenerator: Symbol.for("SlugGenerator"),
  planRepository: Symbol.for("PlanRepository"),
  loginProvider: Symbol.for("LoginProvider"),
  logger: Symbol.for("Logger"),
  dispatch: Symbol.for("Dispatch"),
  loginSessionDestroyer: Symbol.for("LoginSessionDestroyer"),
  fileStore: Symbol.for("FileStore"),
};

export default TYPES;
