export const TYPES = {
  currentLoginSession: Symbol.for("CurrentLoginSession"),
  eventEmitterWrapper: Symbol.for("EventEmitterWrapper"),
  userRepository: Symbol.for("UserRepository"),
  slugGenerator: Symbol.for("SlugGenerator"),
  planRepository: Symbol.for("PlanRepository"),
  loginProvider: Symbol.for("LoginProvider"),
  logger: Symbol.for("Logger"),
  dispatch: Symbol.for("Dispatch"),
  loginSessionDestroyer: Symbol.for("LoginSessionDestroyer"),
  serialisableConstructors: Symbol.for("SerialisableConstructors"),
};

export default TYPES;
