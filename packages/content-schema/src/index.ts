import {z} from "zod";
export const answerInput=z.object({questionId:z.string().min(1),answer:z.string().min(1),timeSpentMs:z.number().int().min(0).max(3_600_000),usedHint:z.boolean().default(false)});
export const startSessionInput=z.object({levelId:z.string().min(1)});
export const orderInput=z.object({productId:z.string().min(1)});
