import { assertEquals } from "../../../deps.ts";
import { LObject } from "../../layout.ts";
import { LResolver } from "../LResolver.ts";

const resolver = new LResolver();

Deno.test("LResolver: validate empty with object layout", () => {
  const result = resolver.validate({
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

const exampleSingleFieldPointLayout: LObject<ExampleSingleFieldPoint> = {
  nullable: false,
  type: "object",
  properties: {
    x: {
      type: "integer",
    },
  },
};

Deno.test("LResolver: validate object.number", () => {
  const data = {
    x: 1,
  };
  const result = resolver.validate({
    data,
    layout: exampleSingleFieldPointLayout,
  });
  assertEquals(result.valid, true);
});

Deno.test("LResolver: validate object.string", () => {
  const data = {
    x: "1",
  };
  const result = resolver.validate({
    data,
    layout: exampleSingleFieldPointLayout,
  });
  assertEquals(result.valid, false);
});

Deno.test("LResolver: validate object.null with object layout", () => {
  const data = {
    x: null,
  };
  const result = resolver.validate({
    data,
    layout: exampleSingleFieldPointLayout,
  });
  assertEquals(result.valid, false);
});

Deno.test("LResolver: validate object.undefined object layout", () => {
  const data = {
    x: undefined,
  };
  const result = resolver.validate({
    data,
    layout: exampleSingleFieldPointLayout,
  });
  assertEquals(result.valid, false);
});
