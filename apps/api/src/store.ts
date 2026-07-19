import type {Mastery} from "@expedition/shared";
export interface LearningStore { getMastery(userId:string):Promise<Mastery[]>; saveMastery(userId:string,item:Mastery):Promise<void> }
export class MemoryLearningStore implements LearningStore { private rows=new Map<string,Mastery[]>(); async getMastery(userId:string){return this.rows.get(userId)??[]} async saveMastery(userId:string,item:Mastery){const rows=await this.getMastery(userId);this.rows.set(userId,[...rows.filter(r=>r.knowledgeId!==item.knowledgeId),item])}}
// Production adapter intentionally lives behind this interface; Supabase credentials remain server-only.
