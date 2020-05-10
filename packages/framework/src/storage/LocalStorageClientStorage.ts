import "reflect-metadata";

import ClientStorage from "./ClientStorage";
import { injectable } from "inversify";

@injectable()
export default class LocalStorageClientStorage<T> implements ClientStorage<T> {
  private readonly name: string;

  public constructor(name: string) {
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
