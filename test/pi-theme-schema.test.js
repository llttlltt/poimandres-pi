import fs from "node:fs";
import path from "node:path";
import Ajv from "ajv";
import { beforeAll, describe, expect, test } from "vitest";

const schemaUrl = "https://raw.githubusercontent.com/earendil-works/pi/main/packages/coding-agent/src/modes/interactive/theme/theme-schema.json";
const schemaPath = path.resolve(".cache/pi-theme-schema.json");
const themeDir = path.resolve("themes/pi");

async function loadSchema() {
	if (!fs.existsSync(schemaPath)) {
		const response = await fetch(schemaUrl);
		expect(response.ok).toBe(true);
		const schema = await response.text();
		fs.mkdirSync(path.dirname(schemaPath), { recursive: true });
		fs.writeFileSync(schemaPath, schema);
	}

	return JSON.parse(fs.readFileSync(schemaPath, "utf8"));
}

function loadThemes() {
	return fs
		.readdirSync(themeDir)
		.filter((file) => file.endsWith(".json"))
		.map((file) => ({ file, data: JSON.parse(fs.readFileSync(path.join(themeDir, file), "utf8")) }));
}

describe("Pi theme schema validation", () => {
	let validate;

	beforeAll(async () => {
		const schema = await loadSchema();
		const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
		validate = ajv.compile(schema);
	});

	test.each(loadThemes())("validates %s", ({ file, data }) => {
		const valid = validate(data);
		expect(valid, JSON.stringify(validate.errors, null, 2)).toBe(true);
		expect(file).toMatch(/poimandres-pi-theme/);
	});
});
