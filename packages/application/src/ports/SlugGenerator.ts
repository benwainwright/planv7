export default interface SlugGenerator<T> {
  getUniqueSlug: (thing: T) => Promise<string>;
}
