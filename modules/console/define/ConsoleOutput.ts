export interface ConsoleOutput {
  error: (error: Error) => void;
  write: (line: string) => void;
  writeLine: (line: string) => void;
}
