import { assertEquals } from "../../../deps.ts";
import { LayoutResolver } from "../LayoutResolver.ts";

const layoutResolver = new LayoutResolver();

Deno.test("LayoutResolver validate string with string layout", () => {
  const result = layoutResolver.validate({
    data: "example",
    layout: {
      type: "string",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutResolver validate string with nullable string layout", () => {
  const result = layoutResolver.validate({
    data: "example",
    layout: {
      type: "string",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutResolver validate null with string layout", () => {
  const result = layoutResolver.validate({
    data: null,
    layout: {
      type: "string",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutResolver validate null with nullable string layout", () => {
  const result = layoutResolver.validate({
    data: null,
    layout: {
      nullable: true,
      type: "string",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutResolver validate empty with string layout", () => {
  const result = layoutResolver.validate({
    data: "",
    layout: {
      type: "string",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutResolver validate number with string layout", () => {
  const result = layoutResolver.validate({
    data: 123,
    layout: {
      type: "string",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutResolver validate number as string with string layout", () => {
  const result = layoutResolver.validate({
    data: "123",
    layout: {
      type: "string",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutResolver validate object with string layout", () => {
  const result = layoutResolver.validate({
    data: {},
    layout: {
      type: "string",
    },
  });
  assertEquals(result.valid, false);
});
