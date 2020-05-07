export default interface Repository<T> {
  saveNew: (entity: T) => Promise<void>;
  updateExisting: (entity: T) => Promise<void>;
  deleteExisting: (entity: T) => Promise<void>;
  getByField: <V>(name: string, value: V) => Promise<T | null>;
  getAll: () => Promise<T[]>;
}
