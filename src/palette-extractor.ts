import { readFileSync } from "node:fs";
import { type Palette, type PaletteKey } from "./palette.js";

type PaletteWithoutBlueishGreen = Exclude<PaletteKey, "blueishGreen">;

const BLUEISH_GREEN_SCOPE = "source.sass keyword.control";
const COLOR_REFERENCE_REGEX = /^\$\{colors\.([A-Za-z0-9]+)\}$/;

export type VsCodeTheme = {
	colors?: Record<string, string>;
	tokenColors?: Array<{
		scope?: string | string[];
		settings?: { foreground?: string };
	}>;
};

const SOURCE_TOKEN_BY_KEY: Record<PaletteWithoutBlueishGreen, string> = {
	bg: "editor.background",
	focus: "activityBarBadge.background",
	gray: "editor.foreground",
	darkerGray: "editorLineNumber.foreground",
	bluishGray: "inputValidation.infoBackground",
	bluishGrayBrighter: "debugIcon.breakpointDisabledForeground",
	offWhite: "activityBarBadge.foreground",
	selection: "editor.selectionBackground",
	black: "button.foreground",
	white: "terminal.ansiBrightWhite",
	lightBlue: "terminal.ansiBrightBlue",
	lowerBlue: "terminal.ansiBlue",
	desaturatedBlue: "terminal.ansiCyan",
	brightMint: "terminal.ansiBrightGreen",
	lowerMint: "notebookStatusSuccessIcon.foreground",
	hotRed: "terminal.ansiBrightRed",
	pink: "terminal.ansiBrightMagenta",
	brightYellow: "terminal.ansiBrightYellow",
	transparent: "focusBorder",
};

function resolveTokenReference(source: VsCodeTheme, reference: string, key: string): string {
	const match = reference.match(COLOR_REFERENCE_REGEX);
	if (match) {
		const resolved = source.colors?.[match[1]];
		if (resolved === undefined) {
			throw new Error(
				`extractWhitePalette: palette key "${key}" could not be resolved — referenced color "${match[1]}" was not found in the upstream white JSON colors.`,
			);
		}
		return resolved;
	}
	return reference;
}

function extractTokenColor(source: VsCodeTheme, token: string, key: string): string {
	const value = source.colors?.[token];
	if (value === undefined) {
		throw new Error(
			`extractWhitePalette: palette key "${key}" could not be resolved — expected token "${token}" was not found in the upstream white JSON colors.`,
		);
	}
	return resolveTokenReference(source, value, key);
}

function extractTokenColorFromScope(source: VsCodeTheme, scopeQuery: string, key: string): string {
	const tokenEntry = (source.tokenColors ?? []).find((entry) => {
		const scope = entry.scope;
		return (Array.isArray(scope) ? scope : [scope]).includes(scopeQuery);
	});
	const foreground = tokenEntry?.settings?.foreground;
	if (foreground === undefined) {
		throw new Error(
			`extractWhitePalette: palette key "${key}" could not be resolved — no tokenColors entry with scope "${scopeQuery}" found in the upstream white JSON.`,
		);
	}
	return resolveTokenReference(source, foreground, key);
}

export function extractWhitePalette(whiteJsonPath: string): Palette {
	const source = JSON.parse(readFileSync(whiteJsonPath, "utf8")) as VsCodeTheme;
	const palette = {} as Palette;

	for (const key of Object.keys(SOURCE_TOKEN_BY_KEY) as Array<Exclude<PaletteKey, "blueishGreen">>) {
		palette[key] = extractTokenColor(source, SOURCE_TOKEN_BY_KEY[key], key);
	}

	palette.blueishGreen = extractTokenColorFromScope(source, BLUEISH_GREEN_SCOPE, "blueishGreen");

	return palette;
}
