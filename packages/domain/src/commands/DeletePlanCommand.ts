import Command from "../ports/Command";

/**
 * Delete an existing plan
 */
export default class DeletePlanCommand extends Command {
  public identifier(): string {
    return "DeletePlanCommand";
  }

  private readonly slug: string;

  public constructor();

  public constructor(slug?: string) {
    super();
    this.slug = slug ?? "";
  }

  public getSlug(): string {
    return this.slug;
  }
}
