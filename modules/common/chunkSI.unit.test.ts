import { assertEquals } from "../deps.ts";
import { chunkSI } from "./chunkSI.ts";
import { rangeSI } from "./rangeSI.ts";

Deno.test("chunkIterator divide to small lists", async () => {
  const list = [...chunkSI(rangeSI(1, 9), 2)];
  assertEquals(list.length, 5);
  assertEquals(list[0].length, 2);
  assertEquals(list[1].length, 2);
  assertEquals(list[2].length, 2);
  assertEquals(list[3].length, 2);
  assertEquals(list[4].length, 1);
  assertEquals(list[0][0], 1);
  assertEquals(list[0][1], 2);
  assertEquals(list[1][0], 3);
  assertEquals(list[1][1], 4);
  assertEquals(list[2][0], 5);
  assertEquals(list[2][1], 6);
  assertEquals(list[3][0], 7);
  assertEquals(list[3][1], 8);
  assertEquals(list[4][0], 9);
});
