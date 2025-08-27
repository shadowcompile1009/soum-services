export function generateGTIN(): string {
  const randomDigits = (): string => Math.floor(Math.random() * 10).toString();
  const gtin = Array.from({ length: 13 }, randomDigits).join('');
  function calculateCheckDigit(gtin: string): number {
    let sum = 0;
    for (let i = 0; i < gtin.length; i++) {
      const digit = parseInt(gtin[i], 10);
      if (i % 2 === 0) {
        sum += digit;
      } else {
        sum += digit * 3;
      }
    }
    const mod = sum % 10;
    return (10 - mod) % 10;
  }
  const checkDigit = calculateCheckDigit(gtin);
  return gtin + checkDigit;
}
