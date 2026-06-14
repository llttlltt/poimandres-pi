import Ajv, { ValidateFunction } from "ajv";
import { beforeAll, describe, expect, test } from "vitest";
import { HEX_REGEX } from "../src/hex.js";
import {
	getUpstreamColorValues,
	loadSchema,
	loadTheme,
	loadVsCodeTheme,
	sourceThemeDir,
	testCases,
	themeFiles,
} from "./theme-test-helpers.js";

describe("Generated theme schema and mapping validation", () => {
	let validate!: ValidateFunction;

	beforeAll(async () => {
		const schema = await loadSchema();
		const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
		validate = ajv.compile(schema);
	});

	test.each(testCases)("$file validates against schema", ({ file }) => {
		const data = loadTheme(file);
		const valid = validate(data);
		expect(valid, JSON.stringify(validate.errors, null, 2)).toBe(true);
		expect(data).not.toHaveProperty("export", {});
	});

	test.each(testCases)("$file uses declared vars for non-empty refs", ({ file }) => {
		const theme = loadTheme(file);
		const vars = new Set(Object.keys(theme.vars));

		for (const [key, value] of Object.entries(theme.colors)) {
			if (value === "") continue;
			if (HEX_REGEX.test(value)) continue;
			expect(vars.has(value), `${file}: ${key} -> ${value} is not declared in vars`).toBe(true);
		}
	});

	test.each(testCases)("$file resolves only to upstream source colors or token foregrounds", ({ file, sourceFile }) => {
		const generated = loadTheme(file);
		const source = loadVsCodeTheme(sourceFile, sourceThemeDir);
		const allowedValues = getUpstreamColorValues(source);
		const generatedVarValues = new Set(Object.values(generated.vars));

		for (const [key, value] of Object.entries(generated.colors)) {
			if (value === "") continue;
			if (HEX_REGEX.test(value)) continue;
			expect(generatedVarValues.has(generated.vars[value]), `${file}: ${key} points at missing var ${value}`).toBe(
				true,
			);
			expect(
				allowedValues.has(generated.vars[value]),
				`${file}: ${key} -> ${value} resolves to ${generated.vars[value]}, which is not present in upstream source theme colors or tokenColors.foreground`,
			).toBe(true);
		}
	});

	test.each(themeFiles)("all vars in %s are 6-digit hex (no alpha channel)", (file) => {
		const theme = loadTheme(file);
		for (const [key, value] of Object.entries(theme.vars)) {
			expect(HEX_REGEX.test(value), `${file}: vars.${key} = "${value}" is not a 6-digit hex colour`).toBe(true);
		}
	});
});
