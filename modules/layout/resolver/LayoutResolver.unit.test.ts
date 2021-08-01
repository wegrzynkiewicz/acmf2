import { assertEquals } from "../../deps.ts";
import { LayoutObject } from "../layout.ts";
import { LayoutResolver } from "./LayoutResolver.ts";

const layoutResolver = new LayoutResolver();

Deno.test("LayoutResolver validate empty with object layout", async () => {
  const result = await layoutResolver.resolve({
    data: {},
    layout: {
      properties: {},
      type: "object",
    },
  });
  assertEquals(result, {});
});

interface ExamplePoint {
  x: number;
  y: number;
}

const examplePointLayout: LayoutObject<ExamplePoint> = {
  properties: {
    x: {
      type: "integer",
    },
    y: {
      type: "integer",
    },
  },
  type: "object",
};

Deno.test("LayoutResolver validate object.number", async () => {
  const data = {
    x: 1,
    y: 2,
  };
  const result = await layoutResolver.resolve({
    data,
    layout: examplePointLayout,
  });
  assertEquals(result, { x: 1, y: 2 });
});
