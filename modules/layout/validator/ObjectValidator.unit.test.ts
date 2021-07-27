import { assertEquals } from "../../deps.ts";
import { LayoutObject } from "../layout.ts";
import { LayoutValidator } from "./LayoutValidator.ts";

const layoutValidator = new LayoutValidator();

Deno.test("LayoutValidator validate empty with object layout", () => {
  const result = layoutValidator.validate({
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

Deno.test("LayoutValidator validate object.number", () => {
  const data = {
    x: 1,
  };
  const result = layoutValidator.validate({
    data,
    layout: exampleSingleFieldPointLayout,
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutValidator validate object.string", () => {
  const data = {
    x: "1",
  };
  const result = layoutValidator.validate({
    data,
    layout: exampleSingleFieldPointLayout,
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutValidator validate object.null with object layout", () => {
  const data = {
    x: null,
  };
  const result = layoutValidator.validate({
    data,
    layout: exampleSingleFieldPointLayout,
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutValidator validate object.undefined object layout", () => {
  const data = {
    x: undefined,
  };
  const result = layoutValidator.validate({
    data,
    layout: exampleSingleFieldPointLayout,
  });
  assertEquals(result.valid, false);
});
