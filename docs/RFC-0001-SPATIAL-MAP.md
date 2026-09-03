# RFC 0001: Spatial Map Schema

Status: draft

## Goal

Define a portable map that lets a floorplan editor, a radar fusion engine and
Home Assistant exchange spatial configuration without sharing UI code.

## Separation

Stored configuration contains floors, geometry, sensor poses and zones. Live
tracks are a separate ephemeral stream. This prevents high-frequency radar
updates from rewriting dashboard or integration configuration.

## Coordinate system

- Floor geometry uses arbitrary positive canvas units plus `pixels_per_meter`.
- Canvas origin is top-left; x increases right and y increases down.
- Sensor-local coordinates use millimetres; positive x is sensor-right and
  positive y is sensor-forward.
- Heading is degrees clockwise from canvas up.
- Adapters normalize vendor units before the spatial engine sees a track.

The normative draft is `packages/map-schema/schema.json`; examples are in
`packages/map-schema/examples/`.

## Persistence contract

The optional Home Assistant backend exposes authenticated websocket commands:

- `spatial_presence/map/list` — metadata only.
- `spatial_presence/map/get` — one stored map and its revision.
- `spatial_presence/map/save` — admin-only validated save.
- `spatial_presence/map/restore_previous` — admin-only one-revision rollback.

Dashboard configuration can still carry and export the complete map. Backend
storage is an explicit portability and recovery boundary, not a lock-in point.

## Compatibility

Readers must reject unsupported major versions and preserve unknown fields when
round-tripping a compatible minor version. Schema migrations must be pure,
tested functions.
