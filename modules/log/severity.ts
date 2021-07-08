export const severityLabels: string[] = [
  "EMERGENCY",
  "ALERT",
  "CRITICAL",
  "ERROR",
  "WARNING",
  "NOTICE",
  "INFO",
  "DEBUG",
  "SILLY",
];

export function convertSeverityCodeToLabel(code: number): string {
  const value = severityLabels[code];
  if (value === undefined) {
    throw new Error(`Unexpected severity log code (${code}).`);
  }
  return value;
}

export function convertSeverityLabelToCode(label: string): number {
  switch (label.toUpperCase()) {
    case "ALERT":
      return 1;
    case "CRITICAL":
      return 2;
    case "DEBUG":
      return 7;
    case "EMERGENCY":
      return 0;
    case "ERROR":
      return 3;
    case "INFO":
      return 6;
    case "NOTICE":
      return 5;
    case "SILLY":
      return 8;
    case "WARNING":
      return 4;
    default:
      throw new Error("Unexpected log label.");
  }
}
