import { createClient } from "@supabase/supabase-js";
import type { AnswerExplanation, Chapter, Level, PublicQuestion, SubmittedAnswer, World } from "@expedition/shared";

export type SecretQuestion={id:string;levelId:string;knowledgeId:string;public:PublicQuestion;answer:SubmittedAnswer;explanation:AnswerExplanation;difficulty:number;kind:"basic"|"relation"|"application"};
export type KnowledgeGraphNode={id:string;name:string;summary:string;coreFact:string;category:string;commonMistake:string;memoryTip:string};
export type KnowledgeGraphRelation={sourceId:string;targetId:string;relationType:string;label:string;weight:number};
type Row=Record<string,unknown>;

const url=process.env.SUPABASE_URL;
const serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
if(!url||!serviceKey)throw new Error("缺少 SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY；题库只能从 Supabase 读取");
// Supabase handles both legacy service_role JWTs and new sb_secret keys here.
// Do not alter its request headers: the API gateway maps a secret key to its service role.
const db=createClient(url,serviceKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});

function dataOrThrow<T>(result:{data:T|null;error:{message:string}|null},name:string):T{if(result.error)throw new Error(`读取 Supabase ${name} 失败：${result.error.message}`);if(result.data===null)throw new Error(`Supabase ${name} 没有返回数据`);return result.data;}
function json<T>(value:unknown):T{
  if(typeof value!=="string")return value as T;
  // jsonb objects may arrive as objects, but jsonb scalar answers arrive as plain "A"/"B" strings.
  try{return JSON.parse(value) as T;}catch{return value as T;}
}
function string(row:Row,key:string){const value=row[key];return typeof value==="string"?value:"";}
function number(row:Row,key:string){const value=row[key];return typeof value==="number"?value:Number(value??0);}
function bool(row:Row,key:string){return row[key]===true;}

export async function loadContentCatalog(){
  const [worldResult,chapterResult,levelResult,knowledgeResult,questionResult]=await Promise.all([
    db.from("worlds").select("id,name,description,theme,free_chapter_count").eq("published",true),
    db.from("chapters").select("id,world_id,name,description,intro,boss_name,boss_description,sort").eq("published",true),
    db.from("levels").select("id,chapter_id,name,kind,sort,pass_score,summary").eq("published",true),
    db.from("knowledge_points").select("id,name,category").eq("published",true),
    db.from("questions").select("id,knowledge_id,level_id,question_type,stem,options,correct_answer,explanation,difficulty").eq("published",true)
  ]);
  const worldRows=dataOrThrow(worldResult,"worlds") as Row[];
  const chapterRows=dataOrThrow(chapterResult,"chapters") as Row[];
  const levelRows=dataOrThrow(levelResult,"levels") as Row[];
  const knowledgeRows=dataOrThrow(knowledgeResult,"knowledge_points") as Row[];
  const questionRows=dataOrThrow(questionResult,"questions") as Row[];
  const worldById=new Map(worldRows.map(row=>[string(row,"id"),row]));
  const chapterById=new Map(chapterRows.map(row=>[string(row,"id"),row]));
  const questionCountByChapter=new Map<string,number>();
  const knowledgeByChapter=new Map<string,Set<string>>();
  const levelToChapter=new Map(levelRows.map(row=>[string(row,"id"),string(row,"chapter_id")]));
  for(const row of questionRows){const chapterId=levelToChapter.get(string(row,"level_id"));if(!chapterId)continue;questionCountByChapter.set(chapterId,(questionCountByChapter.get(chapterId)??0)+1);const set=knowledgeByChapter.get(chapterId)??new Set<string>();set.add(string(row,"knowledge_id"));knowledgeByChapter.set(chapterId,set);}
  const worlds:World[]=worldRows.map(row=>({id:string(row,"id"),name:string(row,"name"),subtitle:string(row,"description"),theme:string(row,"theme") as World["theme"],progress:0,free:number(row,"free_chapter_count")>0}));
  const chapters:Chapter[]=chapterRows.map(row=>({id:string(row,"id"),worldId:string(row,"world_id"),name:string(row,"name"),description:string(row,"description"),knowledgeCount:knowledgeByChapter.get(string(row,"id"))?.size??0,questionCount:questionCountByChapter.get(string(row,"id"))??0,intro:string(row,"intro"),bossName:string(row,"boss_name"),bossDescription:string(row,"boss_description")}));
  const levels:Level[]=levelRows.flatMap(row=>{const chapterId=string(row,"chapter_id");const chapter=chapterById.get(chapterId);if(!chapter||!worldById.has(string(chapter,"world_id")))return [];return [{id:string(row,"id"),worldId:string(chapter,"world_id"),chapterId,name:string(row,"name"),kind:string(row,"kind") as Level["kind"],status:"locked",sort:number(row,"sort"),questionCount:questionRows.filter(question=>string(question,"level_id")===string(row,"id")).length,passScore:number(row,"pass_score"),summary:string(row,"summary")}];});
  const knowledgeItems=knowledgeRows.map(row=>({id:string(row,"id"),name:string(row,"name"),category:string(row,"category")}));
  const questions:SecretQuestion[]=questionRows.flatMap(row=>{const full=json<Partial<PublicQuestion>>(row.options);const id=string(row,"id");const knowledgeId=string(row,"knowledge_id");const levelId=string(row,"level_id");if(!levelToChapter.has(levelId))return [];const type=string(row,"question_type") as PublicQuestion["type"];const publicQuestion={...full,questionId:id,knowledgeId,type,stem:string(row,"stem")} as PublicQuestion;return [{id,levelId,knowledgeId,public:publicQuestion,answer:json<SubmittedAnswer>(row.correct_answer),explanation:json<AnswerExplanation>(row.explanation),difficulty:number(row,"difficulty"),kind:type==="relation_match"?"relation":type==="scene_judgment"?"application":"basic"}];});
  if(!questions.length)throw new Error("Supabase 题库为空，请先在 SQL Editor 执行 004_content_catalog.sql");
  return {worlds,chapters,levels,knowledgeItems,questions};
}

