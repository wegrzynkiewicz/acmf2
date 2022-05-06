import { LayoutString } from "../../layout/layout.ts";

export interface EnvironmentVariable {
  key: string | symbol;
  layout: LayoutString;
  variable: string;
}
