# Spatial Presence

A local-first spatial presence editor and live whole-home radar map for Home
Assistant. Draw or trace floors, place mmWave sensors, calibrate their heading,
and turn anonymous target coordinates into useful room and zone occupancy.

> Early development preview. The map card, LD2450 adapter, geometry engine,
> graphical editor and HACS integration packaging are functional foundations;
> multi-radar fusion and persistent backend map storage are roadmap work.

## Why this project

[Easy Floorplan](https://github.com/nicosandller/easy-floorplan) is a strong
visual floorplan editor. [Radar Map Manager](https://github.com/Moe8383/radar_map_manager)
is a strong radar placement and fusion tool. Spatial Presence is being built
upstream-first around the gap between those capabilities, not as an attempt to
silently clone either project. See [the product decision](docs/PRODUCT_PLAN.md)
and [the interoperability RFC](docs/RFC-0001-SPATIAL-MAP.md).

## Current preview

- Full-viewport, no-page-scroll map with fit, pan and zoom.
- Multi-floor selector.
- Draw walls and room polygons in the graphical card editor.
- Use a local `/local/...` image or SVG as a traceable background.
- Auto-discover ESPHome LD2450 `target_N_x` / `target_N_y` entity families.
- Drag radars, rotate them in one-degree or fifteen-degree steps, and render
  three confidence bands instead of a misleading precision triangle.
- Live target trails and optional temperature/humidity in the inspector.
- Versioned Spatial Map JSON Schema with migration-ready versions.

## Development

Requirements: Node.js 20+ and Python 3.12+.

```bash
npm install
npm test
npm run build
python -m compileall custom_components/spatial_presence
```

The production frontend bundle is written to
`custom_components/spatial_presence/frontend/spatial-presence-card.js`.

## Manual preview installation

1. Run `npm install && npm run build`.
2. Copy `custom_components/spatial_presence` into Home Assistant's
   `custom_components` directory.
3. Restart Home Assistant and add **Spatial Presence** from Devices & services.
4. Refresh the browser after setup; the integration registers its bundled card
   automatically.
5. Add the **Spatial Presence** card from the graphical card picker.

HACS release installation will replace these manual steps once the first beta
release is published.

## Safety and privacy

Target history stays in browser memory and expires quickly. It is not persisted
or uploaded. Imported SVGs are treated as images, never injected into the DOM.
Spatial Presence maps anonymous tracks; it does not identify people.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md). Architecture proposals start as an
issue or RFC so the map schema stays useful to other Home Assistant projects.
