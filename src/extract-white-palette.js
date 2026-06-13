import { readFileSync } from "fs";

/**
 * Canonical mapping from palette key → VS Code `colors` token in the upstream white JSON.
 * Derived from drcmda/poimandres-theme/src/theme.js template.
 */
export const CANONICAL_MAPPING = {
	bg: "terminal.ansiBlack",
	focus: "activityBarBadge.background",
	gray: "terminal.ansiBrightBlack",
	darkerGray: "sideBar.foreground",
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

const BLUEISH_GREEN_SCOPE = "source.sass keyword.control";

/**
 * Extract the 21-key white palette from the upstream white JSON file.
 *
 * @param {string} whiteJsonPath - Absolute path to poimandres-color-theme-white.json
 * @returns {Record<string, string>} Palette object with 21 keys
 */
export function extractWhitePalette(whiteJsonPath) {
	const source = JSON.parse(readFileSync(whiteJsonPath, "utf8"));
	const palette = {};

	// Extract the 20 direct `colors` token mappings
	for (const [key, token] of Object.entries(CANONICAL_MAPPING)) {
		const value = source.colors?.[token];
		if (value === undefined) {
			throw new Error(
				`extractWhitePalette: palette key "${key}" could not be resolved — ` +
					`expected token "${token}" was not found in the upstream white JSON colors.`,
			);
		}
		palette[key] = value;
	}

	// Extract blueishGreen from tokenColors by scope
	const tokenEntry = (source.tokenColors ?? []).find((entry) => {
		const scope = entry.scope;
		return (Array.isArray(scope) ? scope : [scope]).includes(BLUEISH_GREEN_SCOPE);
	});
	const blueishGreen = tokenEntry?.settings?.foreground;
	if (blueishGreen === undefined) {
		throw new Error(
			`extractWhitePalette: palette key "blueishGreen" could not be resolved — ` +
				`no tokenColors entry with scope "${BLUEISH_GREEN_SCOPE}" found in the upstream white JSON.`,
		);
	}
	palette.blueishGreen = blueishGreen;

	return palette;
}
