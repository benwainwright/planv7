export default interface Serialisable {
  /**
   * Unique string identifying the type of the object
   * This is a workaround to the fact that Webpack
   * changes class names when uglifying, meaning you
   * can't rely on constructor.name
   */
  identifier: () => string;

  toString: () => string;
}
