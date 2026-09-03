# Native occupancy entity model

Spatial Presence turns each named room and each non-exclusion zone in a saved
map into three Home Assistant entities:

- `binary_sensor`: occupancy with the standard `occupancy` device class.
- `sensor`: instantaneous raw radar target count.
- `event`: `enter` and `leave` transitions with target count and anonymous
  target IDs in event data.

Entity unique IDs use the stable tuple
`map_id:floor_id:collection:feature_id:<entity kind>`. Renaming a room does not
replace its entities. Removing a feature makes existing entities unavailable;
reloading the integration lets Home Assistant reconcile disabled or orphaned
registry entries without direct registry mutation.

## Runtime behavior

The integration subscribes to configured ESPHome entity families named
`sensor.<prefix>_target_N_x` and `sensor.<prefix>_target_N_y`. It normalizes
millimetres, centimetres, metres, inches and feet—including Home Assistant's
automatic imperial display-unit conversion—then applies each radar pose and
floor scale and tests the projected point against room and zone polygons.
State changes are push-driven; there is no polling interval.

If every configured coordinate source for a floor is unavailable, its derived
entities are unavailable rather than falsely reporting an empty room. A target
at `(0, 0)` is treated as absent, matching the ESPHome LD2450 convention.

Exclusion zones do not create entities. A target inside any exclusion zone on
the floor is omitted from all room and detection-zone calculations. A
stationary zone keeps occupancy on after its last target disappears for
`stationary_hold_seconds` (30 seconds by default), while its count immediately
returns to zero and the `held` attribute becomes true.

## Counting and privacy limits

Targets are anonymous and history is not persisted by the integration. Counts
are raw radar targets, not identified people. When two radars see the same
person, alpha.4 can count both observations; cross-radar fusion is deliberately
reserved for a later release so the current behavior remains deterministic and
auditable.
