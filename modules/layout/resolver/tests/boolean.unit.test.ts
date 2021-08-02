import { assertEquals } from "../../../deps.ts";
import { LayoutResolver } from "../LayoutResolver.ts";

const layoutResolver = new LayoutResolver();

Deno.test("LayoutResolver validate true with boolean layout", () => {
  const result = layoutResolver.validate({
    data: true,
    layout: {
      type: "boolean",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutResolver validate true with nullable boolean layout", () => {
  const result = layoutResolver.validate({
    data: null,
    layout: {
      nullable: true,
      type: "boolean",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutResolver validate false with boolean layout", () => {
  const result = layoutResolver.validate({
    data: false,
    layout: {
      type: "boolean",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutResolver validate false with nullable boolean layout", () => {
  const result = layoutResolver.validate({
    data: false,
    layout: {
      type: "boolean",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutResolver validate null with boolean layout", () => {
  const result = layoutResolver.validate({
    data: null,
    layout: {
      nullable: true,
      type: "boolean",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutResolver validate null with negative boolean layout", () => {
  const result = layoutResolver.validate({
    data: null,
    layout: {
      nullable: false,
      type: "boolean",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutResolver validate number with boolean layout", () => {
  const result = layoutResolver.validate({
    data: 2,
    layout: {
      type: "boolean",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutResolver validate string with boolean layout", () => {
  const result = layoutResolver.validate({
    data: "example",
    layout: {
      type: "boolean",
    },
  });
  assertEquals(result.valid, false);
});
