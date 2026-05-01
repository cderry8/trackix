/** Mock FX rates vs USD */
const RATES_TO_USD = { USD: 1, EUR: 0.92, RWF: 0.00075 };

export function convertAmount(amount, from, to) {
  if (from === to) return round(amount);
  const usd = amount / RATES_TO_USD[from];
  const out = usd * RATES_TO_USD[to];
  return round(out);
}

export function getRates() {
  return { ...RATES_TO_USD };
}

function round(n) {
  return Math.round(n * 100) / 100;
}
