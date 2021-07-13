import { LayoutCommandArguments } from "../../layout/layoutArguments.ts";

export interface AggregateCommandArgumentsInput {
  arguments: string[];
  command: string;
}

export const aggregateCommandArgumentsInputLayout: LayoutCommandArguments<
  AggregateCommandArgumentsInput
> = {
  order: ["command", "arguments"],
  properties: {
    arguments: {
      default: [],
      description: "The arguments to pass to command.",
      items: {
        type: "string",
      },
      type: "array",
    },
    command: {
      default: "",
      description: "The command to execute.",
      type: "string",
    },
  },
  required: [],
  type: "object",
};
