import "reflect-metadata";
import { injectable } from "inversify";

@injectable()
export default class ResponseAuthHeader {
  private header = "";
  public setHeader(value: string): void {
    this.header = value;
  }
  public getHeader(): string {
    return this.header;
  }
}
