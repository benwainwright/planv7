import "reflect-metadata";

import { ClientStorage } from "./ClientStorage";
import { inject, injectable } from "inversify";

export const LocalStorageKey = Symbol.for("LocalStorageKey");

@injectable()
export class LocalStorageClientStorage<T> implements ClientStorage<T> {
  private readonly name: string;

  public constructor(@inject(LocalStorageKey) name: string) {
    this.name = name;
  }

  public set(data: T): void {
    localStorage.setItem(this.name, JSON.stringify(data));
  }

  public get(): T {
    const data = localStorage.getItem(this.name) || "";
    return JSON.parse(data) as T;
  }
}
