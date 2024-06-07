// This is free and unencumbered software released into the public domain

const TWO_PI = 2 * Math.PI;

export type Noise1Fn = (x: number) => number;

export type Noise2Fn = (x: number, y: number) => number;

export type Noise3Fn = (x: number, y: number, z: number) => number;

export type Noise4Fn = (x: number, y: number, z: number, w: number) => number;

export interface Options {
  amplitude: number;
  frequency: number;
  octaves: number;
  persistence: number;
  scale?: (x: number) => number;
}

const defaultAmplitude = 1.0;
const defaultFrequency = 1.0;
const defaultOctaves = 1;
const defaultPersistence = 0.5;

export function makeCuboid(
  width: number,
  height: number,
  depth: number,
  noise3: Noise3Fn,
  {
    amplitude = defaultAmplitude,
    frequency = defaultFrequency,
    octaves = defaultOctaves,
    persistence = defaultPersistence,
    scale,
  }: Partial<Options> = {},
): number[][][] {
  const options: Options = { amplitude, frequency, octaves, persistence, scale };
  const field: number[][][] = new Array(width);
  for (let x = 0; x < width; x++) {
    field[x] = new Array(height);
    for (let y = 0; y < height; y++) {
      field[x][y] = new Array(depth);
      for (let z = 0; z < depth; z++) {
        field[x][y][z] = getCuboidNoiseValue(noise3, options, x, y, z);
      }
    }
  }
  return field;
}

export function makeCylinderSurface(
  circumference: number,
  height: number,
  noise3: Noise3Fn,
  {
    amplitude = defaultAmplitude,
    frequency = defaultFrequency,
    octaves = defaultOctaves,
    persistence = defaultPersistence,
    scale,
  }: Partial<Options> = {},
): number[][] {
  const options: Options = { amplitude, frequency, octaves, persistence, scale };
  const radius = getCircleRadius(circumference);
  const field: number[][] = new Array(circumference);
  for (let x = 0; x < circumference; x++) {
    field[x] = new Array(height);
    for (let y = 0; y < height; y++) {
      field[x][y] = getCylinderSurfaceNoiseValue(noise3, options, circumference, radius, x, y);
    }
  }
  return field;
}

export function makeLine(
  length: number,
  noise1: Noise1Fn,
  {
    amplitude = defaultAmplitude,
    frequency = defaultFrequency,
    octaves = defaultOctaves,
    persistence = defaultPersistence,
    scale,
  }: Partial<Options> = {},
): number[] {
  const options: Options = { amplitude, frequency, octaves, persistence, scale };
  const field: number[] = new Array(length);
  for (let x = 0; x < length; x++) {
    field[x] = getLineNoiseValue(noise1, options, x);
  }
  return field;
}

export function makeRectangle(
  width: number,
  height: number,
  noise2: Noise2Fn,
  {
    amplitude = defaultAmplitude,
    frequency = defaultFrequency,
    octaves = defaultOctaves,
    persistence = defaultPersistence,
    scale,
  }: Partial<Options> = {},
): number[][] {
  const options: Options = { amplitude, frequency, octaves, persistence, scale };
  const field: number[][] = new Array(width);
  for (let x = 0; x < width; x++) {
    field[x] = new Array(height);
    for (let y = 0; y < height; y++) {
      field[x][y] = getRectangleNoiseValue(noise2, options, x, y);
    }
  }
  return field;
}

export function makeSphereSurface(
  circumference: number,
  noise3: Noise3Fn,
  {
    amplitude = defaultAmplitude,
    frequency = defaultFrequency,
    octaves = defaultOctaves,
    persistence = defaultPersistence,
    scale,
  }: Partial<Options> = {},
): number[][] {
  const options: Options = { amplitude, frequency, octaves, persistence, scale };
  const circumferenceSemi = circumference / 2;
  const field: number[][] = new Array(circumference);
  for (let x = 0; x < circumference; x++) {
    field[x] = new Array(circumferenceSemi);
    for (let y = 0; y < circumferenceSemi; y++) {
      field[x][y] = getSphereSurfaceNoiseValue(noise3, options, circumference, circumferenceSemi, x, y);
    }
  }
  return field;
}

