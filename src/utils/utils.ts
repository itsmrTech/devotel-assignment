import { symbol } from 'joi';

export const parseMoneyStr = (
    input: string
): {
    prefix: string | null;
    value: number | null;
} => {
    if (!input) return { prefix: null, value: null };
    const match = input.trim().match(/^([^0-9]*)(\d[\d.,]*\s*\w*)$/);
    if (!match) return { prefix: null, value: null };

    const prefix = match[1].trim();
    let valueStr = match[2].trim().toLowerCase();

    // Remove commas from numbers
    valueStr = valueStr.replace(/,/g, '');

    // Extract numeric part and scale if needed
    let multiplier = 1;
    if (valueStr.endsWith('k')) {
        multiplier = 1000;
        valueStr = valueStr.replace('k', '');
    } else if (valueStr.endsWith('m')) {
        multiplier = 1000000;
        valueStr = valueStr.replace('m', '');
    } else if (valueStr.endsWith('b')) {
        multiplier = 1000000000;
        valueStr = valueStr.replace('b', '');
    }

    // Convert to float and apply multiplier
    const value = parseFloat(valueStr) * multiplier;

    return { prefix, value: isNaN(value) ? null : value };
};

export const convertCurrencySymbolToISO = (symbol: string): string | null => {
    const normalizedSymbol = symbol?.trim()?.toUpperCase();
    switch (normalizedSymbol) {
        case '$':
            return 'USD';
        case '€':
            return 'EUR';
        case '£':
            return 'GBP';
        case '¥':
            return 'JPY';
        case '₹':
            return 'INR';
        case '₽':
            return 'RUB';
        case 'ریال':
            return 'IRR';
        case 'تومان':
            return 'TMN';

        default:
            return normalizedSymbol;
    }
};
