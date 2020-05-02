import { Command } from "../ports/command";

/**
 * Create a new plan
 */
export class AddPlanCommand extends Command {
  private readonly title: string;
  private readonly description: string;
  private readonly hoursPerWeek: number;

  public constructor();
  public constructor(title: string, description: string, hoursPerWeek: number);
  public constructor(
    title?: string,
    description?: string,
    hoursPerWeek?: number
  ) {
    super();
    this.title = title || "";
    this.description = description || "";
    this.hoursPerWeek = hoursPerWeek || 0;
  }

  public identifier(): string {
    return "AddPlanCommand";
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
}
