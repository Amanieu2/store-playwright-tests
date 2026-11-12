/** "$29.99" or "Item total: $29.99" -> 29.99 */
export function parsePrice(text: string): number {
  const match = text.match(/\$\s*(\d+(?:\.\d+)?)/);
  if (!match) {
    throw new Error(`No price found in "${text}"`);
  }
  return Number(match[1]);
}

/** Rounds to cents, avoiding floating point noise like 0.1 + 0.2. */
export function toCents(value: number): number {
  return Math.round(value * 100);
}
