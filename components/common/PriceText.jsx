"use client";

import { useCurrency } from "@/components/providers/CurrencyProvider";
import { firstValidPrice } from "@/lib/currency";

export default function PriceText({
  amount,
  amounts,
  as: Tag = "span",
  className,
}) {
  const { formatPrice } = useCurrency();
  const value = amounts?.length
    ? firstValidPrice(...amounts)
    : firstValidPrice(amount);

  return <Tag className={className}>{formatPrice(value)}</Tag>;
}
