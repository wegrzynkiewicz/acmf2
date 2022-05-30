import { assertEquals } from "../deps.ts";
import { rangeSI } from "./rangeSI.ts";

Deno.test("rangeSI simply numbers", async () => {
    const list = [...rangeSI(1, 5)];
    assertEquals(list.length, 5);
    assertEquals(list[0], 1);
    assertEquals(list[1], 2);
    assertEquals(list[2], 3);
    assertEquals(list[3], 4);
    assertEquals(list[4], 5);
});

Deno.test("rangeSI simply reversed numbers", async () => {
    const list = [...rangeSI(6, 4)];
    assertEquals(list.length, 3);
    assertEquals(list[0], 6);
    assertEquals(list[1], 5);
    assertEquals(list[2], 4);
});

Deno.test("rangeSI single number", async () => {
    const list = [...rangeSI(6, 6)];
    assertEquals(list.length, 1);
    assertEquals(list[0], 6);
});
