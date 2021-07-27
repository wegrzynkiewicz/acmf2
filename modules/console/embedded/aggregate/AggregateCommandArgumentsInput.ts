import { LayoutObject } from "../../../layout/layout.ts";

export interface AggregateCommandArgumentsInput {
  arguments?: string[];
  command?: string;
}

export const aggregateCommandArgumentsInputLayout: LayoutObject<
  AggregateCommandArgumentsInput
> = {
  metadata: {
    order: ["command", "arguments"],
  },
  properties: {
    command: {
      defaults: "",
      description: "The command to execute.",
      type: "string",
    },
    arguments: {
      description: "The arguments to pass to command.",
      items: {
        type: "string",
      },
      type: "array",
    },
  },
  type: "object",
};
