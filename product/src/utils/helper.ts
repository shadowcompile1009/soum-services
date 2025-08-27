export function formatPriceInDecimalPoints(
  price: number | string,
  decimals: number = 2,
): number {
  if (typeof price === 'string') {
    price = price.replace(/,/g, '');
    if (isNaN(Number(price))) {
      throw new Error('Invalid price value.');
    }
  }
  const numericPrice = Number(price);
  const multiplier = 10 ** decimals;
  return Math.round(numericPrice * multiplier) / multiplier;
}