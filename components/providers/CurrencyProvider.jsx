"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CURRENCY_OPTIONS,
  DEFAULT_CURRENCY,
  convertPrice,
  formatPrice,
  normalizeCurrency,
} from "@/lib/currency";

const STORAGE_KEY = "rapidease_currency";

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [selectedCurrency, setSelectedCurrencyState] = useState(
    DEFAULT_CURRENCY
  );

  useEffect(() => {
    const storedCurrency = window.localStorage.getItem(STORAGE_KEY);

    if (storedCurrency) {
      setSelectedCurrencyState(normalizeCurrency(storedCurrency));
    }
  }, []);

  const setSelectedCurrency = (currency) => {
    const normalizedCurrency = normalizeCurrency(currency);
    setSelectedCurrencyState(normalizedCurrency);
    window.localStorage.setItem(STORAGE_KEY, normalizedCurrency);
  };

  const value = useMemo(
    () => ({
      currencies: CURRENCY_OPTIONS,
      selectedCurrency,
      setSelectedCurrency,
      convertPrice: (amount) => convertPrice(amount, selectedCurrency),
      formatPrice: (amount) => formatPrice(amount, selectedCurrency),
    }),
    [selectedCurrency]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }

  return context;
}
