# Fractal Noise

Fractal noise functions designed to be used with any noise generation algorithm.

* Deno module: [https://deno.land/x/fractal_noise](https://deno.land/x/fractal_noise)
* NPM package: [fractal-noise](https://www.npmjs.com/package/fractal-noise)

## Examples

These images were all generated using basic value noise with `width: 888` and `height: 111`.

```javascript
makeCylinderSurface(width, height, valueNoise3D, { frequency: 0.04, octaves: 2 })
```
![Low frequency, double octave cylinder](https://raw.githubusercontent.com/joshforisha/fractal-noise-js/main/images/cylinder-low-2.png)

```javascript
makeCylinderSurface(width, height, valueNoise3D, { frequency: 0.06, octaves: 8 })
```
![Medium frequency, high octave cylinder](https://raw.githubusercontent.com/joshforisha/fractal-noise-js/main/images/cylinder-medium-8.png)

```javascript
makeLine(width, valueNoise1D) // (Replicated across y-axis)
```
![Default line](https://raw.githubusercontent.com/joshforisha/fractal-noise-js/main/images/line-default.png)

```javascript
makeLine(height, valueNoise1D, { frequency: 0.1 }) // (Replicated across x-axis)
```
![High frequency line](https://raw.githubusercontent.com/joshforisha/fractal-noise-js/main/images/line-high.png)

```javascript
makeRectangle(width, height, valueNoise2D)
```
![Default rectangle](https://raw.githubusercontent.com/joshforisha/fractal-noise-js/main/images/rectangle-default.png)

```javascript
makeRectangle(width, height, valueNoise2D, { frequency: 0.04, octaves: 8 })
```
![Low frequency, high octave rectangle](https://raw.githubusercontent.com/joshforisha/fractal-noise-js/main/images/rectangle-low-8.png)

## API

##### `interface Options { amplitude?; frequency?; octaves?; persistence? }`

- `amplitude?: number` – Defaults to `1.0`
- `frequency?: number` – Defaults to `1.0`
- `octaves?: number` – Defaults to `1`
- `persistence?: number` – Defaults to `0.5`
- `scale?: (x: number) => number` – Defaults to identity, `(x) => x`

##### `makeCuboid(width, height, depth, noise3, options?): number[][][]`

- `width: number`
- `height: number`
- `depth: number`
- `noise3: (x: number, y: number, z: number) => number`
- `options?: Options = {}`

Generates a three-dimensional noise field for a rectangular cuboid.

##### `makeCylinderSurface(circumference, height, noise3, options?): number[][]`

- `circumference: number`
- `height: number`
- `noise3: (x: number, y: number, z: number) => number`
- `options?: Options = {}`

Generates a two-dimensional noise field formed around a three-dimensional cylinder, such that it is continuous across the x-boundaries.

##### `makeLine(length, noise1, options?): number[]`

- `length: number`
- `noise1: (x: number) => number`
- `options?: Options = {}`

Generates a one-dimensional noise field.

##### `makeRectangle(width, height, noise2, options?): number[][]`

- `width: number`
- `height: number`
- `noise2: (x: number, y: number) => number`
- `options?: Options = {}`

Generates a two-dimensional noise field isolated to `width` and `height` (non-continuous noise).

##### `makeSphereSurface(circumference, options?): number[][]`

- `circumference: number`
- `noise3: (x: number, y: number, z: number) => number`
- `options?: Options = {}`

Generates a two-dimensional noise field formed on the surface of a three-dimensional sphere.
