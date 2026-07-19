export type WorldTheme = "culture" | "history" | "numbers";
export interface World { id:string; name:string; subtitle:string; theme:WorldTheme; progress:number; free:boolean }
export interface Level { id:string; worldId:string; name:string; kind:"lesson"|"branch"|"boss"; status:"locked"|"open"|"active"|"complete"; x:number; summary:string }
export interface PublicQuestion { id:string; knowledgeId:string; type:"single"|"boolean"; stem:string; options:string[]; hint?:string }
export interface AnswerResult { correct:boolean; explanation:string; masteryDelta:number; nextReviewAt:string }
export interface Mastery { knowledgeId:string; name:string; score:number; nextReviewAt:string }
export interface ApiError { error:{ code:string; message:string; requestId:string } }
