export const HEX_REGEX = /^#[0-9a-fA-F]{6}$/;
export const HEX_ALPHA_REGEX = /^#[0-9a-fA-F]{8}$/;

/**
 * Normalises a hex colour string to 6-digit format (#RRGGBB).
 *
 * - 6-digit input (#RRGGBB)  → returned unchanged
 * - 8-digit input (#RRGGBBAA) → alpha channel stripped, #RRGGBB returned
 * - Anything else             → throws
 */
export function normaliseHex(hex: string): string {
	if (HEX_REGEX.test(hex)) {
		return hex;
	}
	if (HEX_ALPHA_REGEX.test(hex)) {
		return hex.slice(0, 7);
	}
	throw new Error(`normaliseHex: invalid hex colour "${hex}" — expected #RRGGBB or #RRGGBBAA`);
}

/**
 * Applies normaliseHex to every value in a palette record.
 * Throws if any value is not a valid hex colour.
 */
export function normalisePalette<T extends Record<string, string>>(palette: T): T {
	return Object.fromEntries(
		Object.entries(palette).map(([key, value]) => {
			try {
				return [key, normaliseHex(value)];
			} catch {
				throw new Error(`normalisePalette: invalid value for key "${key}": ${value}`);
			}
		}),
	) as T;
}
