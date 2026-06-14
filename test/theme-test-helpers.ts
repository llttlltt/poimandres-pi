import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { HEX_ALPHA_REGEX } from "../src/hex-utils";

export interface PiTheme {
	$schema: string;
	name: string;
	vars: Record<string, string>;
	colors: Record<string, string>;
	export: Record<string, string>;
}

export interface VsCodeTheme {
	colors?: Record<string, string>;
	tokenColors?: Array<{
		scope?: string | string[];
		settings?: { foreground?: string };
	}>;
}

export const schemaUrl =
	"https://raw.githubusercontent.com/earendil-works/pi/main/packages/coding-agent/src/modes/interactive/theme/theme-schema.json";
export const schemaPath = resolve(".cache/pi-theme-schema.json");
export const themeDir = resolve("themes/pi");
export const sourceThemeDir = resolve("drcmda/poimandres-theme/themes");
export const whiteSourcePath = resolve("drcmda/poimandres-theme/themes/poimandres-color-theme-white.json");

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
		const response = await fetch(schemaUrl);
		if (!response.ok) {
			throw new Error(`Failed to fetch schema from ${schemaUrl}`);
		}
		const schema = await response.text();
		mkdirSync(dirname(schemaPath), { recursive: true });
		writeFileSync(schemaPath, schema);
	}

	return JSON.parse(readFileSync(schemaPath, "utf8")) as Record<string, unknown>;
}

export function loadTheme(file: string, dir: string = themeDir): PiTheme {
	return JSON.parse(readFileSync(join(dir, file), "utf8")) as PiTheme;
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
