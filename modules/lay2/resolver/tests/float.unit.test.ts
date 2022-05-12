import { assertEquals } from "../../../deps.ts";
import { LResolver } from "../LResolver.ts";

const resolver = new LResolver();

Deno.test("LResolver:float:24", () => {
  const result = resolver.validate({
    data: 24,
    layout: {
      type: "float",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LResolver:float:25:nullable1", () => {
  const result = resolver.validate({
    data: 25,
    layout: {
      nullable: true,
      type: "float",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LResolver:float:-35", () => {
  const result = resolver.validate({
    data: -35,
    layout: {
      type: "float",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LResolver:float:-36:nullable1", () => {
  const result = resolver.validate({
    data: -36,
    layout: {
      nullable: true,
      type: "float",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LResolver:float:null:nullable1", () => {
  const result = resolver.validate({
    data: null,
    layout: {
      nullable: true,
      type: "float",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LResolver:float:null", () => {
  const result = resolver.validate({
    data: null,
    layout: {
      type: "float",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LResolver:float:nan", () => {
  const result = resolver.validate({
    data: NaN,
    layout: {
      type: "float",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LResolver:float:infinity", () => {
  const result = resolver.validate({
    data: Infinity,
    layout: {
      type: "float",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LResolver:float:-infinity", () => {
  const result = resolver.validate({
    data: -Infinity,
    layout: {
      type: "float",
    },
  });
  assertEquals(result.valid, false);
});
