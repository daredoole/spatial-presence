# Home Assistant backend API

The custom integration stores maps through Home Assistant's atomic `Store`
helper. No code reads or edits `.storage` directly.

## Commands

### `spatial_presence/map/list`

Authenticated read returning map id, title, revision, update time, floor count
and rollback availability. Geometry is omitted.

### `spatial_presence/map/get`

Authenticated read with `map_id`. Returns the validated map envelope or
`map_not_found`.

### `spatial_presence/map/save`

Administrator-only write with `map_id`, `config` and optional `title`. The
backend rejects unsafe ids, unsupported schema versions, non-finite/bounded
geometry, invalid image schemes and payloads over 2 MB. A successful save keeps
the prior revision for rollback.

### `spatial_presence/map/restore_previous`

Administrator-only write with `map_id`. Swaps the current and prior map configs,
creating a new revision so the operation itself remains recoverable.

There is deliberately no delete command in the preview API.
