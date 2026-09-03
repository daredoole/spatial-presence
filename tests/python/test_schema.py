"""Tests for untrusted Spatial Map validation."""

from __future__ import annotations

from copy import deepcopy
import importlib.util
import math
from pathlib import Path
import unittest

ROOT = Path(__file__).parents[2]
SPEC = importlib.util.spec_from_file_location(
    "spatial_presence_schema",
    ROOT / "custom_components" / "spatial_presence" / "schema.py",
)
assert SPEC and SPEC.loader
SCHEMA = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(SCHEMA)
MapValidationError = SCHEMA.MapValidationError
validate_map_config = SCHEMA.validate_map_config
validate_map_id = SCHEMA.validate_map_id


def valid_map() -> dict:
    return {
        "schema_version": "0.1",
        "floors": [
            {
                "id": "main",
                "name": "Main floor",
                "width": 1200,
                "height": 800,
                "pixels_per_meter": 100,
                "walls": [
                    {
                        "id": "wall",
                        "points": [{"x": 0, "y": 0}, {"x": 100, "y": 0}],
                    }
                ],
                "rooms": [],
                "zones": [],
                "sensors": [
                    {"id": "radar", "x": 500, "y": 700, "heading": 0}
                ],
            }
        ],
    }


class MapValidationTests(unittest.TestCase):
    def test_accepts_and_copies_valid_map(self) -> None:
        original = valid_map()
        result = validate_map_config(original)
        self.assertEqual(result, original)
        self.assertIsNot(result, original)

    def test_rejects_duplicate_floor_ids(self) -> None:
        candidate = valid_map()
        candidate["floors"].append(deepcopy(candidate["floors"][0]))
        with self.assertRaisesRegex(MapValidationError, "Duplicate floor id"):
            validate_map_config(candidate)

    def test_rejects_unsafe_background_scheme(self) -> None:
        candidate = valid_map()
        candidate["floors"][0]["background"] = "javascript:alert(1)"
        with self.assertRaisesRegex(MapValidationError, "background"):
            validate_map_config(candidate)

    def test_rejects_non_finite_coordinates(self) -> None:
        candidate = valid_map()
        candidate["floors"][0]["sensors"][0]["x"] = math.inf
        with self.assertRaisesRegex(MapValidationError, "finite JSON"):
            validate_map_config(candidate)

    def test_rejects_invalid_map_ids(self) -> None:
        for value in ("Upstairs", "../secret", "", "a" * 65):
            with self.subTest(value=value):
                with self.assertRaises(MapValidationError):
                    validate_map_id(value)

    def test_validates_stationary_hold_bounds(self) -> None:
        candidate = valid_map()
        candidate["stationary_hold_seconds"] = 30
        self.assertEqual(validate_map_config(candidate), candidate)
        candidate["stationary_hold_seconds"] = 3601
        with self.assertRaisesRegex(MapValidationError, "stationary_hold_seconds"):
            validate_map_config(candidate)

    def test_rejects_invalid_entity_prefix(self) -> None:
        candidate = valid_map()
        candidate["floors"][0]["sensors"][0]["entity_prefix"] = "sensor.Bad prefix"
        with self.assertRaisesRegex(MapValidationError, "entity_prefix"):
            validate_map_config(candidate)

    def test_rejects_missing_default_floor(self) -> None:
        candidate = valid_map()
        candidate["default_floor"] = "basement"
        with self.assertRaisesRegex(MapValidationError, "default_floor"):
            validate_map_config(candidate)


if __name__ == "__main__":
    unittest.main()
