import { Command } from "../ports/command";

/**
 * Delete an existing plan
 */
export class DeletePlanCommand extends Command {
  public identifier(): string {
    return "DeletePlanCommand";
  }

  private readonly slug: string;

  public constructor();

  public constructor(slug: string);
  public constructor(slug?: string) {
    super();
    this.slug = slug || "";
  }

  public getSlug(): string {
    return this.slug;
  }
}
