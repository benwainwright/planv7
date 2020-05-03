export interface ClientStorage<T> {
  set: (data: T) => void;

  get: () => T;
}
