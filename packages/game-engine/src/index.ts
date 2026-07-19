export type Performance = "again"|"hard"|"good"|"easy";
export function masteryDelta(input:{correct:boolean; difficulty:number; usedHint:boolean; kind:"basic"|"relation"|"application"; streak:number}) {
  if (!input.correct) return -5;
  const base={basic:8,relation:10,application:12}[input.kind];
  return Math.max(3, base + Math.max(0,input.difficulty-2)*2 + (input.streak>=2?5:0) - (input.usedHint?7:0));
}
export function nextReview(now:Date, performance:Performance, mastery:number) {
  const minutes=performance==="again"?10:performance==="hard"?1440:performance==="good"?4320:mastery>=80?43200:10080;
  return new Date(now.getTime()+minutes*60_000);
}
