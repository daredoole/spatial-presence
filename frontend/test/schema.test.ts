import { readFileSync } from "node:fs";

import Ajv2020 from "ajv/dist/2020.js";
import type { AnySchema } from "ajv";
import { describe, expect, it } from "vitest";

const readJson = (path: string): unknown =>
  JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));

describe("Spatial Map Schema", () => {
  it("accepts the public example", () => {
    const schema = readJson("../../packages/map-schema/schema.json") as AnySchema;
    const example = readJson(
      "../../packages/map-schema/examples/demo-home.json",
    );
    const validate = new Ajv2020({ strict: true }).compile(schema);
    expect(validate(example), JSON.stringify(validate.errors)).toBe(true);
  });

  it("rejects an unsupported schema version", () => {
    const schema = readJson("../../packages/map-schema/schema.json") as AnySchema;
    const validate = new Ajv2020({ strict: true }).compile(schema);
    expect(validate({ schema_version: "9.0", floors: [] })).toBe(false);
  });
});
