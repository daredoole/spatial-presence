# Upstream discussion draft: shared floorplan + spatial radar contract

This is a draft, not a posted issue.

## Summary

Home Assistant has strong floorplan authoring and strong radar mapping projects,
but users cannot currently draw one spatial model and use it for radar
placement, calibration, fusion, rooms and automations without duplicating
configuration. We propose a small versioned interchange schema and adapter API,
not a merger or rewrite.

## Questions for Easy Floorplan

1. Is a documented import/export or extension interface planned for floors,
   scale, walls, rooms and HA area links?
2. Would an optional layer provider for ephemeral x/y/z tracks fit the editor?
3. Which parts of dashboard card configuration are stable enough to translate?

## Questions for Radar Map Manager

1. Can radar pose, zones and normalized/fused tracks be exposed behind a stable
   integration API independent of the current map renderer?
2. Could a map-group reference an external floor/room schema?
3. Which calibration and fusion fields must remain engine-owned?

## Proposed boundary

- Floor editor owns architectural geometry and HA area links.
- Radar engine owns device adapters, target normalization, smoothing and fusion.
- Shared schema owns metric scale, floor IDs, sensor poses and zone geometry.
- Runtime target streams never rewrite stored floorplan configuration.

The initial schema and coordinate convention are documented in
`RFC-0001-SPATIAL-MAP.md`. A throwaway adapter spike should precede any public
claim that a new standalone project is necessary.

