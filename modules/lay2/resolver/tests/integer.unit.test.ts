import { assertEquals } from "../../../deps.ts";
import { LResolver } from "../LResolver.ts";

const resolver = new LResolver();

Deno.test("LResolver:integer:24", () => {
  const result = resolver.validate({
    data: 24,
    layout: {
      type: "integer",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LResolver:integer:25:nullable1", () => {
  const result = resolver.validate({
    data: 25,
    layout: {
      nullable: true,
      type: "integer",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LResolver:integer:-35", () => {
  const result = resolver.validate({
    data: -35,
    layout: {
      type: "integer",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LResolver:integer:-36:nullable1", () => {
  const result = resolver.validate({
    data: -36,
    layout: {
      nullable: true,
      type: "integer",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LResolver:integer:null:nullable1", () => {
  const result = resolver.validate({
    data: null,
    layout: {
      nullable: true,
      type: "integer",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LResolver:integer:null", () => {
  const result = resolver.validate({
    data: null,
    layout: {
      type: "integer",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LResolver:integer:12.6", () => {
  const result = resolver.validate({
    data: 12.6,
    layout: {
      type: "integer",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LResolver:integer:-0.00004", () => {
  const result = resolver.validate({
    data: -0.00004,
    layout: {
      type: "integer",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LResolver:integer:nan", () => {
  const result = resolver.validate({
    data: NaN,
    layout: {
      type: "integer",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LResolver:integer:infinity", () => {
  const result = resolver.validate({
    data: Infinity,
    layout: {
      type: "integer",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LResolver:integer:-infinity", () => {
  const result = resolver.validate({
    data: -Infinity,
    layout: {
      type: "integer",
    },
  });
  assertEquals(result.valid, false);
});
