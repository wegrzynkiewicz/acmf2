import { assertEquals } from "../../deps.ts";
import { LayoutValidator } from "./LayoutValidator.ts";

const layoutValidator = new LayoutValidator();

Deno.test("LayoutValidator validate positive float with float layout", () => {
  const result = layoutValidator.validate({
    data: 24,
    layout: {
      type: "float",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutValidator validate positive float with nullable float layout", () => {
  const result = layoutValidator.validate({
    data: 25,
    layout: {
      nullable: true,
      type: "float",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutValidator validate negative float with float layout", () => {
  const result = layoutValidator.validate({
    data: -35,
    layout: {
      type: "float",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutValidator validate negative float with nullable float layout", () => {
  const result = layoutValidator.validate({
    data: -36,
    layout: {
      nullable: true,
      type: "float",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutValidator validate null with nullable float layout", () => {
  const result = layoutValidator.validate({
    data: null,
    layout: {
      nullable: true,
      type: "float",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutValidator validate null with float layout", () => {
  const result = layoutValidator.validate({
    data: null,
    layout: {
      type: "float",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutValidator validate NaN with float layout", () => {
  const result = layoutValidator.validate({
    data: NaN,
    layout: {
      type: "float",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutValidator validate Infinity with float layout", () => {
  const result = layoutValidator.validate({
    data: Infinity,
    layout: {
      type: "float",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutValidator validate negative Infinity with float layout", () => {
  const result = layoutValidator.validate({
    data: -Infinity,
    layout: {
      type: "float",
    },
  });
  assertEquals(result.valid, false);
});
