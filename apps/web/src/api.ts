import type { AnswerResult, Level, PublicQuestion, World } from "@expedition/shared";
import { getAccessToken } from "./auth";

const base = import.meta.env.VITE_API_URL ?? "http://localhost:8787/api/v1";
async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const accessToken = getAccessToken();
  const response = await fetch(`${base}${path}`, { ...init, headers: { "content-type": "application/json", ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}), ...init?.headers } });
  if (!response.ok) throw new Error("远征补给线暂时中断");
  return response.json() as Promise<T>;
}
export const api = { worlds: () => call<World[]>("/worlds"), world: (id: string) => call<{ world: World; levels: Level[] }>(`/worlds/${id}`), start: (levelId: string) => call<{ sessionId: string; total: number; question: PublicQuestion }>("/sessions/start", { method: "POST", body: JSON.stringify({ levelId }) }), question: (sessionId: string, index: number) => call<PublicQuestion>(`/sessions/${sessionId}/question?index=${index}`), answer: (sessionId: string, input: { questionId: string; answer: string; timeSpentMs: number; usedHint: boolean }) => call<AnswerResult>(`/sessions/${sessionId}/answer`, { method: "POST", body: JSON.stringify(input) }) };
