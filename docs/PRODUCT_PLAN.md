# Product plan

Status: implementation preview  
Decision: build the missing integration, not another floorplan or radar clone.

## Existing ecosystem

- [Radar Map Manager](https://github.com/Moe8383/radar_map_manager) already
  provides radar placement, zones and multi-radar fusion.
- [Easy Floorplan](https://github.com/nicosandller/easy-floorplan) already
  provides multi-floor visual drawing, rooms, openings and furniture.
- [ha-floorplan](https://github.com/ExperienceLovelace/ha-floorplan) is a mature
  SVG-based Home Assistant visualization layer.
- [Sweet Home 3D Floorplan](https://github.com/shmuelzon/home-assistant-floor-plan)
  generates detailed floorplans outside Home Assistant.

Spatial Presence is justified only if it closes the gap between a real spatial
floor model and radar-native calibration, fusion and occupancy. Architecture
work therefore starts with public upstream RFCs and stable adapter boundaries.

## Product promise

Install through HACS, draw or trace a home, place compatible mmWave sensors,
calibrate them visually, and receive live whole-house tracks plus ordinary Home
Assistant room and zone entities without hand-editing YAML.

## Delivery

### Preview foundation

- HACS integration and Lovelace card packaging.
- Spatial Map Schema 0.1 and LD2450 entity adapter.
- Responsive pan/zoom map, multiple floors, wall/room drawing, radar placement,
  rotation, coverage bands, trails and climate inspection.
- Unit tests, CI, privacy and security policy.
- Validated map persistence, one-revision rollback and editor controls.
- Easy Floorplan and Radar Map Manager import spikes with conversion warnings.
- Alpha.3 push runtime with native room/zone occupancy, target-count and
  enter/leave event entities, exclusion filtering and stationary hold.
- Guided one-reference calibration for radar placement, heading and map scale.

### Beta

- Validate calibration and native entities on multiple real Home Assistant
  installations and radar orientations.
- Expand upstream adapters based on maintainer feedback.
- Touch-first editing, undo/redo and accessible keyboard placement.

### 1.0

- Explainable multi-radar fusion and room transitions.
- Synthetic playback, performance budgets and degraded/offline behavior.
- HACS release validation, translations and independent multi-home beta tests.

## Release gates

Continue beyond preview only if upstream discussions confirm that no existing
project will deliver the complete integrated workflow on a reasonable timeline,
or if this work is accepted as a shared extension. Version 1.0 requires a new
user to install, trace a floor, calibrate one radar, create a room zone and use
the resulting entity in an automation without editing code.

Person identification, cloud accounts, camera fusion, full CAD/BIM and claims
of centimeter-perfect paths are outside the product contract.
