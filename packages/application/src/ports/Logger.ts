export default interface Logger {
  log: (level: string, message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
  debug: (message: string) => void;
  verbose: (message: string) => void;
}
