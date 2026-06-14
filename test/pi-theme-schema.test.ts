import Ajv, { ValidateFunction } from "ajv";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { beforeAll, describe, expect, test } from "vitest";
import { CANONICAL_MAPPING, extractWhitePalette } from "../src/extract-white-palette.js";
import { normaliseHex, normalisePalette } from "../src/hex-utils.js";

interface PiTheme {
	$schema: string;
	name: string;
	vars: Record<string, string>;
	colors: Record<string, string>;
	export: Record<string, string>;
}

interface VsCodeTheme {
	colors?: Record<string, string>;
	tokenColors?: Array<{
		scope?: string | string[];
		settings?: { foreground?: string };
	}>;
}

const schemaUrl =
	"https://raw.githubusercontent.com/earendil-works/pi/main/packages/coding-agent/src/modes/interactive/theme/theme-schema.json";
const schemaPath = resolve(".cache/pi-theme-schema.json");
const themeDir = resolve("themes/pi");
const sourceThemeDir = resolve("drcmda/poimandres-theme/themes");
const whiteSourcePath = resolve(
	"drcmda/poimandres-theme/themes/poimandres-color-theme-white.json",
);
const themeFiles = [
	"poimandres.json",
	"poimandres-storm.json",
	"poimandres-white.json",
];

const sourceThemeMap: Record<string, string> = {
	"poimandres.json": "poimandres-color-theme.json",
	"poimandres-storm.json": "poimandres-color-theme-storm.json",
	"poimandres-white.json": "poimandres-color-theme-white.json",
};

const testCases = themeFiles.map((file) => ({
	file,
	sourceFile: sourceThemeMap[file],
}));

async function loadSchema(): Promise<Record<string, unknown>> {
	if (!existsSync(schemaPath)) {
		const response = await fetch(schemaUrl);
		expect(response.ok).toBe(true);
		const schema = await response.text();
		mkdirSync(dirname(schemaPath), { recursive: true });
		writeFileSync(schemaPath, schema);
	}

	return JSON.parse(readFileSync(schemaPath, "utf8")) as Record<string, unknown>;
}

function loadTheme(file: string, dir: string = themeDir): PiTheme {
	return JSON.parse(readFileSync(join(dir, file), "utf8")) as PiTheme;
}

function loadVsCodeTheme(file: string, dir: string): VsCodeTheme {
	return JSON.parse(readFileSync(join(dir, file), "utf8")) as VsCodeTheme;
}

function getUpstreamColorValues(source: VsCodeTheme): Set<string> {
	const rawValues = [
		...Object.values(source.colors ?? {}),
		...(source.tokenColors ?? [])
			.map((entry) => entry?.settings?.foreground)
			.filter((value): value is string => typeof value === "string" && value.length > 0),
	];
	// Also accept the alpha-stripped 6-digit form of any 8-digit upstream colour,
	// since normalisePalette strips alpha before writing vars.
	const normalisedVariants = rawValues
		.filter((v) => /^#[0-9a-fA-F]{8}$/.test(v))
		.map((v) => v.slice(0, 7));

	return new Set([...rawValues, ...normalisedVariants]);
}

describe("Pi theme schema and mapping validation", () => {
	let validate!: ValidateFunction;

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
		const source = loadVsCodeTheme(sourceFile, sourceThemeDir);
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

describe("White palette extraction", () => {
	const sourceWhiteJson = JSON.parse(readFileSync(whiteSourcePath, "utf8")) as VsCodeTheme;

	test("each palette key maps to the correct upstream white JSON token value", () => {
		const palette = extractWhitePalette(whiteSourcePath);
		for (const [key, token] of Object.entries(CANONICAL_MAPPING)) {
			expect(palette[key], `palette key "${key}" should equal colors["${token}"]`).toBe(
				sourceWhiteJson.colors?.[token],
			);
		}
	});

	test("blueishGreen maps to source.sass keyword.control token foreground", () => {
		const palette = extractWhitePalette(whiteSourcePath);
		const entry = (sourceWhiteJson.tokenColors ?? []).find((e) => {
			const s = e.scope;
			return (Array.isArray(s) ? s : [s]).includes("source.sass keyword.control");
		});
		expect(palette.blueishGreen).toBe(entry?.settings?.foreground);
	});

	test("bluishGray resolves to #506477 (upstream inputValidation.infoBackground)", () => {
		const palette = extractWhitePalette(whiteSourcePath);
		expect(palette.bluishGray).toBe("#506477");
	});

	test("selection resolves to #717cb425 (upstream editor.selectionBackground)", () => {
		const palette = extractWhitePalette(whiteSourcePath);
		expect(palette.selection).toBe("#717cb425");
	});
});

describe("normaliseHex", () => {
	test("passes a valid 6-digit hex unchanged", () => {
		expect(normaliseHex("#5DE4c7")).toBe("#5DE4c7");
		expect(normaliseHex("#ffffff")).toBe("#ffffff");
		expect(normaliseHex("#000000")).toBe("#000000");
	});

	test("strips alpha from an 8-digit hex", () => {
		expect(normaliseHex("#717cb425")).toBe("#717cb4");
		expect(normaliseHex("#818cc425")).toBe("#818cc4");
		expect(normaliseHex("#00000000")).toBe("#000000");
	});

	test("throws for a missing # prefix", () => {
		expect(() => normaliseHex("5DE4c7")).toThrow("invalid hex colour");
	});

	test("throws for a 3-digit shorthand", () => {
		expect(() => normaliseHex("#fff")).toThrow("invalid hex colour");
	});

	test("throws for non-hex characters", () => {
		expect(() => normaliseHex("#GGGGGG")).toThrow("invalid hex colour");
	});

	test("throws for an arbitrary string", () => {
		expect(() => normaliseHex("transparent")).toThrow("invalid hex colour");
	});
});

describe("normalisePalette", () => {
	test("normalises all values in a palette record", () => {
		const result = normalisePalette({
			selection: "#717cb425",
			bg: "#1b1e28",
			transparent: "#00000000",
		});
		expect(result).toEqual({
			selection: "#717cb4",
			bg: "#1b1e28",
			transparent: "#000000",
		});
	});

	test("throws and identifies the offending key", () => {
		expect(() =>
			normalisePalette({ good: "#1b1e28", bad: "not-a-colour" }),
		).toThrow('invalid value for key "bad"');
	});
});

describe("Generated theme vars hex validity", () => {
	const SIX_DIGIT_HEX = /^#[0-9a-fA-F]{6}$/;

	test.each(themeFiles)("all vars in %s are 6-digit hex (no alpha channel)", (file) => {
		const theme = loadTheme(file);
		for (const [key, value] of Object.entries(theme.vars)) {
			expect(
				SIX_DIGIT_HEX.test(value),
				`${file}: vars.${key} = "${value}" is not a 6-digit hex colour`,
			).toBe(true);
		}
	});
});

describe("Cross-variant palette consistency", () => {
	// Only these two palette keys are identical between the upstream dark and white
	// themes. All other "accent" colours (hotRed, lightBlue, brightMint, …) differ
	// intentionally — the white theme is a distinct light-mode palette.
	const SHARED_ACCENT_KEYS = ["transparent", "blueishGreen"];

	test("shared accent keys are equal between poimandres.json and poimandres-white.json", () => {
		const dark = loadTheme("poimandres.json");
		const white = loadTheme("poimandres-white.json");
		for (const key of SHARED_ACCENT_KEYS) {
			expect(
				white.vars[key],
				`accent key "${key}" differs between poimandres and poimandres-white`,
			).toBe(dark.vars[key]);
		}
	});
});
