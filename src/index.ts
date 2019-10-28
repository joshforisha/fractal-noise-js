const TWO_PI = 2 * Math.PI;

export type Noise1Fn = (x: number) => number;

export type Noise2Fn = (x: number, y: number) => number;

export type Noise3Fn = (x: number, y: number, z: number) => number;

export type Noise4Fn = (x: number, y: number, z: number, w: number) => number;

export interface Options {
  amplitude?: number;
  frequency?: number;
  octaves?: number;
  persistence?: number;
}

function processOptions(options: Options): Options {
  return {
    amplitude: typeof options.amplitude === "number" ? options.amplitude : 1.0,
    frequency: typeof options.frequency === "number" ? options.frequency : 1.0,
    octaves:
      typeof options.octaves === "number" ? Math.floor(options.octaves) : 1,
    persistence:
      typeof options.persistence === "number" ? options.persistence : 0.5
  };
}

export function makeCuboid(
  width: number,
  height: number,
  depth: number,
  noise3: Noise3Fn,
  options: Options = {}
): number[][] {
  const { amplitude, frequency, octaves, persistence } = processOptions(
    options
  );
  const field = new Array(width);
  for (let x = 0; x < width; x++) {
    field[x] = new Array(height);
    for (let y = 0; y < height; y++) {
      field[x][y] = new Array(depth);
      for (let z = 0; z < depth; z++) {
        let value = 0.0;
        for (let octave = 0; octave < octaves; octave++) {
          const freq = frequency * Math.pow(2, octave);
          value +=
            noise3(x * freq, y * freq, z * freq) *
            (amplitude * Math.pow(persistence, octave));
        }
        field[x][y][z] = value / (2 - 1 / Math.pow(2, octaves - 1));
      }
    }
  }
  return field;
}

export function makeCylinderSurface(
  circumference: number,
  height: number,
  noise3: Noise3Fn,
  options: Options = {}
): number[] {
  const { amplitude, frequency, octaves, persistence } = processOptions(
    options
  );
  const radius = circumference / TWO_PI;
  const field = new Array(circumference);
  for (let x = 0; x < circumference; x++) {
    field[x] = new Array(height);
    for (let y = 0; y < height; y++) {
      let value = 0.0;
      for (let octave = 0; octave < octaves; octave++) {
        const freq = frequency * Math.pow(2, octave);
        const nx = x / circumference;
        const rdx = nx * TWO_PI;
        const [a, b] = [radius * Math.sin(rdx), radius * Math.cos(rdx)];
        value +=
          noise3(a * freq, b * freq, y * freq) *
          (amplitude * Math.pow(persistence, octave));
      }
      field[x][y] = value / (2 - 1 / Math.pow(2, octaves - 1));
    }
  }
  return field;
}

export function makeLine(
  length: number,
  noise1: Noise1Fn,
  options: Options = {}
): number[] {
  const { amplitude, frequency, octaves, persistence } = processOptions(
    options
  );
  const field = new Array(length);
  for (let x = 0; x < length; x++) {
    let value = 0.0;
    for (let octave = 0; octave < octaves; octave++) {
      const freq = frequency * Math.pow(2, octaves);
      value += noise1(x * freq) * (amplitude * Math.pow(persistence, octave));
    }
    field[x] = value / (2 - 1 / Math.pow(2, octaves - 1));
  }
  return field;
}

export function makeRectangle(
  width: number,
  height: number,
  noise2: Noise2Fn,
  options: Options = {}
): number[] {
  const { amplitude, frequency, octaves, persistence } = processOptions(
    options
  );
  const field = new Array(width);
  for (let x = 0; x < width; x++) {
    field[x] = new Array(height);
    for (let y = 0; y < height; y++) {
      let value = 0.0;
      for (let octave = 0; octave < octaves; octave++) {
        const freq = frequency * Math.pow(2, octave);
        value +=
          noise2(x * freq, y * freq) *
          (amplitude * Math.pow(persistence, octave));
      }
      field[x][y] = value / (2 - 1 / Math.pow(2, octaves - 1));
    }
  }
  return field;
}

export function makeSphereSurface(
  circumference: number,
  noise3: Noise3Fn,
  options: Options = {}
): number[] {
  const { amplitude, frequency, octaves, persistence } = processOptions(
    options
  );
  const field = new Array(circumference);
  for (let x = 0; x < circumference; x++) {
    field[x] = new Array(circumference);
    for (let y = 0; y < circumference; y++) {
      let value = 0.0;
      for (let octave = 0; octave < octaves; octave++) {
        const freq = frequency * Math.pow(2, octave);
        const [nx, ny] = [x / circumference, y / circumference];
        const [rdx, rdy] = [nx * TWO_PI, ny * Math.PI];
        const sinY = Math.sin(rdy + Math.PI);
        const a = TWO_PI * Math.sin(rdx) * sinY;
        const b = TWO_PI * Math.cos(rdx) * sinY;
        const d = TWO_PI * Math.cos(rdy);
        value +=
          noise3(a * freq, b * freq, d * freq) *
          (amplitude * Math.pow(persistence, octave));
      }
      field[x][y] = value / (2 - 1 / Math.pow(2, octaves - 1));
    }
  }
  return field;
}
