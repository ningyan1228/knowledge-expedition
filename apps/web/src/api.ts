import type { AnswerResult, Chapter, Level, LevelResult, Mastery, ProgressMap, SessionSnapshot, SubmittedAnswer, World, WrongQuestion, ReviewItem } from "@expedition/shared";
import { getAccessToken } from "./auth";

export type KnowledgeGraphNode={id:string;name:string;summary:string;coreFact:string;category:string;commonMistake:string;memoryTip:string};
export type KnowledgeGraphRelation={sourceId:string;targetId:string;relationType:string;label:string;weight:number};
export type KnowledgeGraph={focus:KnowledgeGraphNode;nodes:KnowledgeGraphNode[];relations:KnowledgeGraphRelation[]};

const base=import.meta.env.VITE_API_URL??"http://localhost:8787/api/v1";
async function call<T>(path:string,init?:RequestInit):Promise<T>{const accessToken=getAccessToken();const response=await fetch(`${base}${path}`,{...init,headers:{...(init?.body?{"content-type":"application/json"}:{}),...(accessToken?{authorization:`Bearer ${accessToken}`}:{}) ,...init?.headers}});if(!response.ok){const body=await response.json().catch(()=>null) as {error?:{message?:string}}|null;throw new Error(body?.error?.message??"远征补给线暂时中断");}return response.json() as Promise<T>;}
export const api={
  worlds:()=>call<World[]>("/worlds"),
  world:(id:string)=>call<{world:World;chapters:Array<Pick<Chapter,"id"|"name"|"description">>}>(`/worlds/${id}`),
  graph:(knowledgeId?:string)=>call<KnowledgeGraph>(`/knowledge-graph${knowledgeId?`?knowledgeId=${encodeURIComponent(knowledgeId)}`:""}`),
  chapter:(id="idiom-foundation")=>call<Chapter&{levels:Level[]}>(`/chapters/${id}`),
  progress:()=>call<ProgressMap>("/progress/map"),
  start:(levelId:string)=>call<SessionSnapshot>("/learning-sessions",{method:"POST",body:JSON.stringify({levelId})}),
  session:(sessionId:string)=>call<SessionSnapshot>(`/learning-sessions/${sessionId}`),
  answer:(sessionId:string,input:{questionId:string;answer:SubmittedAnswer;timeSpentMs:number;usedHint:boolean})=>call<AnswerResult>(`/learning-sessions/${sessionId}/answers`,{method:"POST",body:JSON.stringify(input)}),
  complete:(sessionId:string)=>call<LevelResult>(`/learning-sessions/${sessionId}/complete`,{method:"POST",body:JSON.stringify({})}),
  wrongs:()=>call<WrongQuestion[]>("/wrong-questions"),
  reviews:()=>call<{due:ReviewItem[];upcoming:ReviewItem[]}>("/reviews/today"),
  mastery:()=>call<Mastery[]>("/mastery")
};
