const TWO_PI = 2 * Math.PI

export interface Options {
  amplitude?: number
  frequency?: number
  octaves?: number
  persistence?: number
}

function cerp (p0: number, p1: number, p2: number, p3: number, x: number): number {
  return (
    (-0.5 * p0 + 1.5 * p1 - 1.5 * p2 + 0.5 * p3) * Math.pow(x, 3) +
    (p0 - 2.5 * p1 + 2 * p2 - 0.5 * p3) * Math.pow(x, 2) +
    (-0.5 * p0 + 0.5 * p2) * x +
    p1
  )
}

function generate1DNoiseFn (source: Uint8Array): (ox: number) => number {
  const sx = source.length
  return ox => {
    const x = ox % sx + sx
    const _x = Math.floor(x)
    const xi = x - _x
    const x0 = ((_x - 1) + sx) % sx
    const x1 = _x % sx
    const x2 = (_x + 1) % sx
    const x3 = (_x + 2) % sx
    return cerp(source[x0], source[x1], source[x2], source[x3], xi)
  }
}

function generate2DNoiseFn (source: Uint8Array[]): (ox: number, oy: number) => number {
  const [sx, sy] = [source.length, source[0].length]
  return (ox, oy) => {
    const [x, y] = [ox % sx + sx, oy % sy + sy]
    const [_x, _y] = [Math.floor(x), Math.floor(y)]
    const [xi, yi] = [x - _x, y - _y]
    const [x0, y0] = [((_x - 1) + sx) % sx, ((_y - 1) + sy) % sy]
    const [x1, y1] = [_x % sx, _y % sy]
    const [x2, y2] = [(_x + 1) % sx, (_y + 1) % sy]
    const [x3, y3] = [(_x + 2) % sx, (_y + 2) % sy]
    return cerp(
      cerp(source[x0][y0], source[x1][y0], source[x2][y0], source[x3][y0], xi),
      cerp(source[x0][y1], source[x1][y1], source[x2][y1], source[x3][y1], xi),
      cerp(source[x0][y2], source[x1][y2], source[x2][y2], source[x3][y2], xi),
      cerp(source[x0][y3], source[x1][y3], source[x2][y3], source[x3][y3], xi),
      yi
    )
  }
}

function generate3DNoiseFn (source: Uint8Array[][]): (ox: number, oy: number, oz: number) => number {
  const [sx, sy, sz] = [source.length, source[0].length, source[0][0].length]
  return (ox, oy, oz) => {
    const [x, y, z] = [ox % sx + sx, oy % sy + sy, oz % sz + sz]
    const [_x, _y, _z] = [Math.floor(x), Math.floor(y), Math.floor(z)]
    const [xi, yi, zi] = [x - _x, y - _y, z - _z]
    const [x0, y0, z0] = [((_x - 1) + sx) % sx, ((_y - 1) + sy) % sy, ((_z - 1) + sz) % sz]
    const [x1, y1, z1] = [_x % sx, _y % sy, _z % sz]
    const [x2, y2, z2] = [(_x + 1) % sx, (_y + 1) % sy, (_z + 1) % sz]
    const [x3, y3, z3] = [(_x + 2) % sx, (_y + 2) % sy, (_z + 2) % sz]
    return cerp(
      cerp(
        cerp(source[x0][y0][z0], source[x1][y0][z0], source[x2][y0][z0], source[x3][y0][z0], xi),
        cerp(source[x0][y1][z0], source[x1][y1][z0], source[x2][y1][z0], source[x3][y1][z0], xi),
        cerp(source[x0][y2][z0], source[x1][y2][z0], source[x2][y2][z0], source[x3][y2][z0], xi),
        cerp(source[x0][y3][z0], source[x1][y3][z0], source[x2][y3][z0], source[x3][y3][z0], xi),
        yi
      ),
      cerp(
        cerp(source[x0][y0][z1], source[x1][y0][z1], source[x2][y0][z1], source[x3][y0][z1], xi),
        cerp(source[x0][y1][z1], source[x1][y1][z1], source[x2][y1][z1], source[x3][y1][z1], xi),
        cerp(source[x0][y2][z1], source[x1][y2][z1], source[x2][y2][z1], source[x3][y2][z1], xi),
        cerp(source[x0][y3][z1], source[x1][y3][z1], source[x2][y3][z1], source[x3][y3][z1], xi),
        yi
      ),
      cerp(
        cerp(source[x0][y0][z2], source[x1][y0][z2], source[x2][y0][z2], source[x3][y0][z2], xi),
        cerp(source[x0][y1][z2], source[x1][y1][z2], source[x2][y1][z2], source[x3][y1][z2], xi),
        cerp(source[x0][y2][z2], source[x1][y2][z2], source[x2][y2][z2], source[x3][y2][z2], xi),
        cerp(source[x0][y3][z2], source[x1][y3][z2], source[x2][y3][z2], source[x3][y3][z2], xi),
        yi
      ),
      cerp(
        cerp(source[x0][y0][z3], source[x1][y0][z3], source[x2][y0][z3], source[x3][y0][z3], xi),
        cerp(source[x0][y1][z3], source[x1][y1][z3], source[x2][y1][z3], source[x3][y1][z3], xi),
        cerp(source[x0][y2][z3], source[x1][y2][z3], source[x2][y2][z3], source[x3][y2][z3], xi),
        cerp(source[x0][y3][z3], source[x1][y3][z3], source[x2][y3][z3], source[x3][y3][z3], xi),
        yi
      ),
      zi
    )
  }
}

