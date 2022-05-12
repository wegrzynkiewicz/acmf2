import { assertEquals } from "../../../deps.ts";
import { LResolver } from "../LResolver.ts";

const resolver = new LResolver();

Deno.test("LResolver:boolean:true", () => {
  const result = resolver.validate({
    data: true,
    layout: {
      type: "boolean",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LResolver:boolean:true:nullable1", () => {
  const result = resolver.validate({
    data: null,
    layout: {
      nullable: true,
      type: "boolean",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LResolver:boolean:false", () => {
  const result = resolver.validate({
    data: false,
    layout: {
      type: "boolean",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LResolver:boolean:null:nullable1", () => {
  const result = resolver.validate({
    data: null,
    layout: {
      nullable: true,
      type: "boolean",
    },
  });
  assertEquals(result.valid, true);
});

Deno.test("LResolver:boolean:null:nullable0", () => {
  const result = resolver.validate({
    data: null,
    layout: {
      nullable: false,
      type: "boolean",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LResolver:boolean:number", () => {
  const result = resolver.validate({
    data: 2,
    layout: {
      type: "boolean",
    },
  });
  assertEquals(result.valid, false);
});

Deno.test("LResolver:boolean:string", () => {
  const result = resolver.validate({
    data: "example",
    layout: {
      type: "boolean",
    },
  });
  assertEquals(result.valid, false);
});
