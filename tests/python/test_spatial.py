"""Tests for the pure spatial projection and occupancy engine."""

from __future__ import annotations

import importlib.util
from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).parents[2]
SPEC = importlib.util.spec_from_file_location(
    "spatial_presence_spatial",
    ROOT / "custom_components" / "spatial_presence" / "spatial.py",
)
assert SPEC and SPEC.loader
SPATIAL = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = SPATIAL
SPEC.loader.exec_module(SPATIAL)


def maps(*, exclusion: bool = False) -> dict:
    zones = []
    if exclusion:
        zones.append(
            {
                "id": "ignore_sofa",
                "kind": "exclusion",
                "points": [
                    {"x": 490, "y": 490},
                    {"x": 510, "y": 490},
                    {"x": 510, "y": 510},
                    {"x": 490, "y": 510},
                ],
            }
        )
    return {
        "house": {
            "title": "My house",
            "config": {
                "schema_version": "0.1",
                "stationary_hold_seconds": 45,
                "floors": [
                    {
                        "id": "main",
                        "name": "Main floor",
                        "width": 1000,
                        "height": 800,
                        "pixels_per_meter": 100,
                        "rooms": [
                            {
                                "id": "living",
                                "name": "Living room",
                                "points": [
                                    {"x": 400, "y": 400},
                                    {"x": 600, "y": 400},
                                    {"x": 600, "y": 600},
                                    {"x": 400, "y": 600},
                                ],
                            }
                        ],
                        "zones": zones,
                        "sensors": [
                            {
                                "id": "radar",
                                "entity_prefix": "ld2450",
                                "x": 500,
                                "y": 700,
                                "heading": 0,
                            }
                        ],
                    }
                ],
            },
        }
    }


def target_states(x: str = "0", y: str = "2") -> dict:
    return {
        "sensor.ld2450_target_1_x": {
            "state": x,
            "attributes": {"unit_of_measurement": "m"},
        },
        "sensor.ld2450_target_1_y": {
            "state": y,
            "attributes": {"unit_of_measurement": "m"},
        },
    }


class SpatialEngineTests(unittest.TestCase):
    def test_projects_target_and_counts_room(self) -> None:
        source = maps()
        definitions = SPATIAL.collect_definitions(source)
        readings = SPATIAL.calculate_readings(source, target_states(), definitions)
        reading = readings["house:main:rooms:living"]
        self.assertEqual(reading.count, 1)
        self.assertTrue(reading.source_available)

    def test_exclusion_zone_suppresses_target(self) -> None:
        source = maps(exclusion=True)
        definitions = SPATIAL.collect_definitions(source)
        reading = SPATIAL.calculate_readings(
            source, target_states(), definitions
        )["house:main:rooms:living"]
        self.assertEqual(reading.count, 0)

    def test_zero_coordinates_mean_no_target(self) -> None:
        source = maps()
        definitions = SPATIAL.collect_definitions(source)
        reading = SPATIAL.calculate_readings(
            source, target_states("0", "0"), definitions
        )["house:main:rooms:living"]
        self.assertEqual(reading.count, 0)
        self.assertTrue(reading.source_available)

    def test_unavailable_source_is_not_reported_empty(self) -> None:
        source = maps()
        definitions = SPATIAL.collect_definitions(source)
        reading = SPATIAL.calculate_readings(
            source,
            {
                "sensor.ld2450_target_1_x": {"state": "unavailable", "attributes": {}},
                "sensor.ld2450_target_1_y": {"state": "unavailable", "attributes": {}},
            },
            definitions,
        )["house:main:rooms:living"]
        self.assertFalse(reading.source_available)

    def test_available_presence_source_can_report_empty(self) -> None:
        source = maps()
        definitions = SPATIAL.collect_definitions(source)
        reading = SPATIAL.calculate_readings(
            source,
            {
                "binary_sensor.ld2450_presence": {
                    "state": "off",
                    "attributes": {},
                },
                "sensor.ld2450_target_1_x": {
                    "state": "unknown",
                    "attributes": {},
                },
                "sensor.ld2450_target_1_y": {
                    "state": "unknown",
                    "attributes": {},
                },
            },
            definitions,
        )["house:main:rooms:living"]
        self.assertTrue(reading.source_available)
        self.assertEqual(reading.count, 0)

    def test_boundary_is_inside_polygon(self) -> None:
        polygon = ((0.0, 0.0), (10.0, 0.0), (10.0, 10.0), (0.0, 10.0))
        self.assertTrue(SPATIAL.point_in_polygon(0, 5, polygon))
        self.assertFalse(SPATIAL.point_in_polygon(11, 5, polygon))


if __name__ == "__main__":
    unittest.main()
