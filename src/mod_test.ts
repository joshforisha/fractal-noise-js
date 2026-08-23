// This is free and unencumbered software released into the public domain

import assert from "node:assert/strict";
import { test } from "node:test";

import {
  makeCuboid,
  makeCylinderSurface,
  makeLine,
  makeRectangle,
  makeSphereSurface,
} from "./mod.ts";

const constantNoise = () => 1;

function assertAllAlmostEqual(
  field: unknown,
  expected: number,
  epsilon = 1e-9,
) {
  if (Array.isArray(field)) {
    for (const value of field) assertAllAlmostEqual(value, expected, epsilon);
  } else {
    assert(
      Math.abs((field as number) - expected) <= epsilon,
      `expected ${field} to be within ${epsilon} of ${expected}`,
    );
  }
}

test("makeLine returns a field of the requested length", () => {
  const field = makeLine(5, constantNoise);
  assert.strictEqual(field.length, 5);
});

test("makeRectangle returns a field of the requested dimensions", () => {
  const field = makeRectangle(4, 3, constantNoise);
  assert.strictEqual(field.length, 4);
  for (const column of field) assert.strictEqual(column.length, 3);
});

test("makeCuboid returns a field of the requested dimensions", () => {
  const field = makeCuboid(3, 2, 4, constantNoise);
  assert.strictEqual(field.length, 3);
  for (const plane of field) {
    assert.strictEqual(plane.length, 2);
    for (const column of plane) assert.strictEqual(column.length, 4);
  }
});

test("makeCylinderSurface returns a field of the requested dimensions", () => {
  const field = makeCylinderSurface(8, 5, constantNoise);
  assert.strictEqual(field.length, 8);
  for (const column of field) assert.strictEqual(column.length, 5);
});

test("makeSphereSurface returns a field spanning the circumference", () => {
  const field = makeSphereSurface(8, constantNoise);
  assert.strictEqual(field.length, 8);
  for (const column of field) assert.strictEqual(column.length, 4);
});

test("constant noise normalizes to 1 regardless of octave count", () => {
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

test("amplitude scales the output linearly", () => {
  const field = makeLine(3, constantNoise, { amplitude: 2.5 });
  assertAllAlmostEqual(field, 2.5);
});

test("frequency scales the coordinates passed to the noise function", () => {
  const field = makeLine(3, (x) => x, { frequency: 2 });
  assert.deepStrictEqual(field, [0, 2, 4]);
});

test("each octave samples at a doubled frequency", () => {
  const sampled: number[] = [];
  makeLine(
    1,
    (x) => {
      sampled.push(x);
      return 0;
    },
    { frequency: 1, octaves: 4 },
  );
  assert.deepStrictEqual(sampled, [0, 0, 0, 0]);

  const sampledAtX1: number[] = [];
  makeLine(
    2,
    (x) => {
      if (x !== 0) sampledAtX1.push(x);
      return 0;
    },
    { frequency: 1, octaves: 4 },
  );
  assert.deepStrictEqual(sampledAtX1, [1, 2, 4, 8]);
});

test("scale is applied to each generated value", () => {
  const field = makeLine(3, constantNoise, { scale: (x) => x + 5 });
  assertAllAlmostEqual(field, 6);
});
