import Fastify, { type FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { z } from "zod";
import { answerInput, startSessionInput, orderInput } from "@expedition/content-schema";
import { answersEqual, masteryDelta, nextReview, rewardFor, starsFor } from "@expedition/game-engine";
import type { Level, SessionSnapshot } from "@expedition/shared";
import { chapters, knowledgeItems, levels, loadKnowledgeGraph, questions, questionsForLevel, worlds } from "./content-catalog.js";
import { MemoryLearningStore } from "./store.js";
import { MockPaymentProvider } from "./payment.js";
import { consumeMergeTicket, createMergeTicket, loadPlayerGameState, registerEmailRequest, requireAuth, requirePermanentUser, savePlayerGameState, verifyTurnstile } from "./auth.js";

const app = Fastify({ logger: { redact: ["req.headers.authorization","req.headers.cookie","req.body.token","req.body.captchaToken","req.body.answer"] } });
const store = new MemoryLearningStore(); const payment = new MockPaymentProvider();
app.removeContentTypeParser("application/json");
app.addContentTypeParser("application/json",{parseAs:"string"},(_request,body,done)=>{const text=typeof body==="string"?body:body.toString("utf8");if(text==="")return done(null,{});try{return done(null,JSON.parse(text));}catch(error){return done(error as Error,undefined);}});
await app.register(helmet); await app.register(rateLimit,{max:120,timeWindow:"1 minute"});
await app.register(cors,{origin:(process.env.WEB_ORIGIN??"http://localhost:5173").split(",")});
app.setErrorHandler((error,request,reply)=>{request.log.error({err:error,requestId:request.id},"request failed");const status=typeof (error as {statusCode?:unknown}).statusCode==="number"?(error as {statusCode:number}).statusCode:500;const detail=error instanceof Error?error.message:"请求失败";const message=status===401?"请先开始远征或登录账号":status===403?detail:status===429?"操作较频繁，请稍后再试":status>=500?"请求暂时无法完成，请稍后再试":detail;reply.status(status).send({error:{code:"REQUEST_FAILED",message,requestId:request.id}});});
function fail(message:string,statusCode:number):never{const error=new Error(message) as Error&{statusCode:number};error.statusCode=statusCode;throw error;}
const hydratedPlayers=new Set<string>();
async function playerId(request:FastifyRequest){
  const userId=!process.env.SUPABASE_URL?"development-player":(await requireAuth(request)).userId;
  if(!hydratedPlayers.has(userId)){
    try{store.importUser(userId,await loadPlayerGameState(userId));}
    catch(error){request.log.warn({err:error,userId},"player state hydration unavailable; continuing with memory store");}
    hydratedPlayers.add(userId);
  }
  return userId;
}
async function persistPlayer(userId:string){
  try{await savePlayerGameState(userId,store.exportUser(userId));}
  catch(error){app.log.warn({err:error,userId},"player state persistence unavailable; continuing with memory store");}
}
const contentSyncs=new Map<string,{id:string;status:"completed";adapter:"mock"|"notion";knowledgeCount:number;questionCount:number;failed:number;warnings:number;version:string;contentHash:string;createdAt:string}>();
const contentReleases:Array<{id:string;version:string;contentHash:string;createdAt:string}>=[];
async function requireAdmin(request:FastifyRequest){if(!process.env.SUPABASE_URL)return {userId:"development-admin"};const user=await requirePermanentUser(request);const admins=(process.env.ADMIN_USER_IDS??"").split(",").map(value=>value.trim()).filter(Boolean);if(!admins.includes(user.userId))fail("需要内容管理员权限",403);return user;}
function levelState(userId:string,chapterId?:string){const progress=store.getProgress(userId);const scoped=chapterId?levels.filter(level=>level.chapterId===chapterId):levels;return scoped.map((level,index):Level=>{const saved=progress.levels.get(level.id);const previous=index===0||progress.levels.has(scoped[index-1]!.id);return {...level,status:saved?"complete":previous?"active":"locked",stars:saved?.stars??0};});}
function snapshot(session:ReturnType<MemoryLearningStore["createSession"]>):SessionSnapshot{const level=levels.find(item=>item.id===session.levelId)!;const list=questionsForLevel(session.levelId);return {sessionId:session.id,level:{id:level.id,name:level.name,questionCount:list.length},currentIndex:session.currentIndex,currentQuestion:session.status==="active"?list[session.currentIndex]?.public??null:null,status:session.status,result:session.result};}

app.get("/health",async()=>({ok:true,service:"knowledge-expedition-api",contentVersion:`supabase-catalog-v1-${questions.length}`}));
app.get("/api/v1/config",async()=>({appName:"知识远征",guestEnabled:true,mockMode:!process.env.SUPABASE_URL,emailCooldownSeconds:Number(process.env.AUTH_EMAIL_COOLDOWN_SECONDS??60)}));
app.post("/api/v1/auth/turnstile/verify",async(request,reply)=>{const body=z.object({token:z.string().min(1).optional()}).safeParse(request.body);if(!body.success)return reply.code(400).send({error:{code:"INVALID_INPUT",message:"安全验证无效",requestId:request.id}});const result=await verifyTurnstile(body.data.token,request.ip);return result.ok?result:reply.code(403).send({error:{code:"TURNSTILE_FAILED",message:"安全验证未通过，请刷新后重试",requestId:request.id}});});
app.post("/api/v1/auth/email/request",async(request,reply)=>{const body=z.object({email:z.string().email(),eventType:z.enum(["bind","login"])}).safeParse(request.body);if(!body.success)return reply.code(400).send({error:{code:"INVALID_INPUT",message:"请输入有效的邮箱地址",requestId:request.id}});const result=await registerEmailRequest(request,body.data.email,body.data.eventType);return result.allowed?result:reply.code(429).send({error:{code:"EMAIL_LIMIT",message:"验证码发送较频繁，请稍后再试",requestId:request.id},retryAfter:result.retryAfter});});
app.post("/api/v1/auth/merge-ticket",async request=>createMergeTicket(request));
app.post("/api/v1/auth/merge",async(request,reply)=>{const body=z.object({token:z.string().min(20)}).safeParse(request.body);if(!body.success)return reply.code(400).send({error:{code:"INVALID_INPUT",message:"合并凭证无效",requestId:request.id}});return consumeMergeTicket(request,body.data.token);});

app.get("/api/v1/worlds",async()=>worlds);
app.get("/api/v1/knowledge-graph",async request=>{
  const focusId=typeof (request.query as {knowledgeId?:unknown}).knowledgeId==="string"?(request.query as {knowledgeId:string}).knowledgeId:undefined;
  return loadKnowledgeGraph(focusId);
});
app.get("/api/v1/worlds/:worldId",async request=>{const id=(request.params as {worldId:string}).worldId;return {world:worlds.find(item=>item.id===id)??null,chapters:chapters.filter(chapter=>chapter.worldId===id).map(({id:chapterId,name,description})=>({id:chapterId,name,description}))};});
app.get("/api/v1/chapters/:chapterId",async request=>{const id=(request.params as {chapterId:string}).chapterId;const chapter=chapters.find(item=>item.id===id);if(!chapter)fail("章节不存在",404);const userId=await playerId(request);return {...chapter,levels:levelState(userId,id)};});
app.get("/api/v1/levels/:levelId",async request=>{const id=(request.params as {levelId:string}).levelId;const raw=levels.find(item=>item.id===id);if(!raw)fail("关卡不存在",404);const userId=await playerId(request);const level=levelState(userId,raw.chapterId).find(item=>item.id===id);if(!level)fail("关卡不存在",404);return level;});
app.get("/api/v1/progress/map",async request=>{const userId=await playerId(request);const progress=store.getProgress(userId);return {levels:levelState(userId),xp:progress.xp,coins:progress.coins};});

app.post("/api/v1/learning-sessions",async(request,reply)=>{const parsed=startSessionInput.safeParse(request.body);if(!parsed.success)return reply.code(400).send({error:{code:"INVALID_INPUT",message:"关卡无效",requestId:request.id}});const userId=await playerId(request);const raw=levels.find(item=>item.id===parsed.data.levelId);if(!raw)fail("关卡不存在",404);const level=levelState(userId,raw.chapterId).find(item=>item.id===raw.id);if(!level)fail("关卡不存在",404);if(level.status==="locked")fail("请先完成上一关",403);const session=store.createSession(userId,level.id);await persistPlayer(userId);return snapshot(session);});
app.get("/api/v1/learning-sessions/:sessionId",async request=>{const userId=await playerId(request);const session=store.getSession((request.params as {sessionId:string}).sessionId,userId);if(!session)fail("学习记录不存在",404);return snapshot(session);});
app.post("/api/v1/learning-sessions/:sessionId/answers",async(request,reply)=>{const parsed=answerInput.safeParse(request.body);if(!parsed.success)return reply.code(400).send({error:{code:"INVALID_INPUT",message:"答案格式无效",requestId:request.id}});const userId=await playerId(request);const session=store.getSession((request.params as {sessionId:string}).sessionId,userId);if(!session)fail("学习记录不存在",404);if(session.status!=="active")fail("本关已经结算",409);const list=questionsForLevel(session.levelId);const question=list[session.currentIndex];if(!question||question.id!==parsed.data.questionId)fail("题目顺序无效，请恢复当前关卡",409);const correct=answersEqual(question.answer,parsed.data.answer);const priorMastery=store.getMastery(userId).find(row=>row.knowledgeId===question.knowledgeId)?.score??0;const streak=session.attempts.slice(-2).every(item=>item.isCorrect)?2:0;const delta=masteryDelta({correct,difficulty:question.difficulty,usedHint:parsed.data.usedHint,kind:question.kind,streak});const review=nextReview(new Date(),correct?(parsed.data.timeSpentMs<8000?"easy":"good"):"again",Math.max(0,priorMastery+delta));const saved=store.saveAttempt(session,{questionId:question.id,knowledgeId:question.knowledgeId,answer:parsed.data.answer,isCorrect:correct,timeSpentMs:parsed.data.timeSpentMs,usedHint:parsed.data.usedHint,masteryDelta:delta,createdAt:new Date().toISOString()});if(!saved.duplicate){const item=knowledgeItems.find(row=>row.id===question.knowledgeId)!;store.updateLearning(userId,{questionId:question.id,knowledgeId:question.knowledgeId,knowledgeName:item.name,correct,answer:parsed.data.answer,delta,nextReviewAt:review.toISOString()});}await persistPlayer(userId);return {isCorrect:correct,correctAnswer:question.answer,explanation:question.explanation,masteryDelta:delta,nextReviewAt:review.toISOString(),progress:{current:session.currentIndex,total:list.length},nextQuestion:list[session.currentIndex]?.public};});
app.post("/api/v1/learning-sessions/:sessionId/complete",async request=>{const userId=await playerId(request);const session=store.getSession((request.params as {sessionId:string}).sessionId,userId);if(!session)fail("学习记录不存在",404);if(session.result)return session.result;const level=levels.find(item=>item.id===session.levelId)!;const list=questionsForLevel(session.levelId);if(session.attempts.length!==list.length)fail("还有题目尚未完成",409);const correct=session.attempts.filter(item=>item.isCorrect).length;const correctRate=Math.round(correct/list.length*100);const stars=starsFor(correctRate,session.attempts.filter(item=>item.usedHint).length,level.passScore);const reward=rewardFor(stars,level.kind==="boss");const weak=[...new Set(session.attempts.filter(item=>!item.isCorrect).map(item=>knowledgeItems.find(row=>row.id===item.knowledgeId)?.name??item.knowledgeId))].slice(0,5);const chapterLevels=levels.filter(item=>item.chapterId===level.chapterId);const mastery=store.getMastery(userId);const next=chapterLevels.find(item=>item.sort===level.sort+1)?.id??null;const result={sessionId:session.id,levelId:level.id,levelName:level.name,correctRate,score:correctRate,stars,xp:reward.xp,coins:reward.coins,masteryGain:session.attempts.reduce((sum,item)=>sum+Math.max(0,item.masteryDelta),0),wrongCount:list.length-correct,weakKnowledge:weak,nextLevelId:stars>0?next:null,chapterMastery:level.kind==="boss"?Math.round(mastery.reduce((sum,item)=>sum+item.score,0)/Math.max(1,mastery.length)):undefined,strongestKnowledge:level.kind==="boss"?[...mastery].sort((a,b)=>b.score-a.score)[0]?.name:undefined,nextReviewAt:store.getReviews(userId)[0]?.dueAt,rewardGranted:stars>0};const completed=store.complete(session,result);await persistPlayer(userId);return completed;});

app.get("/api/v1/progress/levels",async request=>({levels:levelState(await playerId(request))}));
app.get("/api/v1/progress/chapters",async request=>{const userId=await playerId(request);return chapters.map(chapter=>{const scoped=levelState(userId,chapter.id);return {chapterId:chapter.id,progress:Math.round(scoped.filter(item=>item.status==="complete").length/scoped.length*100)};});});
app.get("/api/v1/mastery",async request=>store.getMastery(await playerId(request)));
app.get("/api/v1/wrong-questions",async request=>store.getWrongs(await playerId(request)));
app.get("/api/v1/reviews/today",async request=>{const rows=store.getReviews(await playerId(request));return {due:rows.filter(row=>new Date(row.dueAt)<=new Date()),upcoming:rows};});

app.post("/api/v1/admin/content/sync/notion",async request=>{await requireAdmin(request);const id=crypto.randomUUID();const adapter="mock" as const;const contentHash=`supabase-catalog-${knowledgeItems.length}-${questions.length}`;const row={id,status:"completed" as const,adapter,knowledgeCount:knowledgeItems.length,questionCount:questions.length,failed:0,warnings:0,version:"supabase-catalog-v1",contentHash,createdAt:new Date().toISOString()};contentSyncs.set(id,row);return row;});
app.get("/api/v1/admin/content/sync/:syncId",async request=>{await requireAdmin(request);const row=contentSyncs.get((request.params as {syncId:string}).syncId);if(!row)fail("同步记录不存在",404);return row;});
app.post("/api/v1/admin/content/releases",async request=>{await requireAdmin(request);const latest=[...contentSyncs.values()].at(-1);if(!latest)fail("请先执行内容同步",409);const release={id:crypto.randomUUID(),version:latest.version,contentHash:latest.contentHash,createdAt:new Date().toISOString()};contentReleases.push(release);return release;});
app.get("/api/v1/admin/content/releases",async request=>{await requireAdmin(request);return contentReleases;});

app.get("/api/v1/knowledge/:id/relations",async request=>{const item=knowledgeItems.find(row=>row.id===(request.params as {id:string}).id);return item?{center:item.name,groups:[{label:"知识类别",items:[item.category]},{label:"同类复习",items:knowledgeItems.filter(row=>row.category===item.category&&row.id!==item.id).slice(0,4).map(row=>row.name)}]}:{center:"",groups:[]};});
app.get("/api/v1/products",async()=>[{id:"history-full",name:"华夏纪年完整包",price:19.9,entitlementCode:"world.history"}]);
app.post("/api/v1/orders",async(request,reply)=>{await requirePermanentUser(request);const parsed=orderInput.safeParse(request.body);if(!parsed.success)return reply.code(400).send({error:{code:"INVALID_INPUT",message:"商品无效",requestId:request.id}});const orderId=crypto.randomUUID();return {orderId,...await payment.createOrder({orderId,amount:1990})};});

// 旧版路由保留一个发布周期，避免已缓存的 PWA 在升级瞬间中断。
app.post("/api/v1/sessions/start",async(_request,reply)=>reply.code(307).redirect("/api/v1/learning-sessions"));
const port=Number(process.env.API_PORT??8787);app.listen({port,host:"0.0.0.0"}).catch(error=>{app.log.error(error);process.exit(1);});
