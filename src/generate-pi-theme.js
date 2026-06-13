const fs = require("fs");
const path = require("path");

const source = require("../drcmda/poimandres-theme/src/theme.js");

const base = source.base?.colors ? source.base.colors : source.base;
const noitalics = source.noitalics?.colors ? source.noitalics.colors : source.noitalics;
const storm = source.storm?.colors ? source.storm.colors : source.storm;
const stormNoitalics = source.stormNoitalics?.colors ? source.stormNoitalics.colors : source.stormNoitalics;

const white = {
	...base,
	bg: "#FEFEFF",
	focus: "#c0d0df",
	gray: "#969cbd",
	darkerGray: "#969cbd",
	bluishGray: "#969cbd",
	bluishGrayBrighter: "#7390AA",
	offWhite: "#3b3e48",
	selection: "#969cbd",
	black: "#000000",
	white: "#000000",
	lightBlue: "#0EBFFF",
	lowerBlue: "#8ABACD",
	desaturatedBlue: "#8ABACD",
	brightMint: "#01DAB2",
	lowerMint: "#62AA9B",
	hotRed: "#ff2090",
	pink: "#EB8394",
	brightYellow: "#FFD467",
	transparent: "#00000000",
};

// The upstream white-noitalics theme is color-identical to white; only the source theme name differs.
const whiteNoitalics = {
	...white,
};

function buildTheme({ name, palette, exportColors = {} }) {
	return {
		$schema:
			"https://raw.githubusercontent.com/earendil-works/pi/main/packages/coding-agent/src/modes/interactive/theme/theme-schema.json",
		name,
		vars: {
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
		},
		colors: {
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
		},
		export: {
			pageBg: "bg",
			cardBg: "focus",
			infoBg: "bluishGray",
		},
	};
}

const outputDir = path.resolve(__dirname, "../themes/pi");
fs.mkdirSync(outputDir, { recursive: true });

const themes = [
	{
		file: "poimandres.json",
		data: buildTheme({
			name: "poimandres",
			palette: base,
		}),
	},
	{
		file: "poimandres-noitalics.json",
		data: buildTheme({
			name: "poimandres noitalics",
			palette: noitalics,
		}),
	},
	{
		file: "poimandres-storm.json",
		data: buildTheme({
			name: "poimandres storm",
			palette: storm,
		}),
	},
	{
		file: "poimandres-noitalics-storm.json",
		data: buildTheme({
			name: "poimandres storm noitalics",
			palette: stormNoitalics,
		}),
	},
	{
		file: "poimandres-white.json",
		data: buildTheme({
			name: "poimandres white",
			palette: white,
		}),
	},
];

for (const theme of themes) {
	const filePath = path.join(outputDir, theme.file);
	fs.writeFileSync(filePath, `${JSON.stringify(theme.data, null, 2)}\n`);
	console.log(`wrote ${filePath}`);
}
