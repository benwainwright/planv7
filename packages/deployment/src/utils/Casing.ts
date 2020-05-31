export default class Casing {
  public static snakeCase = (name: string): string =>
    name
      .split(/(?=[A-Z])/u)
      .join("-")
      .toLowerCase();
}
