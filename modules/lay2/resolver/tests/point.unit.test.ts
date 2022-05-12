import { assertEquals } from "../../../deps.ts";
import { LObject } from "../../layout.ts";
import { LResolver } from "../LResolver.ts";

const resolver = new LResolver();

interface ExamplePoint {
  x: number;
  y: number;
}

const examplePointLayout: LObject<ExamplePoint> = {
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

Deno.test("Layout resolver:point:validate", async () => {
  const data = {
    x: 1,
    y: 2,
  };
  const result = resolver.resolve({
    data,
    layout: examplePointLayout,
  });
  assertEquals(result, { x: 1, y: 2 });
});

Deno.test("Layout resolver:point:exception ", async () => {
  const data = {
    x: 1,
    y: "2",
  };
  const result = resolver.validate({
    data,
    layout: examplePointLayout,
  });
  assertEquals(result.valid, false);
});

Deno.test("Layout resolver:point:missing ", () => {
  const data = {
    x: 1,
  };
  const result = resolver.validate({
    data,
    layout: examplePointLayout,
  });
  assertEquals(result.errors[0].kind, 'missing-property');
});

Deno.test("Layout resolver:point:undefined ", () => {
  const data = {
    x: 1,
    y: undefined,
  };
  const result = resolver.validate({
    data,
    layout: examplePointLayout,
  });
  assertEquals(result.errors[0].kind, 'missing-property');
});
