import { assertEquals } from "../../deps.ts";
import { LayoutValidator } from "./LayoutValidator.ts";

const layoutValidator = new LayoutValidator();

Deno.test("LayoutValidator validate string with string layout", () => {
  const result = layoutValidator.validate({
    data: "example",
    layout: {
      type: "string",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutValidator validate string with nullable string layout", () => {
  const result = layoutValidator.validate({
    data: "example",
    layout: {
      type: "string",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutValidator validate null with string layout", () => {
  const result = layoutValidator.validate({
    data: null,
    layout: {
      type: "string",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutValidator validate null with nullable string layout", () => {
  const result = layoutValidator.validate({
    data: null,
    layout: {
      nullable: true,
      type: "string",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutValidator validate empty with string layout", () => {
  const result = layoutValidator.validate({
    data: "",
    layout: {
      type: "string",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutValidator validate number with string layout", () => {
  const result = layoutValidator.validate({
    data: 123,
    layout: {
      type: "string",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutValidator validate number as string with string layout", () => {
  const result = layoutValidator.validate({
    data: "123",
    layout: {
      type: "string",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutValidator validate object with string layout", () => {
  const result = layoutValidator.validate({
    data: {},
    layout: {
      type: "string",
    },
  });
  assertEquals(result.valid, false);
});
