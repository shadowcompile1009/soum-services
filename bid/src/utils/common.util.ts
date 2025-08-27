export function formatAmountToDecimal(amount: number) {
  return Math.round(amount * 100) / 100;
}

export function generateSoumTrackingNumber() {
  return (
    'SOUM' +
    Math.round(new Date().getTime() / 1000) +
    Math.floor(1000 + Math.random() * 9000)
  );
}
