#!/usr/bin/env python3
"""Build and validate the HACS release archive."""

from __future__ import annotations

import argparse
import json
from pathlib import Path, PurePosixPath
from zipfile import ZIP_DEFLATED, ZipFile


ROOT = Path(__file__).resolve().parents[1]
COMPONENT = ROOT / "custom_components" / "spatial_presence"
REQUIRED_FILES = {"__init__.py", "manifest.json"}
EXCLUDED_DIRS = {"__pycache__", ".pytest_cache"}
EXCLUDED_SUFFIXES = {".pyc", ".pyo"}


def included_files() -> list[Path]:
    """Return distributable component files in stable order."""
    return sorted(
        path
        for path in COMPONENT.rglob("*")
        if path.is_file()
        and not path.is_symlink()
        and not EXCLUDED_DIRS.intersection(path.relative_to(COMPONENT).parts)
        and path.suffix not in EXCLUDED_SUFFIXES
    )


def validate_archive(archive: Path) -> None:
    """Fail if the archive cannot be extracted directly into HACS' target."""
    with ZipFile(archive) as bundle:
        names = set(bundle.namelist())
        missing = REQUIRED_FILES - names
        if missing:
            raise RuntimeError(f"archive is missing root files: {sorted(missing)}")

        for name in names:
            member = PurePosixPath(name)
            if member.is_absolute() or ".." in member.parts:
                raise RuntimeError(f"unsafe archive path: {name}")
            if member.parts and member.parts[0] == "spatial_presence":
                raise RuntimeError(f"unexpected enclosing integration directory: {name}")

        manifest = json.loads(bundle.read("manifest.json"))
        package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
        if manifest["version"] != package["version"]:
            raise RuntimeError(
                f"version mismatch: {manifest['version']} != {package['version']}"
            )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output",
        type=Path,
        default=ROOT / "spatial_presence.zip",
        help="release archive path",
    )
    args = parser.parse_args()
    args.output.parent.mkdir(parents=True, exist_ok=True)

    with ZipFile(args.output, "w", compression=ZIP_DEFLATED, compresslevel=9) as bundle:
        for path in included_files():
            bundle.write(path, path.relative_to(COMPONENT).as_posix())

    validate_archive(args.output)
    print(f"validated HACS archive: {args.output}")


if __name__ == "__main__":
    main()
