export const PALETTE_KEYS = [
	"bg",
	"focus",
	"gray",
	"darkerGray",
	"bluishGray",
	"bluishGrayBrighter",
	"offWhite",
	"selection",
	"black",
	"white",
	"lightBlue",
	"lowerBlue",
	"desaturatedBlue",
	"brightMint",
	"lowerMint",
	"hotRed",
	"pink",
	"brightYellow",
	"transparent",
	"blueishGreen",
] as const;

export type PaletteKey = (typeof PALETTE_KEYS)[number];
export type Palette = Record<PaletteKey, string>;
