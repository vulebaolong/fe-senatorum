import { MAX_ALLOWED_FONT_SIZE, MIN_ALLOWED_FONT_SIZE } from "./context/toolbar-context";

export const parseAllowedFontSize = (input: string): string => {
    const match = input.match(/^(\d+(?:\.\d+)?)px$/);
    if (match) {
        const n = Number(match[1]);
        if (n >= MIN_ALLOWED_FONT_SIZE && n <= MAX_ALLOWED_FONT_SIZE) {
            return input;
        }
    }
    return "";
};

export function parseAllowedColor(input: string) {
    return /^rgb\(\d+, \d+, \d+\)$/.test(input) ? input : "";
}
