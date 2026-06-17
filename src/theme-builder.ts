import { normalisePalette } from "./hex.js";
import type { Palette } from "./palette.js";

export const SCHEMA_URL =
	"https://raw.githubusercontent.com/earendil-works/pi/main/packages/coding-agent/src/modes/interactive/theme/theme-schema.json";

export interface PiThemeOutput {
	$schema: string;
	name: string;
	vars: Record<string, string>;
	colors: Record<string, string>;
	export: Record<string, string>;
}

export interface BuildThemeInput {
	name: string;
	palette: Palette;
}

export function buildTheme({
	name,
	palette: rawPalette,
}: BuildThemeInput): PiThemeOutput {
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

	const colors: Record<string, keyof typeof vars | "" | `#${string}`> = {
		accent: "brightMint",
		success: "blueishGreen",
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
		userMessageText: "offWhite",

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
		mdLinkUrl: "brightMint",
		mdCode: "white",
		mdCodeBlock: "offWhite",
		mdCodeBlockBorder: "darkerGray",
		mdQuote: "desaturatedBlue",
		mdQuoteBorder: "bluishGray",
		mdHr: "darkerGray",
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
		syntaxOperator: "#ff0000",
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
		$schema: SCHEMA_URL,
		name,
		vars,
		colors,
		export: exportColors,
	};
}
