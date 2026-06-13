import { mkdirSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import {
	base as BASE_THEME,
	noitalics as NOITALICS_THEME,
	stormNoitalics as STORM_NOITALICS_THEME,
	storm as STORM_THEME,
} from "../drcmda/poimandres-theme/src/theme.js";
import { extractWhitePalette } from "./extract-white-palette.js";

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
const noitalicsColors = paletteFromTheme(NOITALICS_THEME);
const stormColors = paletteFromTheme(STORM_THEME);
const stormNoitalicsColors = paletteFromTheme(STORM_NOITALICS_THEME);
const whiteColors = extractWhitePalette(
	resolve(process.cwd(), "drcmda/poimandres-theme/themes/poimandres-color-theme-white.json"),
);

function buildTheme({ name, palette }: BuildThemeInput): PiThemeOutput {
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
		// Pi does not support RGBA hex. The upstream `selection` is semi-transparent
		// (e.g. #717cb425). `focus` is the nearest solid equivalent — the canonical
		// "active area" background in every Poimandres variant, and already present
		// in the upstream JSON (activityBarBadge.background).
		selection: palette.focus,
	} as const;

	const colors: Record<string, keyof typeof vars | ""> = {
		accent: "brightMint",
		border: "bg",
		borderAccent: "brightMint",
		borderMuted: "lowerBlue",
		success: "brightMint",
		error: "hotRed",
		warning: "brightYellow",
		muted: "offWhite",
		dim: "gray",
		text: "",
		thinkingText: "desaturatedBlue",

		selectedBg: "selection",
		userMessageBg: "focus",
		userMessageText: "",
		customMessageBg: "bg",
		customMessageText: "",
		customMessageLabel: "lightBlue",
		toolPendingBg: "focus",
		toolSuccessBg: "bluishGray",
		toolErrorBg: "hotRed",
		toolTitle: "brightMint",
		toolOutput: "offWhite",

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
		syntaxKeyword: "lowerBlue",
		syntaxFunction: "lightBlue",
		syntaxVariable: "offWhite",
		syntaxString: "brightMint",
		syntaxNumber: "lowerBlue",
		syntaxType: "desaturatedBlue",
		syntaxOperator: "gray",
		syntaxPunctuation: "gray",

		thinkingOff: "bluishGray",
		thinkingMinimal: "darkerGray",
		thinkingLow: "lightBlue",
		thinkingMedium: "lowerBlue",
		thinkingHigh: "brightMint",
		thinkingXhigh: "hotRed",

		bashMode: "brightMint",
	};

	const exportColors: Record<string, string> = {
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
	writeFileSync(filePath, `${JSON.stringify(theme.data, null, 2)}\n`);
	console.log(`wrote ${filePath}`);
}
