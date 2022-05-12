import { assertEquals } from "../../../deps.ts";
import { LResolver } from "../LResolver.ts";

const resolver = new LResolver();

Deno.test("LResolver:null:null", () => {
  const result = resolver.validate({
    data: null,
    layout: {
      type: "null",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LResolver:undefined:null", () => {
  const result = resolver.validate({
    data: undefined,
    layout: {
      type: "null",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LResolver:null:0", () => {
  const result = resolver.validate({
    data: 0,
    layout: {
      type: "null",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LResolver:null:empty", () => {
  const result = resolver.validate({
    data: "",
    layout: {
      type: "null",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LResolver:null:nan", () => {
  const result = resolver.validate({
    data: NaN,
    layout: {
      type: "null",
    },
  });
  assertEquals(result.valid, false);
});
