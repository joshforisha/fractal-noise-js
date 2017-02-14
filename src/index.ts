const TWO_PI = 2 * Math.PI

interface Options {
  amplitude?: number
  frequency?: number
  octaves?: number
  persistence?: number
}

function generate1DNoiseFn (source: Uint8Array): (ox: number) => number {
  const sx = source.length
  return ox => {
    const x = ox % sx + sx
    const _x = Math.floor(x)
    const xi = x - _x
    const x1 = _x % sx
    const x2 = (_x + 1) % sx
    return lerp(source[x1], source[x2], xi)
  }
}

function generate2DNoiseFn (source: Uint8Array[]): (ox: number, oy: number) => number {
  const [sx, sy] = [source.length, source[0].length]
  return (ox, oy) => {
    const [x, y] = [ox % sx + sx, oy % sy + sy]
    const [_x, _y] = [Math.floor(x), Math.floor(y)]
    const [xi, yi] = [x - _x, y - _y]
    const [x1, y1] = [_x % sx, _y % sy]
    const [x2, y2] = [(_x + 1) % sx, (_y + 1) % sy]
    return lerp(
      lerp(source[x1][y1], source[x2][y1], xi),
      lerp(source[x1][y2], source[x2][y2], xi),
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
    const [x1, y1, z1] = [_x % sx, _y % sy, _z % sz]
    const [x2, y2, z2] = [(_x + 1) % sx, (_y + 1) % sy, (_z + 1) % sz]
    const bottom = lerp(
      lerp(source[x1][y1][z1], source[x2][y1][z1], xi),
      lerp(source[x1][y2][z1], source[x2][y2][z1], xi),
      yi
    )
    const top = lerp(
      lerp(source[x1][y1][z2], source[x2][y1][z2], xi),
      lerp(source[x1][y2][z2], source[x2][y2][z2], xi),
      yi
    )
    return lerp(bottom, top, zi)
  }
}

function generateArray (count: number, fn: (index: number) => any): any[] {
  const items = []
  for (let i = 0; i < count; i++) items.push(fn(i))
  return items
}

export function generateCylinder (circumference: number, height: number, options: Options = {}): Uint8Array[] {
  const { amplitude, frequency, octaves, persistence } = processOptions(options)
  const size = Math.ceil(Math.max(circumference, height) * frequency)
  const white = generateArray(size, () =>
    generateArray(size, () =>
      window.crypto.getRandomValues(new Uint8Array(size))
    )
  )
  const noise = generate3DNoiseFn(white)
  return generateArray(circumference, x => generateArray(height, y =>
    generateArray(octaves, octave => {
      const freq = frequency * Math.pow(2, octave)
      const nx = x / circumference
      const r = circumference / TWO_PI
      const rdx = nx * TWO_PI
      const a = r * Math.sin(rdx)
      const b = r * Math.cos(rdx)

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
  const size = Math.ceil(Math.max(width, height) * frequency)
  const white = generateArray(size, () => window.crypto.getRandomValues(new Uint8Array(size)))
  const noise = generate2DNoiseFn(white)
  return generateArray(width, x => generateArray(height, y =>
    generateArray(octaves, octave => {
      const freq = frequency * Math.pow(2, octave)
      return noise(x * freq, y * freq) * (amplitude * Math.pow(persistence, octave))
    }).reduce((total, num) => total + num, 0)
    / (2 - (1 / Math.pow(2, octaves - 1)))
  ))
}

function lerp (a: number, b: number, w: number): number {
  return a + w * (b - a)
}

function processOptions (options: Options): Options {
  return {
    amplitude: typeof options.amplitude === 'number' ? options.amplitude : 1.0,
    frequency: typeof options.frequency === 'number' ? options.frequency : 1.0,
    octaves: typeof options.octaves === 'number' ? Math.floor(options.octaves) : 1,
    persistence: typeof options.persistence === 'number' ? options.persistence : 0.5
  }
}

// ---------------------------------------------------------------------------------------------------------------------

const height = 512
const width = 1024

const canvas = document.querySelector('canvas')
canvas.setAttribute('height', String(height))
canvas.setAttribute('width', String(width))

const ctx = canvas.getContext('2d')
const imageData = ctx.createImageData(width, height)

const numPoints = width * height
const startTime = Date.now()

// const noise = generateCylinder(width, height, { frequency: 0.05, octaves: 32 })
const noise = generateLine(width, { frequency: 0.2 })
for (let x = 0; x < width; x++) {
  for (let y = 0; y < height; y++) {
    const i = (x + y * width) * 4
    const value = noise[x]
    imageData.data[i] = value
    imageData.data[i + 1] = value
    imageData.data[i + 2] = value
    imageData.data[i + 3] = 255
  }
}

const time = Date.now() - startTime
const rate = Math.floor(numPoints / time)
console.log(`${time}ms (${rate}pt/ms)`)

ctx.putImageData(imageData, 0, 0)
