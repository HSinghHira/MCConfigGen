export interface MinecraftColor {
    name: string;
    code: string; // e.g., 'a', 'b', 'c'
    hex: string;
    isFormat: boolean;
}

export const colorCodes: MinecraftColor[] = [
    // Colors
    { name: 'Black', code: '0', hex: '#000000', isFormat: false },
    { name: 'Dark Blue', code: '1', hex: '#0000AA', isFormat: false },
    { name: 'Dark Green', code: '2', hex: '#00AA00', isFormat: false },
    { name: 'Dark Aqua', code: '3', hex: '#00AAAA', isFormat: false },
    { name: 'Dark Red', code: '4', hex: '#AA0000', isFormat: false },
    { name: 'Dark Purple', code: '5', hex: '#AA00AA', isFormat: false },
    { name: 'Gold', code: '6', hex: '#FFAA00', isFormat: false },
    { name: 'Gray', code: '7', hex: '#AAAAAA', isFormat: false },
    { name: 'Dark Gray', code: '8', hex: '#555555', isFormat: false },
    { name: 'Blue', code: '9', hex: '#5555FF', isFormat: false },
    { name: 'Green', code: 'a', hex: '#55FF55', isFormat: false },
    { name: 'Aqua', code: 'b', hex: '#55FFFF', isFormat: false },
    { name: 'Red', code: 'c', hex: '#FF5555', isFormat: false },
    { name: 'Light Purple', code: 'd', hex: '#FF55FF', isFormat: false },
    { name: 'Yellow', code: 'e', hex: '#FFFF55', isFormat: false },
    { name: 'White', code: 'f', hex: '#FFFFFF', isFormat: false },

    // Format Codes
    { name: 'Obfuscated', code: 'k', hex: '', isFormat: true },
    { name: 'Bold', code: 'l', hex: '', isFormat: true },
    { name: 'Strikethrough', code: 'm', hex: '', isFormat: true },
    { name: 'Underline', code: 'n', hex: '', isFormat: true },
    { name: 'Italic', code: 'o', hex: '', isFormat: true },
    { name: 'Reset', code: 'r', hex: '', isFormat: true },
];

export function getColorByCode(code: string): MinecraftColor | undefined {
    return colorCodes.find(c => c.code === code);
}
