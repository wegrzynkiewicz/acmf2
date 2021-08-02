import { assertEquals } from "../../../deps.ts";
import { LayoutResolver } from "../LayoutResolver.ts";

const layoutResolver = new LayoutResolver();

Deno.test("LayoutResolver validate positive float with float layout", () => {
  const result = layoutResolver.validate({
    data: 24,
    layout: {
      type: "float",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutResolver validate positive float with nullable float layout", () => {
  const result = layoutResolver.validate({
    data: 25,
    layout: {
      nullable: true,
      type: "float",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutResolver validate negative float with float layout", () => {
  const result = layoutResolver.validate({
    data: -35,
    layout: {
      type: "float",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutResolver validate negative float with nullable float layout", () => {
  const result = layoutResolver.validate({
    data: -36,
    layout: {
      nullable: true,
      type: "float",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutResolver validate null with nullable float layout", () => {
  const result = layoutResolver.validate({
    data: null,
    layout: {
      nullable: true,
      type: "float",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LayoutResolver validate null with float layout", () => {
  const result = layoutResolver.validate({
    data: null,
    layout: {
      type: "float",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutResolver validate NaN with float layout", () => {
  const result = layoutResolver.validate({
    data: NaN,
    layout: {
      type: "float",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutResolver validate Infinity with float layout", () => {
  const result = layoutResolver.validate({
    data: Infinity,
    layout: {
      type: "float",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LayoutResolver validate negative Infinity with float layout", () => {
  const result = layoutResolver.validate({
    data: -Infinity,
    layout: {
      type: "float",
    },
  });
  assertEquals(result.valid, false);
});
