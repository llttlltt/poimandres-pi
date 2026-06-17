import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import {
	HEX_ALPHA_REGEX,
	HEX_REGEX,
	normaliseHex,
	normalisePalette,
} from "../src/hex.js";
import type { Palette } from "../src/palette.js";
import { extractWhitePalette } from "../src/palette-extractor.js";
import { type BuildThemeInput, buildTheme } from "../src/theme-builder.js";
import { type VsCodeTheme, whiteSourcePath } from "./theme-test-helpers.js";

describe("White palette extraction", () => {
	const sourceWhiteJson = JSON.parse(
		readFileSync(whiteSourcePath, "utf8"),
	) as VsCodeTheme;

	test("extractWhitePalette follows the same palette shape as the source theme", () => {
		const palette = extractWhitePalette(whiteSourcePath);
		expect(Object.keys(palette).sort()).toEqual(
			[
				"bg",
				"black",
				"bluishGray",
				"bluishGrayBrighter",
				"blueishGreen",
				"brightMint",
				"brightYellow",
				"darkerGray",
				"desaturatedBlue",
				"focus",
				"gray",
				"hotRed",
				"lightBlue",
				"lowerBlue",
				"lowerMint",
				"offWhite",
				"pink",
				"selection",
				"transparent",
				"white",
			].sort(),
		);
	});

	test("blueishGreen maps through the upstream tokenColors scope", () => {
		const palette = extractWhitePalette(whiteSourcePath);
		const entry = (sourceWhiteJson.tokenColors ?? []).find((e) => {
			const s = e.scope;
			return (Array.isArray(s) ? s : [s]).includes(
				"source.sass keyword.control",
			);
		});
		expect(entry?.settings?.foreground).toBeDefined();
		expect(palette.blueishGreen).toBe(entry?.settings?.foreground);
	});

	test("the extractor returns palette values without changing source hex shape assumptions", () => {
		const palette = extractWhitePalette(whiteSourcePath);
		expect(palette.bluishGray).toMatch(HEX_REGEX);
		expect(palette.selection).toMatch(HEX_ALPHA_REGEX);
	});
});

describe("normaliseHex", () => {
	test("passes a valid 6-digit hex unchanged", () => {
		expect(normaliseHex("#5DE4c7")).toBe("#5DE4c7");
		expect(normaliseHex("#ffffff")).toBe("#ffffff");
		expect(normaliseHex("#000000")).toBe("#000000");
		expect(HEX_REGEX.test("#ffffff")).toBe(true);
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
		expect(HEX_REGEX.test("#00000000")).toBe(false);
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

describe("buildTheme", () => {
	const FIXTURE_PALETTE: Palette = {
		bg: "#1b1e28",
		focus: "#303340",
		gray: "#a6accd",
		darkerGray: "#767c9d",
		bluishGray: "#506477",
		bluishGrayBrighter: "#7390aa",
		offWhite: "#e4f0fb",
		selection: "#717cb425",
		black: "#000000",
		white: "#ffffff",
		lightBlue: "#add7ff",
		lowerBlue: "#89ddff",
		desaturatedBlue: "#91b4d5",
		brightMint: "#5de4c7",
		lowerMint: "#5fb3a1",
		hotRed: "#d0679d",
		pink: "#f087bd",
		brightYellow: "#fffac2",
		transparent: "#00000000",
		blueishGreen: "#42675a",
	};

	const INPUT: BuildThemeInput = { name: "fixture", palette: FIXTURE_PALETTE };

	test("returns a PiThemeOutput with the given name and a https schema URL", () => {
		const result = buildTheme(INPUT);
		expect(result.name).toBe("fixture");
		expect(result.$schema).toMatch(/^https:\/\//u);
	});

	test("all vars are normalised to 6-digit hex", () => {
		const result = buildTheme(INPUT);
		for (const [key, value] of Object.entries(result.vars)) {
			expect(
				HEX_REGEX.test(value),
				`vars.${key} = "${value}" should be 6-digit hex`,
			).toBe(true);
		}
	});

	test("all non-empty, non-literal color values reference a declared var", () => {
		const result = buildTheme(INPUT);
		const vars = new Set(Object.keys(result.vars));
		for (const [key, value] of Object.entries(result.colors)) {
			if (value === "" || HEX_REGEX.test(value)) continue;
			expect(
				vars.has(value),
				`colors.${key} = "${value}" is not declared in vars`,
			).toBe(true);
		}
	});

	test("export contains pageBg, cardBg, and infoBg", () => {
		const result = buildTheme(INPUT);
		expect(result.export).toMatchObject({
			pageBg: expect.any(String),
			cardBg: expect.any(String),
			infoBg: expect.any(String),
		});
	});
});
