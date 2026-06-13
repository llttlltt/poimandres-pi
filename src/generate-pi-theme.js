import { mkdirSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import { extractWhitePalette } from "./extract-white-palette.js";
import {
	base as BASE_THEME,
	noitalics as NOITALICS_THEME,
	stormNoitalics as STORM_NOITALICS_THEME,
	storm as STORM_THEME,
} from "../drcmda/poimandres-theme/src/theme.js";

function paletteFromTheme(theme) {
	if (!theme || !theme.colors) {
		throw new Error("Expected upstream theme to expose a colors palette");
	}

	return theme.colors;
}

const baseColors = paletteFromTheme(BASE_THEME);
const noitalicsColors = paletteFromTheme(NOITALICS_THEME);
const stormColors = paletteFromTheme(STORM_THEME);
const stormNoitalicsColors = paletteFromTheme(STORM_NOITALICS_THEME);
const whiteColors = extractWhitePalette(
	resolve(process.cwd(), "drcmda/poimandres-theme/themes/poimandres-color-theme-white.json"),
);

function buildTheme({ name, palette }) {
	const vars = {
		bg: palette.bg,
		focus: palette.focus,
		gray: palette.gray,
		offWhite: palette.offWhite,
		lightBlue: palette.lightBlue,
		brightMint: palette.brightMint,
		hotRed: palette.hotRed,
		lowerMint: palette.lowerMint,
		lowerBlue: palette.lowerBlue,
		desaturatedBlue: palette.desaturatedBlue,
		bluishGray: palette.bluishGray,
		bluishGrayBrighter: palette.bluishGrayBrighter,
		darkerGray: palette.darkerGray,
		brightYellow: palette.brightYellow,
		pink: palette.pink,
		blueishGreen: palette.blueishGreen,
		transparent: palette.transparent,
		selection: palette.selection,
	};

	const colors = {
		accent: "lightBlue",
		border: "bluishGray",
		borderAccent: "lightBlue",
		borderMuted: "bluishGray",
		success: "brightMint",
		error: "hotRed",
		warning: "brightYellow",
		muted: "gray",
		dim: "darkerGray",
		text: "",
		thinkingText: "gray",

		selectedBg: "selection",
		userMessageBg: "focus",
		userMessageText: "",
		customMessageBg: "bg",
		customMessageText: "",
		customMessageLabel: "lightBlue",
		toolPendingBg: "focus",
		toolSuccessBg: "lowerMint",
		toolErrorBg: "hotRed",
		toolTitle: "",
		toolOutput: "gray",

		mdHeading: "offWhite",
		mdLink: "lightBlue",
		mdLinkUrl: "desaturatedBlue",
		mdCode: "brightMint",
		mdCodeBlock: "offWhite",
		mdCodeBlockBorder: "bluishGray",
		mdQuote: "bluishGrayBrighter",
		mdQuoteBorder: "lowerBlue",
		mdHr: "darkerGray",
		mdListBullet: "lightBlue",

		toolDiffAdded: "lowerMint",
		toolDiffRemoved: "hotRed",
		toolDiffContext: "gray",

		syntaxComment: "darkerGray",
		syntaxKeyword: "brightMint",
		syntaxFunction: "lightBlue",
		syntaxVariable: "offWhite",
		syntaxString: "brightMint",
		syntaxNumber: "lowerBlue",
		syntaxType: "desaturatedBlue",
		syntaxOperator: "gray",
		syntaxPunctuation: "gray",

		thinkingOff: "darkerGray",
		thinkingMinimal: "bluishGray",
		thinkingLow: "lowerBlue",
		thinkingMedium: "lightBlue",
		thinkingHigh: "brightMint",
		thinkingXhigh: "hotRed",

		bashMode: "brightMint",
	};

	const exportColors = {
		pageBg: "bg",
		cardBg: "focus",
		infoBg: "bluishGray",
	};

	return {
		$schema:
			"https://raw.githubusercontent.com/earendil-works/pi/main/packages/coding-agent/src/modes/interactive/theme/theme-schema.json",
		name,
		vars,
		colors,
		export: exportColors,
	};
}

const outputDir = resolve(process.cwd(), "themes/pi");
mkdirSync(outputDir, { recursive: true });

const themes = [
	{
		file: "poimandres.json",
		data: buildTheme({
			name: "poimandres",
			palette: baseColors,
		}),
	},
	{
		file: "poimandres-noitalics.json",
		data: buildTheme({
			name: "poimandres noitalics",
			palette: noitalicsColors,
		}),
	},
	{
		file: "poimandres-storm.json",
		data: buildTheme({
			name: "poimandres storm",
			palette: stormColors,
		}),
	},
	{
		file: "poimandres-noitalics-storm.json",
		data: buildTheme({
			name: "poimandres storm noitalics",
			palette: stormNoitalicsColors,
		}),
	},
	{
		// The upstream white-noitalics theme is color-identical to white; only the source theme name differs.
		file: "poimandres-white.json",
		data: buildTheme({
			name: "poimandres white",
			palette: whiteColors,
		}),
	},
];

for (const theme of themes) {
	const filePath = join(outputDir, theme.file);
	writeFileSync(filePath, `${JSON.stringify(theme.data, null, 2)}\n`);
	console.log(`wrote ${filePath}`);
}
