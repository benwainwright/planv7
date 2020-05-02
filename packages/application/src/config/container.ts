import getDecorators from "inversify-inject-decorators";
import { Container } from "inversify";

export const container = new Container();
export const { lazyInject } = getDecorators(container);