const catalog=await loadContentCatalog();
export const {worlds,chapters,levels,knowledgeItems,questions}=catalog;
export function questionsForLevel(levelId:string){return questions.filter(question=>question.levelId===levelId);}

export async function loadKnowledgeGraph(focusId?:string){
  const [pointResult,relationResult]=await Promise.all([
    db.from("knowledge_points").select("id,name,summary,core_fact,category,common_mistake,memory_tip").eq("published",true),
    db.from("knowledge_relations").select("source_id,target_id,relation_type,label,weight")
  ]);
  const points=(dataOrThrow(pointResult,"knowledge_points") as Row[]).map<KnowledgeGraphNode>(row=>({
    id:string(row,"id"),name:string(row,"name"),summary:string(row,"summary"),coreFact:string(row,"core_fact"),category:string(row,"category"),commonMistake:string(row,"common_mistake"),memoryTip:string(row,"memory_tip")
  }));
  const relations=(dataOrThrow(relationResult,"knowledge_relations") as Row[]).map<KnowledgeGraphRelation>(row=>({
    sourceId:string(row,"source_id"),targetId:string(row,"target_id"),relationType:string(row,"relation_type"),label:string(row,"label"),weight:number(row,"weight")
  }));
  const pointById=new Map(points.map(point=>[point.id,point]));
  const chosen=pointById.get(focusId??"")??pointById.get(relations[0]?.sourceId??"")??points[0];
  if(!chosen)throw new Error("Supabase 知识图谱为空");
  const adjacent=relations.filter(relation=>relation.sourceId===chosen.id||relation.targetId===chosen.id);
  const neighborIds=new Set(adjacent.map(relation=>relation.sourceId===chosen.id?relation.targetId:relation.sourceId));
  return {focus:chosen,nodes:[chosen,...[...neighborIds].map(id=>pointById.get(id)).filter((point):point is KnowledgeGraphNode=>Boolean(point))],relations:adjacent};
}
