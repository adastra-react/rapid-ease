export const DEFAULT_CURRENCY = "USD";

export const CURRENCY_OPTIONS = [
  { code: "USD", label: "USD", symbol: "$", rate: 1, locale: "en-US" },
  { code: "GBP", label: "GBP", symbol: "£", rate: 0.79, locale: "en-GB" },
  { code: "JMD", label: "JMD", symbol: "J$", rate: 156, locale: "en-JM" },
];

export const CURRENCY_MAP = Object.fromEntries(
  CURRENCY_OPTIONS.map((currency) => [currency.code, currency])
);

export function normalizeCurrency(value) {
  if (value === "Pound Sterling") {
    return "GBP";
  }

  if (CURRENCY_MAP[value]) {
    return value;
  }

  return DEFAULT_CURRENCY;
}

export function toNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

export function convertPrice(amount, currency = DEFAULT_CURRENCY) {
  const normalizedCurrency = normalizeCurrency(currency);
  const numericAmount = toNumber(amount);
  const rate = CURRENCY_MAP[normalizedCurrency]?.rate ?? 1;

  return numericAmount * rate;
}

export function formatPrice(amount, currency = DEFAULT_CURRENCY) {
  const normalizedCurrency = normalizeCurrency(currency);
  const convertedAmount = convertPrice(amount, normalizedCurrency);
  const { symbol, locale } = CURRENCY_MAP[normalizedCurrency];

  return `${symbol}${convertedAmount.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function firstValidPrice(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") {
      return toNumber(value);
    }
  }

  return 0;
}
