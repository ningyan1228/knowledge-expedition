import { z } from "zod";

const relationAnswer = z.array(z.object({ leftId: z.string().min(1), rightId: z.string().min(1) })).min(1);
export const submittedAnswer = z.union([z.string().min(1), relationAnswer]);
export const answerInput = z.object({ questionId: z.string().min(1), answer: submittedAnswer, timeSpentMs: z.number().int().min(0).max(3_600_000), usedHint: z.boolean().default(false) });
export const startSessionInput = z.object({ levelId: z.string().min(1) });
export const orderInput = z.object({ productId: z.string().min(1) });
