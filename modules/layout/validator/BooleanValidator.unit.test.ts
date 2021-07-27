import { assertEquals } from "../../deps.ts";
import { LayoutValidator } from "./LayoutValidator.ts";

const layoutValidator = new LayoutValidator();

Deno.test("LayoutValidator validate true with boolean layout", () => {
  const result = layoutValidator.validate({
    data: true,
    layout: {
      type: "boolean",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutValidator validate true with nullable boolean layout", () => {
  const result = layoutValidator.validate({
    data: null,
    layout: {
      nullable: true,
      type: "boolean",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutValidator validate false with boolean layout", () => {
  const result = layoutValidator.validate({
    data: false,
    layout: {
      type: "boolean",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutValidator validate false with nullable boolean layout", () => {
  const result = layoutValidator.validate({
    data: false,
    layout: {
      type: "boolean",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutValidator validate null with boolean layout", () => {
  const result = layoutValidator.validate({
    data: null,
    layout: {
      type: "boolean",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutValidator validate null with negative boolean layout", () => {
  const result = layoutValidator.validate({
    data: null,
    layout: {
      type: "boolean",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutValidator validate number with boolean layout", () => {
  const result = layoutValidator.validate({
    data: 2,
    layout: {
      type: "boolean",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutValidator validate string with boolean layout", () => {
  const result = layoutValidator.validate({
    data: "example",
    layout: {
      type: "boolean",
    },
  });
  assertEquals(result.valid, false);
});
