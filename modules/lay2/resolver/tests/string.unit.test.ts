import { assertEquals } from "../../../deps.ts";
import { LResolver } from "../LResolver.ts";

const resolver = new LResolver();

Deno.test("LResolver:string:example", () => {
  const result = resolver.validate({
    data: "example",
    layout: {
      type: "string",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LResolver:string:example:nullable1", () => {
  const result = resolver.validate({
    data: "example",
    layout: {
      nullable: true,
      type: "string",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LResolver:string:null", () => {
  const result = resolver.validate({
    data: null,
    layout: {
      type: "string",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LResolver:string:null:nullable1", () => {
  const result = resolver.validate({
    data: null,
    layout: {
      nullable: true,
      type: "string",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LResolver:string:empty", () => {
  const result = resolver.validate({
    data: "",
    layout: {
      type: "string",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LResolver:string:number", () => {
  const result = resolver.validate({
    data: 123,
    layout: {
      type: "string",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LResolver:string:123", () => {
  const result = resolver.validate({
    data: "123",
    layout: {
      type: "string",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LResolver:string:object", () => {
  const result = resolver.validate({
    data: {},
    layout: {
      type: "string",
    },
  });
  assertEquals(result.valid, false);
});
