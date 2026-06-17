import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
	base as BASE_THEME,
	storm as STORM_THEME,
} from "../poimandres-theme/src/theme.js";
import { extractWhitePalette } from "./palette-extractor.js";
import { buildTheme, type PiThemeOutput } from "./theme-builder.js";

const outputDir = resolve(process.cwd(), "themes/pi");
mkdirSync(outputDir, { recursive: true });

const themes: Array<{ file: string; data: PiThemeOutput }> = [
	{
		file: "poimandres.json",
		data: buildTheme({ name: "poimandres", palette: BASE_THEME.colors }),
	},
	{
		file: "poimandres-storm.json",
		data: buildTheme({ name: "poimandres storm", palette: STORM_THEME.colors }),
	},
	{
		file: "poimandres-white.json",
		data: buildTheme({
			name: "poimandres white",
			palette: extractWhitePalette(
				resolve(
					process.cwd(),
					"poimandres-theme/themes/poimandres-color-theme-white.json",
				),
			),
		}),
	},
];

for (const theme of themes) {
	const filePath = join(outputDir, theme.file);
	writeFileSync(filePath, `${JSON.stringify(theme.data, null, "\t")}\n`);
	console.log(`wrote ${filePath}`);
}