function generateArray (count: number, fn: (index: number) => any): any[] {
  const items = []
  for (let i = 0; i < count; i++) items.push(fn(i))
  return items
}

export function generateCuboid (width: number, height: number, depth: number, options: Options = {}): Uint8Array[][] {
  const { amplitude, frequency, octaves, persistence } = processOptions(options)
  const white = generateArray(width, () => generateArray(height, () =>
    window.crypto.getRandomValues(new Uint8Array(depth))
  ))
  const noise = generate3DNoiseFn(white)
  return generateArray(width, x => generateArray(height, y => generateArray(depth, z =>
    generateArray(octaves, octave => {
      const freq = frequency * Math.pow(2, octave)
      return noise(x * freq, y * freq, z * freq) * (amplitude * Math.pow(persistence, octave))
    }).reduce((total, num) => total + num, 0)
    / (2 - (1 / Math.pow(2, octaves - 1)))
  )))
}

export function generateCylinder (circumference: number, height: number, options: Options = {}): Uint8Array[] {
  const { amplitude, frequency, octaves, persistence } = processOptions(options)
  const diameter = Math.ceil(circumference / Math.PI)
  const white = generateArray(diameter, () => generateArray(height, () =>
    window.crypto.getRandomValues(new Uint8Array(diameter))
  ))
  const noise = generate3DNoiseFn(white)
  const radius = circumference / TWO_PI
  return generateArray(circumference, x => generateArray(height, y =>
    generateArray(octaves, octave => {
      const freq = frequency * Math.pow(2, octave)
      const nx = x / circumference
      const rdx = nx * TWO_PI
      const [a, b] = [radius * Math.sin(rdx), radius * Math.cos(rdx)]
      return noise(a * freq, b * freq, y * freq) * (amplitude * Math.pow(persistence, octave))
    }).reduce((total, num) => total + num, 0)
    / (2 - (1 / Math.pow(2, octaves - 1)))
  ))
}

export function generateLine (length: number, options: Options = {}): number[] {
  const { amplitude, frequency, octaves, persistence } = processOptions(options)
  const white = <Uint8Array> window.crypto.getRandomValues(new Uint8Array(length))
  const noise = generate1DNoiseFn(white)
  return generateArray(length, x =>
    generateArray(octaves, octave => {
      const freq = frequency * Math.pow(2, octaves)
      return noise(x * freq) * (amplitude * Math.pow(persistence, octave))
    }).reduce((total, num) => total + num, 0)
    / (2 - (1 / Math.pow(2, octaves - 1)))
  )
}

export function generateRectangle (width: number, height: number, options: Options = {}): Uint8Array[] {
  const { amplitude, frequency, octaves, persistence } = processOptions(options)
  const white = generateArray(width, () => window.crypto.getRandomValues(new Uint8Array(height)))
  const noise = generate2DNoiseFn(white)
  return generateArray(width, x => generateArray(height, y =>
    generateArray(octaves, octave => {
      const freq = frequency * Math.pow(2, octave)
      return noise(x * freq, y * freq) * (amplitude * Math.pow(persistence, octave))
    }).reduce((total, num) => total + num, 0)
    / (2 - (1 / Math.pow(2, octaves - 1)))
  ))
}

export function generateSphere (circumference: number, options: Options = {}): Uint8Array[] {
  const { amplitude, frequency, octaves, persistence } = processOptions(options)
  const diameter = Math.ceil(circumference / Math.PI)
  const white = generateArray(diameter, () => generateArray(diameter, () =>
    window.crypto.getRandomValues(new Uint8Array(diameter))
  ))
  const noise = generate3DNoiseFn(white)
  const radius = circumference / TWO_PI
  return generateArray(circumference, x => generateArray(circumference, y =>
    generateArray(octaves, octave => {
      const freq = frequency * Math.pow(2, octave)
      const [nx, ny] = [x / circumference, y / circumference]
      const [rdx, rdy] = [nx * TWO_PI, ny * TWO_PI]
      const sinY = Math.sin(rdy + Math.PI)
      const sinRds = 2 * Math.PI
      const a = sinRds * Math.sin(rdx) * sinY
      const b = sinRds * Math.cos(rdx) * sinY
      const d = sinRds * Math.cos(rdy)
      return noise(a * freq, b * freq, d * freq) * (amplitude * Math.pow(persistence, octave))
    }).reduce((total, num) => total + num, 0)
    / (2 - (1 / Math.pow(2, octaves - 1)))
  ))
}

function processOptions (options: Options): Options {
  return {
    amplitude: typeof options.amplitude === 'number' ? options.amplitude : 1.0,
    frequency: typeof options.frequency === 'number' ? options.frequency : 1.0,
    octaves: typeof options.octaves === 'number' ? Math.floor(options.octaves) : 1,
    persistence: typeof options.persistence === 'number' ? options.persistence : 0.5
  }
}
