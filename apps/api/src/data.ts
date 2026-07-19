import type {Level,PublicQuestion,World} from "@expedition/shared";
export const worlds:World[]=[
 {id:"culture",name:"文化万象",subtitle:"从一纸成语帖，走入千年文脉",theme:"culture",progress:42,free:true},
 {id:"history",name:"华夏纪年",subtitle:"沿时间长河，重建人物与事件",theme:"history",progress:18,free:false},
 {id:"numbers",name:"数字工坊",subtitle:"把公式锻造成快速判断力",theme:"numbers",progress:8,free:true}
];
export const levels:Level[]=[
 {id:"idiom-1",worldId:"culture",name:"一诺千金",kind:"lesson",status:"complete",x:32,summary:"理解承诺、信用与典故人物"},
 {id:"idiom-2",worldId:"culture",name:"近义迷阵",kind:"lesson",status:"active",x:66,summary:"辨析信守不渝与一言九鼎"},
 {id:"idiom-branch",worldId:"culture",name:"典故宝匣",kind:"branch",status:"open",x:35,summary:"追溯季布与楚汉故事"},
 {id:"idiom-boss",worldId:"culture",name:"文脉守关人",kind:"boss",status:"locked",x:70,summary:"综合场景、人物与典故"}
];
type SecretQuestion=PublicQuestion&{answer:string;explanation:string;kind:"basic"|"relation"|"application"};
export const questions:SecretQuestion[]=[
 {id:"q1",knowledgeId:"k-yinuo",type:"single",stem:"“一诺千金”最适合形容哪种情形？",options:["承诺可靠，信用极高","说话声音洪亮","财富数量巨大","行动速度很快"],answer:"承诺可靠，信用极高",explanation:"典故与季布有关，强调承诺可信，而非金钱本身。",kind:"application"},
 {id:"q2",knowledgeId:"k-yinuo",type:"single",stem:"“得黄金百斤，不如得季布一诺”对应的人物是？",options:["季布","项羽","韩信","张良"],answer:"季布",explanation:"楚人季布以守信闻名，民间由此形成“一诺千金”的表达。",kind:"relation"},
 {id:"q3",knowledgeId:"k-jingwei",type:"boolean",stem:"“精卫填海”常用来赞扬意志坚定、不畏艰难。",options:["正确","错误"],answer:"正确",explanation:"该成语强调目标坚定、坚持不懈。",kind:"basic"},
 {id:"q4",knowledgeId:"k-chibi",type:"single",stem:"赤壁之战发生于哪一年？",options:["公元208年","公元前202年","公元220年","公元280年"],answer:"公元208年",explanation:"赤壁之战发生在东汉建安十三年，即公元208年。",kind:"basic"},
 {id:"q5",knowledgeId:"k-growth",type:"single",stem:"现期量120，比基期增长20%，基期量约为？",options:["100","96","144","110"],answer:"100",explanation:"基期量=现期量÷(1+增长率)=120÷1.2=100。",kind:"application"}
];
export function publicQuestion(q:SecretQuestion):PublicQuestion { const {answer:_a,explanation:_e,kind:_k,...safe}=q; return safe }
