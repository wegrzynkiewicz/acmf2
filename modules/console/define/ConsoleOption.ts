import {
  LayoutBoolean,
  LayoutNumber,
  LayoutString,
} from "../../layout/layout.ts";
import { ConsoleOptionParameter } from "./ConsoleOptionParameter.ts";

export interface ConsoleFlags {
  parameter?: ConsoleOptionParameter;
  longFlags?: string[];
  shortFlags?: string[];
}

export type LayoutBooleanConsoleOption = LayoutBoolean & ConsoleFlags;
export type LayoutStringConsoleOption = LayoutString & ConsoleFlags;
export type LayoutNumberConsoleOption = LayoutNumber & ConsoleFlags;
export type LayoutUnknownConsoleOption =
  | LayoutBooleanConsoleOption
  | LayoutStringConsoleOption
  | LayoutNumberConsoleOption;

type Positive<T> = T extends string ? LayoutStringConsoleOption
  : T extends boolean ? LayoutBooleanConsoleOption
  : T extends number ? LayoutNumberConsoleOption
  : never;

export type LayoutConsoleOption<T> = Positive<Exclude<T, null | undefined>>;

export type LayoutConsoleOptions<T> = {
  properties:
  & {
    +readonly [K in keyof T]-?: LayoutConsoleOption<T[K]>;
  }
  & (unknown extends T ? { [K: string]: LayoutUnknownConsoleOption } : {});
  required?:
  & {
    +readonly [K in keyof T]-?: boolean;
  }
  & (unknown extends T ? { [K: string]: boolean } : {});
  type: "object";
};
