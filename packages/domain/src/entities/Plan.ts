import Deadline from "./Deadline";
import Serializable from "../ports/Serializable";

export default class Plan implements Serializable {
  private readonly user: string;
  private readonly slug: string;
  private readonly title: string;
  private readonly description: string;
  private readonly hoursPerWeek: number;
  private readonly deadlines: Deadline[];

  public constructor(
    user: string,
    slug: string,
    title: string,
    description: string,
    hoursPerWeek: number,
    deadlines?: Deadline[]
  ) {
    this.user = user;
    this.slug = slug;
    this.title = title;
    this.description = description;
    this.hoursPerWeek = hoursPerWeek;
    this.deadlines = deadlines || [];
  }

  public getUser(): string {
    return this.user;
  }

  public getSlug(): string {
    return this.slug;
  }

  public getTitle(): string {
    return this.title;
  }

  public getDescription(): string {
    return this.description;
  }

  public getHoursPerWeek(): number {
    return this.hoursPerWeek;
  }

  public getDeadlines(): Deadline[] {
    return this.deadlines;
  }

  public identifier(): string {
    return "Plan";
  }
}
