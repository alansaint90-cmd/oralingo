const fillerExpressions = ["ne", "né", "tipo", "assim", "entao", "então", "ai", "aí", "entendeu", "sabe", "basicamente", "literalmente"];

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractSpeechMetrics(transcript: string, durationSeconds: number) {
  const normalized = normalize(transcript);
  const words = normalized ? normalized.split(" ") : [];
  const wordCount = words.length;
  const wordsPerMinute = durationSeconds > 0 ? Math.round(wordCount / (durationSeconds / 60)) : 0;
  const counts = new Map<string, number>();

  for (const word of words) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  const fillerCounts = fillerExpressions
    .map((expression) => {
      const key = normalize(expression);
      return { palavra: expression, quantidade: counts.get(key) ?? 0 };
    })
    .filter((item) => item.quantidade > 0);

  const repeatedWords = [...counts.entries()]
    .filter(([, count]) => count >= 4)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  return {
    wordCount,
    wordsPerMinute,
    fillerCounts,
    repeatedWords
  };
}
