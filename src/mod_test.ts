// This is free and unencumbered software released into the public domain

import { assert, assertAlmostEquals, assertEquals } from "jsr:@std/assert@^1";

import {
  makeCuboid,
  makeCylinderSurface,
  makeLine,
  makeRectangle,
  makeSphereSurface,
} from "./mod.ts";

const constantNoise = () => 1;

function assertAllAlmostEqual(field: unknown, expected: number) {
  if (Array.isArray(field)) {
    for (const value of field) assertAllAlmostEqual(value, expected);
  } else {
    assertAlmostEquals(field as number, expected);
  }
}

Deno.test("makeLine returns a field of the requested length", () => {
  const field = makeLine(5, constantNoise);
  assertEquals(field.length, 5);
});

Deno.test("makeRectangle returns a field of the requested dimensions", () => {
  const field = makeRectangle(4, 3, constantNoise);
  assertEquals(field.length, 4);
  for (const column of field) assertEquals(column.length, 3);
});

Deno.test("makeCuboid returns a field of the requested dimensions", () => {
  const field = makeCuboid(3, 2, 4, constantNoise);
  assertEquals(field.length, 3);
  for (const plane of field) {
    assertEquals(plane.length, 2);
    for (const column of plane) assertEquals(column.length, 4);
  }
});

Deno.test(
  "makeCylinderSurface returns a field of the requested dimensions",
  () => {
    const field = makeCylinderSurface(8, 5, constantNoise);
    assertEquals(field.length, 8);
    for (const column of field) assertEquals(column.length, 5);
  },
);

Deno.test(
  "makeSphereSurface returns a field spanning the circumference",
  () => {
    const field = makeSphereSurface(8, constantNoise);
    assertEquals(field.length, 8);
    for (const column of field) assertEquals(column.length, 4);
  },
);

Deno.test("constant noise normalizes to 1 regardless of octave count", () => {
  for (const octaves of [1, 2, 3, 5]) {
    assertAllAlmostEqual(makeLine(4, constantNoise, { octaves }), 1);
    assertAllAlmostEqual(makeRectangle(3, 3, constantNoise, { octaves }), 1);
    assertAllAlmostEqual(makeCuboid(2, 2, 2, constantNoise, { octaves }), 1);
    assertAllAlmostEqual(
      makeCylinderSurface(4, 3, constantNoise, { octaves }),
      1,
    );
    assertAllAlmostEqual(makeSphereSurface(4, constantNoise, { octaves }), 1);
  }
});

Deno.test("amplitude scales the output linearly", () => {
  const field = makeLine(3, constantNoise, { amplitude: 2.5 });
  assertAllAlmostEqual(field, 2.5);
});

Deno.test(
  "frequency scales the coordinates passed to the noise function",
  () => {
    const field = makeLine(3, (x) => x, { frequency: 2 });
    assertEquals(field, [0, 2, 4]);
  },
);

Deno.test("each octave samples at a doubled frequency", () => {
  const sampled: number[] = [];
  makeLine(
    1,
    (x) => {
      sampled.push(x);
      return 0;
    },
    { frequency: 1, octaves: 4 },
  );
  assertEquals(sampled, [0, 0, 0, 0]);

  const sampledAtX1: number[] = [];
  makeLine(
    2,
    (x) => {
      if (x !== 0) sampledAtX1.push(x);
      return 0;
    },
    { frequency: 1, octaves: 4 },
  );
  assertEquals(sampledAtX1, [1, 2, 4, 8]);
});

Deno.test("scale is applied to each generated value", () => {
  const field = makeLine(3, constantNoise, { scale: (x) => x + 5 });
  assertAllAlmostEqual(field, 6);
});
