import { Container } from "inversify";

export interface AppSetupProps {
  container: Container;
  isFrontend: boolean;
  path: string;
}
