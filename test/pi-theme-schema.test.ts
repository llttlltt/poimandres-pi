import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { extractWhitePalette } from "../src/extract-white-palette.js";
import { HEX_ALPHA_REGEX, HEX_REGEX, normaliseHex, normalisePalette } from "../src/hex-utils.js";
import { whiteSourcePath, type VsCodeTheme } from "./theme-test-helpers.js";

describe("White palette extraction", () => {
	const sourceWhiteJson = JSON.parse(readFileSync(whiteSourcePath, "utf8")) as VsCodeTheme;

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
			return (Array.isArray(s) ? s : [s]).includes("source.sass keyword.control");
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
		expect(() => normalisePalette({ good: "#1b1e28", bad: "not-a-colour" })).toThrow('invalid value for key "bad"');
	});
});
