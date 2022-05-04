import { assertEquals, assertThrows } from "../../../deps.ts";
import { LayoutObject } from "../../layout.ts";
import { LayoutError, LayoutResolver } from "../LayoutResolver.ts";

const layoutResolver = new LayoutResolver();

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

Deno.test("LayoutResolver:point:validate", async () => {
  const data = {
    x: 1,
    y: 2,
  };
  const result = layoutResolver.resolve({
    data,
    layout: examplePointLayout,
  });
  assertEquals(result, { x: 1, y: 2 });
});

Deno.test("LayoutResolver:point:exception ", async () => {
  const data = {
    x: 1,
    y: "2",
  };
  const result = layoutResolver.validate({
    data,
    layout: examplePointLayout,
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutResolver:point:missing ", () => {
  const data = {
    x: 1,
  };
  const result = layoutResolver.validate({
    data,
    layout: examplePointLayout,
  });
  assertEquals(result.errors[0].kind, 'missing-property');
});

Deno.test("LayoutResolver:point:undefined ", () => {
  const data = {
    x: 1,
    y: undefined,
  };
  const result = layoutResolver.validate({
    data,
    layout: examplePointLayout,
  });
  assertEquals(result.errors[0].kind, 'missing-property');
});
