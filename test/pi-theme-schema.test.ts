import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { CANONICAL_MAPPING, extractWhitePalette } from "../src/extract-white-palette.js";
import { normaliseHex, normalisePalette } from "../src/hex-utils.js";
import { whiteSourcePath, type VsCodeTheme } from "./theme-test-helpers.js";

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
		expect(() => normalisePalette({ good: "#1b1e28", bad: "not-a-colour" })).toThrow('invalid value for key "bad"');
	});
});
