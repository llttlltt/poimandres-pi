import { mkdirSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import { base as BASE_THEME, storm as STORM_THEME } from "../drcmda/poimandres-theme/src/theme.js";
import { extractWhitePalette } from "./extract-white-palette.js";
import { normalisePalette } from "./hex-utils.js";

interface PoimandresTheme {
	colors: Record<string, string>;
}

interface BuildThemeInput {
	name: string;
	palette: Record<string, string>;
}

interface PiThemeOutput {
	$schema: string;
	name: string;
	vars: Record<string, string>;
	colors: Record<string, string>;
	export: Record<string, string>;
}

function paletteFromTheme(theme: unknown): Record<string, string> {
	if (
		!theme ||
		typeof theme !== "object" ||
		!("colors" in theme) ||
		typeof (theme as PoimandresTheme).colors !== "object"
	) {
		throw new Error("Expected upstream theme to expose a colors palette");
	}
	return (theme as PoimandresTheme).colors;
}

const baseColors = paletteFromTheme(BASE_THEME);
const stormColors = paletteFromTheme(STORM_THEME);
const whiteColors = extractWhitePalette(
	resolve(process.cwd(), "drcmda/poimandres-theme/themes/poimandres-color-theme-white.json"),
);

function buildTheme({ name, palette: rawPalette }: BuildThemeInput): PiThemeOutput {
	const palette = normalisePalette(rawPalette);
	const vars = {
		brightYellow: palette.brightYellow,
		brightMint: palette.brightMint,
		lowerMint: palette.lowerMint,
		blueishGreen: palette.blueishGreen,

		lowerBlue: palette.lowerBlue,
		lightBlue: palette.lightBlue,
		desaturatedBlue: palette.desaturatedBlue,
		bluishGrayBrighter: palette.bluishGrayBrighter,

		hotRed: palette.hotRed,
		pink: palette.pink,
		gray: palette.gray,

		darkerGray: palette.darkerGray,
		bluishGray: palette.bluishGray,
		focus: palette.focus,
		bg: palette.bg,

		offWhite: palette.offWhite,
		selection: palette.selection,

		white: palette.white,
		black: palette.black,
		transparent: palette.transparent,
	} as const;

	const colors: Record<string, keyof typeof vars | ""> = {
		accent: "brightMint",
		success: "brightMint",
		error: "pink",
		warning: "brightYellow",
		muted: "offWhite",
		dim: "gray",
		text: "",

		border: "focus",
		borderAccent: "brightMint",
		borderMuted: "offWhite",

		selectedBg: "selection",

		userMessageBg: "blueishGreen",
		userMessageText: "white",

		customMessageBg: "bluishGray",
		customMessageText: "lowerBlue",
		customMessageLabel: "white",

		toolPendingBg: "bg",
		toolSuccessBg: "focus",
		toolErrorBg: "hotRed",
		toolTitle: "white",
		toolOutput: "offWhite",

		mdHeading: "white",
		mdLink: "brightMint",
		mdLinkUrl: "transparent",
		mdCode: "white",
		mdCodeBlock: "offWhite",
		mdCodeBlockBorder: "darkerGray",
		mdQuote: "transparent",
		mdQuoteBorder: "transparent",
		mdHr: "focus",
		mdListBullet: "darkerGray",

		toolDiffAdded: "lowerMint",
		toolDiffRemoved: "hotRed",
		toolDiffContext: "offWhite",

		syntaxComment: "darkerGray",
		syntaxKeyword: "desaturatedBlue",
		syntaxFunction: "lightBlue",
		syntaxVariable: "white",
		syntaxString: "brightMint",
		syntaxNumber: "brightMint",
		syntaxType: "white",
		syntaxOperator: "transparent",
		syntaxPunctuation: "darkerGray",

		thinkingText: "gray",
		thinkingOff: "focus",
		thinkingMinimal: "bluishGrayBrighter",
		thinkingLow: "lowerBlue",
		thinkingMedium: "brightMint",
		thinkingHigh: "brightYellow",
		thinkingXhigh: "hotRed",

		bashMode: "brightMint",
	};

	const exportColors: Record<string, string> = {
		pageBg: "bg",
		cardBg: "bg",
		infoBg: "focus",
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

const themes: Array<{ file: string; data: PiThemeOutput }> = [
	{
		// The upstream noitalics theme is color-identical to white; only the source theme name differs.
		file: "poimandres.json",
		data: buildTheme({
			name: "poimandres",
			palette: baseColors,
		}),
	},
	{
		// The upstream storm-noitalics theme is color-identical to white; only the source theme name differs.
		file: "poimandres-storm.json",
		data: buildTheme({
			name: "poimandres storm",
			palette: stormColors,
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
	writeFileSync(filePath, `${JSON.stringify(theme.data, null, "\t")}\n`);
	console.log(`wrote ${filePath}`);
}
