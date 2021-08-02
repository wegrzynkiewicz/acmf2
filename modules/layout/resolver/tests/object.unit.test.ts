import { assertEquals } from "../../../deps.ts";
import { LayoutObject } from "../../layout.ts";
import { LayoutResolver } from "../LayoutResolver.ts";

const layoutResolver = new LayoutResolver();

Deno.test("LayoutResolver validate empty with object layout", () => {
  const result = layoutResolver.validate({
    data: {},
    layout: {
      type: "object",
      properties: {},
    },
  });
  assertEquals(result.valid, true);
});

interface ExampleSingleFieldPoint {
  x: number;
}

const exampleSingleFieldPointLayout: LayoutObject<ExampleSingleFieldPoint> = {
  nullable: false,
  type: "object",
  properties: {
    x: {
      type: "integer",
    },
  },
};

Deno.test("LayoutResolver validate object.number", () => {
  const data = {
    x: 1,
  };
  const result = layoutResolver.validate({
    data,
    layout: exampleSingleFieldPointLayout,
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutResolver validate object.string", () => {
  const data = {
    x: "1",
  };
  const result = layoutResolver.validate({
    data,
    layout: exampleSingleFieldPointLayout,
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutResolver validate object.null with object layout", () => {
  const data = {
    x: null,
  };
  const result = layoutResolver.validate({
    data,
    layout: exampleSingleFieldPointLayout,
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutResolver validate object.undefined object layout", () => {
  const data = {
    x: undefined,
  };
  const result = layoutResolver.validate({
    data,
    layout: exampleSingleFieldPointLayout,
  });
  assertEquals(result.valid, false);
});
