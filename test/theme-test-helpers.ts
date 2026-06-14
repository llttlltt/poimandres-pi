import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { HEX_ALPHA_REGEX } from "../src/hex";
import { SCHEMA_URL, type PiThemeOutput } from "../src/theme-builder.js";
import { type VsCodeTheme } from "../src/palette-extractor.js";

export type { PiThemeOutput as PiTheme };
export type { VsCodeTheme };
export const schemaPath = resolve(".cache/pi-theme-schema.json");
export const themeDir = resolve("themes/pi");
export const sourceThemeDir = resolve("poimandres-theme/themes");
export const whiteSourcePath = resolve("poimandres-theme/themes/poimandres-color-theme-white.json");

export const themeFiles = ["poimandres.json", "poimandres-storm.json", "poimandres-white.json"] as const;

export const sourceThemeMap: Record<(typeof themeFiles)[number], string> = {
	"poimandres.json": "poimandres-color-theme.json",
	"poimandres-storm.json": "poimandres-color-theme-storm.json",
	"poimandres-white.json": "poimandres-color-theme-white.json",
};

export const testCases = themeFiles.map((file) => ({
	file,
	sourceFile: sourceThemeMap[file],
}));

export async function loadSchema(): Promise<Record<string, unknown>> {
	if (!existsSync(schemaPath)) {
		const response = await fetch(SCHEMA_URL);
		if (!response.ok) {
			throw new Error(`Failed to fetch schema from ${SCHEMA_URL}`);
		}
		const schema = await response.text();
		mkdirSync(dirname(schemaPath), { recursive: true });
		writeFileSync(schemaPath, schema);
	}

	return JSON.parse(readFileSync(schemaPath, "utf8")) as Record<string, unknown>;
}

export function loadTheme(file: string, dir: string = themeDir): PiThemeOutput {
	return JSON.parse(readFileSync(join(dir, file), "utf8")) as PiThemeOutput;
}

export function loadVsCodeTheme(file: string, dir: string): VsCodeTheme {
	return JSON.parse(readFileSync(join(dir, file), "utf8")) as VsCodeTheme;
}

export function getUpstreamColorValues(source: VsCodeTheme): Set<string> {
	const rawValues = [
		...Object.values(source.colors ?? {}),
		...(source.tokenColors ?? [])
			.map((entry) => entry?.settings?.foreground)
			.filter((value): value is string => typeof value === "string" && value.length > 0),
	];
	const normalisedVariants = rawValues.filter((v) => HEX_ALPHA_REGEX.test(v)).map((v) => v.slice(0, 7));

	return new Set([...rawValues, ...normalisedVariants]);
}
