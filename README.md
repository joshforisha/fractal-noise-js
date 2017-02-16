# Fractal Noise

[![build](https://img.shields.io/travis/joshforisha/fractal-noise-js.svg)](https://travis-ci.org/joshforisha/fractal-noise-js)
[![npm](https://img.shields.io/npm/v/fractal-noise.svg)](https://www.npmjs.org/package/fractal-noise)

Fractal noise functions designed to be used with any noise generation algorithm.

## Install

    npm install fractal-noise

## Examples

These images were all generated using basic value noise with `width: 888` and `height: 111`.

```javascript
cylinderSurface(width, height, valueNoise3D, { frequency: 0.04, octaves: 2 })
```
![Low frequency, double octave cylinder](https://github.com/joshforisha/fractal-noise-js/blob/master/images/cylinder-low-2.png)

```javascript
cylinderSurface(width, height, valueNoise3D, { frequency: 0.06, octaves: 8 })
```
![Medium frequency, high octave cylinder](https://github.com/joshforisha/fractal-noise-js/blob/master/images/cylinder-medium-8.png)

```javascript
line(width, valueNoise1D) // (Replicated across y-axis)
```
![Default line](https://github.com/joshforisha/fractal-noise-js/blob/master/images/line-default.png)

```javascript
line(height, valueNoise1D, { frequency: 0.1 }) // (Replicated across x-axis)
```
![High frequency line](https://github.com/joshforisha/fractal-noise-js/blob/master/images/line-high.png)

```javascript
rectangle(width, height, valueNoise2D)
```
![Default rectangle](https://github.com/joshforisha/fractal-noise-js/blob/master/images/rectangle-default.png)

```javascript
rectangle(width, height, valueNoise2D, { frequency: 0.04, octaves: 8 })
```
![Low frequency, high octave rectangle](https://github.com/joshforisha/fractal-noise-js/blob/master/images/rectangle-low-8.png)

## API

##### `type Options = { amplitude?, frequency?, octaves?, persistence? }`
* `amplitude?: number` – Defaults to `1.0`
* `frequency?: number` – Defaults to `1.0`
* `octaves?: number` – Defaults to `1`
* `persistence?: number` – Defaults to `0.5`

##### `makeCuboid (width, height, depth, noise3, options?): number[][]`

* `width: number`
* `height: number`
* `depth: number`
* `noise3: (x: number, y: number, z: number) => number`
* `options?: Options = {}`

Generates a three-dimensional noise field for a rectangular cuboid.

##### `makeCylinderSurface(circumference, height, noise3, options?): number[][]`

* `circumference: number`
* `height: number`
* `noise3: (x: number, y: number, z: number) => number`
* `options?: Options = {}`

Generates a two-dimensional noise field formed around a three-dimensional cylinder, such that it is continuous across the x-boundaries.

##### `makeLine (length, noise1, options?): number[]`

* `length: number`
* `noise1: (x: number) => number`
* `options?: Options = {}`

Generates a one-dimensional noise field.

##### `makeRectangle (width, height, noise2, options?): number[][]`

* `width: number`
* `height: number`
* `noise2: (x: number, y: number) => number`
* `options?: Options = {}`

Generates a two-dimensional noise field isolated to `width` and `height` (non-continuous noise).

##### `makeSphereSurface (circumference, options?): number[][]`

* `circumference: number`
* `noise3: (x: number, y: number, z: number) => number`
* `options?: Options = {}`

Generates a two-dimensional noise field formed on the surface of a three-dimensional sphere.
