import type { SubmittedAnswer } from "@expedition/shared";

export type Performance = "again" | "hard" | "good" | "easy";
export function masteryDelta(input: { correct: boolean; difficulty: number; usedHint: boolean; kind: "basic" | "relation" | "application"; streak: number }) {
  if (!input.correct) return -5;
  const base = { basic: 8, relation: 10, application: 12 }[input.kind];
  return Math.max(3, base + Math.max(0, input.difficulty - 2) * 2 + (input.streak >= 2 ? 5 : 0) - (input.usedHint ? 7 : 0));
}
export function nextReview(now: Date, performance: Performance, mastery: number) {
  const minutes = performance === "again" ? 10 : performance === "hard" ? 1440 : performance === "good" ? 4320 : mastery >= 80 ? 21600 : 10080;
  return new Date(now.getTime() + minutes * 60_000);
}
export function answersEqual(expected: SubmittedAnswer, actual: SubmittedAnswer) {
  if (typeof expected === "string" || typeof actual === "string") return expected === actual;
  const normalize = (items: Array<{ leftId: string; rightId: string }>) => items.map(item => `${item.leftId}:${item.rightId}`).sort();
  return JSON.stringify(normalize(expected)) === JSON.stringify(normalize(actual));
}
export function starsFor(correctRate: number, hints: number, passScore = 60) { return correctRate < passScore ? 0 : correctRate >= 90 && hints <= 1 ? 3 : correctRate >= 80 ? 2 : 1; }
export function rewardFor(stars: number, boss: boolean) { return { xp: stars * (boss ? 80 : 30), coins: stars * (boss ? 30 : 10) }; }
