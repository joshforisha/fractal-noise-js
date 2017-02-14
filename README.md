# Fractal Noise

[![build](https://img.shields.io/travis/joshforisha/fractal-noise-js.svg)](https://travis-ci.org/joshforisha/fractal-noise-js)
[![npm](https://img.shields.io/npm/v/fractal-noise.svg)](https://www.npmjs.org/package/fractal-noise)

Fractal noise library

## Install

    npm install fractal-noise

## Examples

```javascript
generateCylinder(width, height, { frequency: 0.04, octaves: 2 })
```
![Low frequency, double octave cylinder](https://github.com/joshforisha/fractal-noise-js/blob/master/images/cylinder-low-2.png)

```javascript
generateCylinder(width, height, { frequency: 0.06, octaves: 8 })
```
![Medium frequency, high octave cylinder](https://github.com/joshforisha/fractal-noise-js/blob/master/images/cylinder-medium-8.png)

```javascript
generateLine(width) // (Replicated across y-axis)
```
![Default line](https://github.com/joshforisha/fractal-noise-js/blob/master/images/line-default.png)

```javascript
generateLine(width, { frequency: 0.1 }) // (Replicated across x-axis)
```
![High frequency line](https://github.com/joshforisha/fractal-noise-js/blob/master/images/line-high.png)

```javascript
generateRectangle(width, height)
```
![Default rectangle](https://github.com/joshforisha/fractal-noise-js/blob/master/images/rectangle-default.png)

```javascript
generateRectangle(width, height, { frequency: 0.04, octaves: 8 })
```
![Low frequency, high octave rectangle](https://github.com/joshforisha/fractal-noise-js/blob/master/images/rectangle-low-8.png)

## API

##### Options
The `options` object for each `generate` function contains the following properties:
* `amplitude?: number` – Defaults to `1.0`
* `frequency?: number` – Defaults to `1.0`
* `octaves?: number` – Defaults to `1`
* `persistence?: number` – Defaults to `0.5`

##### `generateCylinder (circumference: number, height: number, options: Options = {}): Uint8Array[]`
Generates a two-dimensional noise field formed around a three-dimensional cylinder, such that it is continuous across the x-boundaries.

##### `generateLine (length: number, options: Options = {}): number[]`
Generates a one-dimensional noise field.

##### `generateRectangle (width: number, height: number, options: Options = {}): Uint8Array[]`
Generates a two-dimensional noise field isolated to `width` and `height` (non-continuous noise).
