import Ajv from "ajv";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { beforeAll, describe, expect, test } from "vitest";

const schemaUrl =
	"https://raw.githubusercontent.com/earendil-works/pi/main/packages/coding-agent/src/modes/interactive/theme/theme-schema.json";
const schemaPath = resolve(".cache/pi-theme-schema.json");
const themeDir = resolve("themes/pi");
const sourceThemeDir = resolve("drcmda/poimandres-theme/themes");
const themeFiles = [
	"poimandres.json",
	"poimandres-noitalics.json",
	"poimandres-storm.json",
	"poimandres-noitalics-storm.json",
	"poimandres-white.json",
];

const sourceThemeMap = {
	"poimandres.json": "poimandres-color-theme.json",
	"poimandres-noitalics.json": "poimandres-color-theme-noitalics.json",
	"poimandres-storm.json": "poimandres-color-theme-storm.json",
	"poimandres-noitalics-storm.json": "poimandres-color-theme-noitalics-storm.json",
	"poimandres-white.json": "poimandres-color-theme-white.json",
};

const testCases = themeFiles.map((file) => ({
	file,
	sourceFile: sourceThemeMap[file],
}));

async function loadSchema() {
	if (!existsSync(schemaPath)) {
		const response = await fetch(schemaUrl);
		expect(response.ok).toBe(true);
		const schema = await response.text();
		mkdirSync(dirname(schemaPath), { recursive: true });
		writeFileSync(schemaPath, schema);
	}

	return JSON.parse(readFileSync(schemaPath, "utf8"));
}

function loadTheme(file, dir = themeDir) {
	return JSON.parse(readFileSync(join(dir, file), "utf8"));
}

function getUpstreamColorValues(source) {
	const colors = new Set(Object.values(source.colors ?? {}));
	const tokenForegrounds = new Set(
		(source.tokenColors ?? [])
			.map((entry) => entry?.settings?.foreground)
			.filter((value) => typeof value === "string" && value.length > 0),
	);

	return new Set([...colors, ...tokenForegrounds]);
}

describe("Pi theme schema and mapping validation", () => {
	let validate;

	beforeAll(async () => {
		const schema = await loadSchema();
		const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
		validate = ajv.compile(schema);
	});

	test.each(testCases)("$file validates against schema", ({ file }) => {
		const data = loadTheme(file);
		const valid = validate(data);
		expect(valid, JSON.stringify(validate.errors, null, 2)).toBe(true);
		expect(data).not.toHaveProperty("export", {});
	});

	test.each(testCases)("$file uses declared vars for non-empty refs", ({ file }) => {
		const theme = loadTheme(file);
		const vars = new Set(Object.keys(theme.vars));

		for (const [key, value] of Object.entries(theme.colors)) {
			if (value === "") continue;
			expect(vars.has(value), `${file}: ${key} -> ${value} is not declared in vars`).toBe(true);
		}
	});

	test.each(testCases)("$file resolves only to upstream source colors or token foregrounds", ({ file, sourceFile }) => {
		const generated = loadTheme(file);
		const source = loadTheme(sourceFile, sourceThemeDir);
		const allowedValues = getUpstreamColorValues(source);
		const generatedVarValues = new Set(Object.values(generated.vars));

		for (const [key, value] of Object.entries(generated.colors)) {
			if (value === "") continue;
			expect(generatedVarValues.has(generated.vars[value]), `${file}: ${key} points at missing var ${value}`).toBe(true);
			expect(
				allowedValues.has(generated.vars[value]),
				`${file}: ${key} -> ${value} resolves to ${generated.vars[value]}, which is not present in upstream source theme colors or tokenColors.foreground`,
			).toBe(true);
		}
	});
});
