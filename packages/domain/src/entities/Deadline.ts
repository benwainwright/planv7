import Serialisable from "../ports/Serialisable";

export default class Deadline implements Serialisable {
  private readonly name: string;
  private readonly link: URL | undefined;
  private readonly ratio: number;
  private readonly due: Date;

  public constructor(name: string, ratio: number, due: Date, link?: URL) {
    this.name = name;
    this.link = link;
    this.ratio = ratio;
    this.due = due;
  }

  public getName(): string {
    return this.name;
  }

  public getLink(): URL | undefined {
    return this.link;
  }

  public getRatio(): number {
    return this.ratio;
  }

  public getDue(): Date {
    return this.due;
  }

  public identifier(): string {
    return "Deadline";
  }
}
