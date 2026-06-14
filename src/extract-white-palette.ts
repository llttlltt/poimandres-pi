import { readFileSync } from "node:fs";
import { type Palette, type PaletteKey, type PaletteWithoutBlueishGreen } from "./types.js";

const BLUEISH_GREEN_SCOPE = "source.sass keyword.control";
const COLOR_REFERENCE_REGEX = /^\$\{colors\.([A-Za-z0-9]+)\}$/;

type UpstreamTheme = {
	colors?: Record<string, string>;
	tokenColors?: Array<{
		scope?: string | string[];
		settings?: { foreground?: string };
	}>;
};

export const SOURCE_TOKEN_BY_KEY: Record<PaletteWithoutBlueishGreen, string> = {
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

function resolveSourceToken(key: Exclude<PaletteKey, "blueishGreen">): string {
	return SOURCE_TOKEN_BY_KEY[key];
}

function resolveTokenReference(source: UpstreamTheme, reference: string, key: string): string {
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

function extractTokenColor(source: UpstreamTheme, token: string, key: string): string {
	const value = source.colors?.[token];
	if (value === undefined) {
		throw new Error(
			`extractWhitePalette: palette key "${key}" could not be resolved — expected token "${token}" was not found in the upstream white JSON colors.`,
		);
	}
	return resolveTokenReference(source, value, key);
}

function extractTokenColorFromScope(source: UpstreamTheme, scopeQuery: string, key: string): string {
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
	const source = JSON.parse(readFileSync(whiteJsonPath, "utf8")) as UpstreamTheme;
	const palette = {} as Palette;

	for (const key of Object.keys(SOURCE_TOKEN_BY_KEY) as Array<Exclude<PaletteKey, "blueishGreen">>) {
		palette[key] = extractTokenColor(source, resolveSourceToken(key), key);
	}

	palette.blueishGreen = extractTokenColorFromScope(source, BLUEISH_GREEN_SCOPE, "blueishGreen");

	return palette;
}
