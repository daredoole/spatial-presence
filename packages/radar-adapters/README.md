# Radar adapter contract

Adapters translate Home Assistant entities into normalized anonymous tracks.
The spatial engine accepts sensor-local millimetres where positive x is right
and positive y is forward, plus availability and optional health/climate data.

The preview LD2450 adapter recognizes:

- `sensor.<prefix>_target_<n>_x`
- `sensor.<prefix>_target_<n>_y`
- optional `sensor.<prefix>_temperature`
- optional `sensor.<prefix>_humidity`
- optional `binary_sensor.<prefix>_online`, `_status`, or `_presence`

Input units `mm`, `cm`, and `m` are normalized before coordinate transforms.
New adapters must include unavailable/zero-target behavior and synthetic test
fixtures. Vendor naming rules must never leak into the map schema.

