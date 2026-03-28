export function formatRatio(value: number) {
  return `${Math.round(value * 100)}% target language`;
}

export function formatTermList(terms: string[]) {
  return terms.length ? terms.join(" • ") : "No new target-language terms yet";
}

