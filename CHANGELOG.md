# Changelog

## 0.1.0-alpha.5 — unreleased

- Fit floorplans inside a verified no-page-scroll, six-row responsive card.
- Add a live target/radar summary and larger target halos for tall plans.
- Add illustrated quick-start and support docs, verified project funding,
  dependency updates, issue routing, and commit-pinned GitHub Actions.
- Add a self-hosted integration brand icon required by HACS validation.

## 0.1.0-alpha.4 — unreleased

- Normalize Home Assistant imperial coordinate states in inches or feet before
  projecting radar targets onto a floor.

## 0.1.0-alpha.3 — unreleased

- Add push-based native occupancy, target-count and enter/leave event entities
  for every named room and non-exclusion zone.
- Project up to nine ESPHome LD2450 targets per radar into floor coordinates,
  with unit normalization and exclusion-zone filtering.
- Keep unavailable radar sources distinct from an empty room.
- Add configurable stationary-zone occupancy hold and live map reloads.
- Add guided one-reference radar calibration for position, heading and scale.

## 0.1.0-alpha.2 — unreleased

- Add validated, authenticated Home Assistant map storage websocket commands.
- Retain one prior map revision and expose admin-only rollback.
- Add graphical save, load and restore controls with actionable status text.
- Import Easy Floorplan walls/areas and Radar Map Manager poses/zones.
- Export Spatial Presence architectural geometry to Easy Floorplan.
- Add Python validation/storage tests and frontend adapter/backend tests.

## 0.1.0-alpha.1 — unreleased

- Initial HACS custom-integration and Lovelace-card packaging.
- Spatial Map Schema 0.1 with a portable example.
- Responsive multi-floor SVG viewport with pan, zoom and fit.
- Graphical wall, room and zone drawing.
- LD2450 entity discovery, unit normalization and target transforms.
- Radar drag placement, fine/coarse rotation and confidence-band coverage.
- Ephemeral target trails plus temperature and humidity inspection.
- JSON import/export, test suite, CI and upstream interoperability RFC.
