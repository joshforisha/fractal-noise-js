# Fractal Noise

[![build](https://img.shields.io/travis/joshforisha/fractal-noise-js.svg)](https://travis-ci.org/joshforisha/fractal-noise-js)
[![npm](https://img.shields.io/npm/v/fractal-noise.svg)](https://www.npmjs.org/package/fractal-noise)

Fractal noise library

## Install

    npm install fractal-noise

## API

### Options
The `options` object for each `generate` function contains the following properties:
* `amplitude?: number` – Defaults to `1.0`
* `frequency?: number` – Defaults to `1.0`
* `octaves?: number` – Defaults to `1`
* `persistence?: number` – Defaults to `0.5`

### `generateCylinder (circumference: number, height: number, options: Options = {}): Uint8Array[]`
Generates a two-dimensional noise field formed around a three-dimensional cylinder, such that it is continuous across the x-boundaries.

### `generateLine (length: number, options: Options = {}): number[]`
Generates a one-dimensional noise field.

### `generateRectangle (width: number, height: number, options: Options = {}): Uint8Array[]`
Generates a two-dimensional noise field isolated to `width` and `height` (non-continuous noise).
