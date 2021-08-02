import { assertEquals } from "../../../deps.ts";
import { LayoutResolver } from "../LayoutResolver.ts";

const layoutResolver = new LayoutResolver();

Deno.test("LayoutResolver validate positive integer with integer layout", () => {
  const result = layoutResolver.validate({
    data: 24,
    layout: {
      type: "integer",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutResolver validate positive integer with nullable integer layout", () => {
  const result = layoutResolver.validate({
    data: 25,
    layout: {
      nullable: true,
      type: "integer",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutResolver validate negative integer with integer layout", () => {
  const result = layoutResolver.validate({
    data: -35,
    layout: {
      type: "integer",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutResolver validate negative integer with nullable integer layout", () => {
  const result = layoutResolver.validate({
    data: -36,
    layout: {
      nullable: true,
      type: "integer",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutResolver validate null with nullable integer layout", () => {
  const result = layoutResolver.validate({
    data: null,
    layout: {
      nullable: true,
      type: "integer",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutResolver validate null with integer layout", () => {
  const result = layoutResolver.validate({
    data: null,
    layout: {
      type: "integer",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutResolver validate float with integer layout", () => {
  const result = layoutResolver.validate({
    data: 12.6,
    layout: {
      type: "integer",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutResolver validate negative float with integer layout", () => {
  const result = layoutResolver.validate({
    data: -0.00004,
    layout: {
      type: "integer",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutResolver validate NaN with integer layout", () => {
  const result = layoutResolver.validate({
    data: NaN,
    layout: {
      type: "integer",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutResolver validate Infinity with integer layout", () => {
  const result = layoutResolver.validate({
    data: Infinity,
    layout: {
      type: "integer",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutResolver validate negative Infinity with integer layout", () => {
  const result = layoutResolver.validate({
    data: -Infinity,
    layout: {
      type: "integer",
    },
  });
  assertEquals(result.valid, false);
});
