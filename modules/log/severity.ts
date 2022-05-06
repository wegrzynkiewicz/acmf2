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

export const severityMap = Object.fromEntries(severityLabels.map((e, i) => [e, i]));

export function convertSeverityCodeToLabel(code: number): string {
  const value = severityLabels[code];
  if (value === undefined) {
    throw new Error(`Unexpected severity log code (${code}).`);
  }
  return value;
}

export function convertSeverityLabelToCode(label: string): number {
  const code = severityMap[label];
  if (code === undefined) {
    throw new Error("Unexpected log label.");
  }
  return code;
}
