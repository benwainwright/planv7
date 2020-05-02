import Command from "../ports/Command";
import Deadline from "../entities/Deadline";

/**
 * Update the details of an existing plan
 */
export default class UpdatePlanCommand extends Command {
  private readonly slug: string;
  private readonly title: string;
  private readonly description: string;
  private readonly hoursPerWeek: number;
  private readonly deadlines: Deadline[];

  public constructor();
  public constructor(
    slug: string,
    title: string,
    description: string,
    hoursPerWeek: number,
    deadlines: Deadline[]
  );
  public constructor(
    slug?: string,
    title?: string,
    description?: string,
    hoursPerWeek?: number,
    deadlines?: Deadline[]
  ) {
    super();
    this.slug = slug || "";
    this.title = title || "";
    this.description = description || "";
    this.hoursPerWeek = hoursPerWeek || 0;
    this.deadlines = deadlines || [];
  }

  public identifier(): string {
    return "UpdatePlanCommand";
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
}
