import { assertEquals } from "../../../deps.ts";
import { LayoutResolver } from "../LayoutResolver.ts";

const layoutResolver = new LayoutResolver();

Deno.test("LayoutResolver validate null with null layout", () => {
  const result = layoutResolver.validate({
    data: null,
    layout: {
      type: "null",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutResolver validate undefined with null layout", () => {
  const result = layoutResolver.validate({
    data: undefined,
    layout: {
      type: "null",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutResolver validate 0 with null layout", () => {
  const result = layoutResolver.validate({
    data: 0,
    layout: {
      type: "null",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutResolver validate empty string with null layout", () => {
  const result = layoutResolver.validate({
    data: "",
    layout: {
      type: "null",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutResolver validate NaN with null layout", () => {
  const result = layoutResolver.validate({
    data: NaN,
    layout: {
      type: "null",
    },
  });
  assertEquals(result.valid, false);
});
