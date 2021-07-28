import { LayoutObject, LayoutObjectProperties } from "../layout/layout.ts";
import { AggregateCommandArgumentsInput } from "./embedded/aggregate/AggregateCommandArgumentsInput.ts";
import { HelpCommandOptionsInput } from "./embedded/help/HelpCommandOptionsInput.ts";
import { NullCommandArgumentsInput } from "./embedded/null/NullCommandArgumentsInput.ts";

type test001 = LayoutObject<NullCommandArgumentsInput> extends
  LayoutObject<unknown> ? true : false;
type test002 = LayoutObject<NullCommandArgumentsInput> extends LayoutObject<{}>
  ? true
  : false;
type test003 = NullCommandArgumentsInput extends unknown ? true : false;
type test004 = LayoutObject<HelpCommandOptionsInput> extends LayoutObject<{}>
  ? true
  : false;
type test005 = LayoutObject<HelpCommandOptionsInput> extends
  LayoutObject<unknown> ? true : false;
type test006 = LayoutObject<AggregateCommandArgumentsInput> extends
  LayoutObject<unknown> ? true : false;
type test007 = LayoutObject<unknown>;
type test008 = LayoutObjectProperties<unknown>;
interface Point {
  x: number;
  y: number;
}
type test009 = LayoutObjectProperties<Point>;
type test010 = { x: number } extends Record<string, unknown> ? true : false;
type test011 = { [K in keyof { x: 1 }]: string };
