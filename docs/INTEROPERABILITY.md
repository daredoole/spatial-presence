# Interoperability status

Validated against upstream source on 2026-09-03. These are conversion adapters,
not bundled copies of either project.

## Easy Floorplan

Source: [nicosandller/easy-floorplan](https://github.com/nicosandller/easy-floorplan)

| Easy Floorplan | Spatial Presence | Direction |
|---|---|---|
| Card width/height | Floor width/height | Import/export |
| Floor id/name/image | Floor id/name/background | Import/export |
| Wall segment | Two-point wall path | Import/export |
| Area points/name/haArea | Room points/name/area_id | Import/export |
| Openings, items, text, furniture | No current equivalent | Warning on import |
| Trackers | Runtime data, not map config | Warning on import |

Easy Floorplan does not currently encode physical scale. Every import therefore
requires the user to verify pixels per metre before relying on target placement.

## Radar Map Manager

Source: [Moe8383/radar_map_manager](https://github.com/Moe8383/radar_map_manager)

| Radar Map Manager | Spatial Presence | Direction |
|---|---|---|
| Map group | Floor | Import |
| `origin_x` / `origin_y` percent | Sensor canvas x/y | Import |
| Rotation | Sensor heading | Import |
| Ceiling mount | Sensor mount | Import |
| Include/exclude/entrance/stationary zones | Typed zone polygons | Import |
| Background image config | Floor background | Import when present |
| Fusion/smoothing settings | Engine-owned runtime settings | Warning on import |
| Non-uniform scale and radar-local zones | Manual calibration/review | Warning on import |

RMM's map is percentage-based and its scale fields serve its transform engine;
they are not a physical floor scale. Imports use a neutral 1000×1000 canvas and
must be aligned and scaled by the user.

## Compatibility policy

Adapters consume documented or clearly versioned upstream shapes. Fixtures and
tests cover every supported mapping. Unknown or lossy fields produce warnings;
they are never silently presented as equivalent. Upstream maintainers should be
consulted before declaring either format stable.