export function fractalNoiseOptions({
  amplitude = defaultAmplitude,
  frequency = defaultFrequency,
  octaves = defaultOctaves,
  persistence = defaultPersistence,
  scale,
}: Partial<Options> = {}): Options {
  return { amplitude, frequency, octaves, persistence, scale };
}

export function getCircleRadius(
  circumference: number,
): number {
  return circumference / TWO_PI;
}

export function getCuboidNoiseValue(
  noise3: Noise3Fn,
  options: Options,
  x: number,
  y: number,
  z: number,
): number {
  let value = 0.0;
  for (let octave = 0; octave < options.octaves; octave++) {
    const freq = options.frequency * Math.pow(2, octave);
    value += noise3(x * freq, y * freq, z * freq) *
      (options.amplitude * Math.pow(options.persistence, octave));
  }
  const result = normalizeFractalNoiseValue(options, value);
  if (options.scale) return options.scale(result);
  return result;
}

export function getCylinderSurfaceNoiseValue(
  noise3: Noise3Fn,
  options: Options,
  circumference: number,
  radius: number,
  x: number,
  y: number,
): number {
  let value = 0.0;
  for (let octave = 0; octave < options.octaves; octave++) {
    const freq = options.frequency * Math.pow(2, octave);
    const nx = x / circumference;
    const rdx = nx * TWO_PI;
    const [a, b] = [radius * Math.sin(rdx), radius * Math.cos(rdx)];
    value += noise3(a * freq, b * freq, y * freq) *
      (options.amplitude * Math.pow(options.persistence, octave));
  }
  const result = normalizeFractalNoiseValue(options, value);
  if (options.scale) return options.scale(result);
  return result;
}

export function getLineNoiseValue(
  noise1: Noise1Fn,
  options: Options,
  x: number,
): number {
  let value = 0.0;
  for (let octave = 0; octave < options.octaves; octave++) {
    const freq = options.frequency * Math.pow(2, octave);
    value += noise1(x * freq) * (options.amplitude * Math.pow(options.persistence, octave));
  }
  const result = normalizeFractalNoiseValue(options, value);
  if (options.scale) return options.scale(result);
  return result;
}

export function getRectangleNoiseValue(
  noise2: Noise2Fn,
  options: Options,
  x: number,
  y: number,
): number {
  let value = 0.0;
  for (let octave = 0; octave < options.octaves; octave++) {
    const freq = options.frequency * Math.pow(2, octave);
    value += noise2(x * freq, y * freq) * (options.amplitude * Math.pow(options.persistence, octave));
  }
  const result = normalizeFractalNoiseValue(options, value);
  if (options.scale) return options.scale(result);
  return result;
}

export function getSphereSurfaceNoiseValue(
  noise3: Noise3Fn,
  options: Options,
  circumference: number,
  circumferenceSemi: number,
  x: number,
  y: number,
): number {
  const [nx, ny] = [x / circumference, y / circumferenceSemi];
  const [rdx, rdy] = [nx * TWO_PI, ny * Math.PI];
  const sinY = Math.sin(rdy + Math.PI);
  const a = TWO_PI * Math.sin(rdx) * sinY;
  const b = TWO_PI * Math.cos(rdx) * sinY;
  const d = TWO_PI * Math.cos(rdy);
  let value = 0.0;
  for (let octave = 0; octave < options.octaves; octave++) {
    const freq = options.frequency * Math.pow(2, octave);
    value += noise3(a * freq, b * freq, d * freq) *
      (options.amplitude * Math.pow(options.persistence, octave));
  }
  const result = normalizeFractalNoiseValue(options, value);
  if (options.scale) return options.scale(result);
  return result;
}

/**
 * Normalize the result so that it's within a similar range regardless of the
 * number of octaves.
 */
function normalizeFractalNoiseValue(options: Options, value: number) {
  return value / (2 - 1 / Math.pow(2, options.octaves - 1));
}
