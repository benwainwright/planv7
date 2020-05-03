import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class ResponseAuthHeader {
  private header = "";
  public setHeader(value: string): void {
    this.header = value;
  }
  public getHeader(): string {
    return this.header;
  }
}
