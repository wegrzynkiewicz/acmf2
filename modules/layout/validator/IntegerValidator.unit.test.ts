import { assertEquals } from "../../deps.ts";
import { LayoutValidator } from "./LayoutValidator.ts";

const layoutValidator = new LayoutValidator();

Deno.test("LayoutValidator validate positive integer with integer layout", () => {
  const result = layoutValidator.validate({
    data: 24,
    layout: {
      type: "integer",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutValidator validate positive integer with nullable integer layout", () => {
  const result = layoutValidator.validate({
    data: 25,
    layout: {
      nullable: true,
      type: "integer",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutValidator validate negative integer with integer layout", () => {
  const result = layoutValidator.validate({
    data: -35,
    layout: {
      type: "integer",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutValidator validate negative integer with nullable integer layout", () => {
  const result = layoutValidator.validate({
    data: -36,
    layout: {
      nullable: true,
      type: "integer",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutValidator validate null with nullable integer layout", () => {
  const result = layoutValidator.validate({
    data: null,
    layout: {
      nullable: true,
      type: "integer",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutValidator validate null with integer layout", () => {
  const result = layoutValidator.validate({
    data: null,
    layout: {
      type: "integer",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutValidator validate float with integer layout", () => {
  const result = layoutValidator.validate({
    data: 12.6,
    layout: {
      type: "integer",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutValidator validate negative float with integer layout", () => {
  const result = layoutValidator.validate({
    data: -0.00004,
    layout: {
      type: "integer",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutValidator validate NaN with integer layout", () => {
  const result = layoutValidator.validate({
    data: NaN,
    layout: {
      type: "integer",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutValidator validate Infinity with integer layout", () => {
  const result = layoutValidator.validate({
    data: Infinity,
    layout: {
      type: "integer",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutValidator validate negative Infinity with integer layout", () => {
  const result = layoutValidator.validate({
    data: -Infinity,
    layout: {
      type: "integer",
    },
  });
  assertEquals(result.valid, false);
});
