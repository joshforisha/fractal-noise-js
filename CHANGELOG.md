# Change Log

## [Unreleased]

## [v0.9] – 2017-02-16
### Changed
- Cleanup code based on TypeScript added compiler options.

### Fixed
- Fix `rdy` calculation in `makeSphereSurface`.

## [v0.7] – 2017-02-15
### Fixed
- Rename functions to match API because I'm a dummy and forgot to do that.

## [v0.6] – 2017-02-15
### Changed
- Convert to fractal wrapper library.

### Removed
- Remove noise generation functions.

## [v0.5] – 2017-02-14
### Changed
- Remove ".js" from "main" file in `package.json`.

## [v0.4] – 2017-02-14
### Added
- Add output of type declaration file.

## [v0.3] – 2017-02-14
### Added
- Create `generateCuboid` for 3D rectangle.
- Create `generateSphere`.

## [v0.2] – 2017-02-14
### Changed
- Constrain noise source more accurately for `generateCylinder`.

### Fixed
- Use correct operator for 3D noise `y0` calculation.

### Removed
- Remove white noise scaling using `frequency` (makes no difference).

## [v0.1] – 2017-02-14
### Added
- Create functions `generateCylinder`, `generateLine`, `generateRectangle`.

[Unreleased]: https://github.com/joshforisha/fractal-noise-js/compare/v0.9...HEAD
[v0.9]: https://github.com/joshforisha/fractal-noise-js/compare/v0.7...v0.9
[v0.7]: https://github.com/joshforisha/fractal-noise-js/compare/v0.6...v0.7
[v0.6]: https://github.com/joshforisha/fractal-noise-js/compare/v0.5...v0.6
[v0.5]: https://github.com/joshforisha/fractal-noise-js/compare/v0.4...v0.5
[v0.4]: https://github.com/joshforisha/fractal-noise-js/compare/v0.3...v0.4
[v0.3]: https://github.com/joshforisha/fractal-noise-js/compare/v0.2...v0.3
[v0.2]: https://github.com/joshforisha/fractal-noise-js/compare/v0.1...v0.2
[v0.1]: https://github.com/joshforisha/fractal-noise-js/releases/tag/v0.1
