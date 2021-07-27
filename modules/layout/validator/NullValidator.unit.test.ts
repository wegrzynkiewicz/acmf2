import { assertEquals } from "../../deps.ts";
import { LayoutValidator } from "./LayoutValidator.ts";

const layoutValidator = new LayoutValidator();

Deno.test("LayoutValidator validate null with null layout", () => {
  const result = layoutValidator.validate({
    data: null,
    layout: {
      type: "null",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutValidator validate undefined with null layout", () => {
  const result = layoutValidator.validate({
    data: undefined,
    layout: {
      type: "null",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutValidator validate 0 with null layout", () => {
  const result = layoutValidator.validate({
    data: 0,
    layout: {
      type: "null",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutValidator validate empty string with null layout", () => {
  const result = layoutValidator.validate({
    data: "",
    layout: {
      type: "null",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutValidator validate NaN with null layout", () => {
  const result = layoutValidator.validate({
    data: NaN,
    layout: {
      type: "null",
    },
  });
  assertEquals(result.valid, false);
});
