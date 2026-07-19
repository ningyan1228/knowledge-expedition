import type { AnswerExplanation, Level, PublicQuestion, SubmittedAnswer, World } from "@expedition/shared";

export interface IdiomContent {
  id: string; name: string; pinyin: string; meaning: string; sentiment: string; appliesTo: string;
  correctScene: string; wrongScene: string; commonMistake: string; synonyms: string[]; antonyms: string[];
  source: string; person: string; event: string; dynasty: string; correctExample: string; wrongExample: string;
  memoryTip: string; difficulty: number; category: string; frequency: number; reviewStatus: "approved"; version: number;
}

type IdiomSeed = Pick<IdiomContent, "id" | "name" | "pinyin" | "meaning" | "category" | "frequency"> & Partial<IdiomContent>;
function idiom(seed: IdiomSeed): IdiomContent {
  return { sentiment: "中性", appliesTo: "事物、行为或表达", correctScene: `用于准确表达“${seed.meaning}”的语境`, wrongScene: "与核心语义或适用对象不符的语境", commonMistake: "只凭字面理解，忽略语义对象和感情色彩", synonyms: [], antonyms: [], source: "《十年真题成语频率排名》及公开辞书复核", person: "—", event: "—", dynasty: "—", correctExample: `这句话使用“${seed.name}”准确概括了材料的核心特征。`, wrongExample: `他第一个获得冠军，真是“${seed.name}”。`, memoryTip: `记住关键词：${seed.meaning.slice(0, 12)}`, difficulty: 2, reviewStatus: "approved", version: 1, ...seed };
}

export const idioms: IdiomContent[] = [
  idiom({ id:"daxingqidao",name:"大行其道",pinyin:"dà xíng qí dào",meaning:"某种观点或事物流行，成为一种风尚",category:"盛行泛滥",frequency:5,sentiment:"多含贬义",commonMistake:"误作褒义的广泛推广" }),
  idiom({ id:"weiranchengfeng",name:"蔚然成风",pinyin:"wèi rán chéng fēng",meaning:"一件事情逐渐发展盛行，形成良好风气",category:"盛行泛滥",frequency:5,sentiment:"褒义",antonyms:["销声匿迹"] }),
  idiom({ id:"fangxingweiai",name:"方兴未艾",pinyin:"fāng xīng wèi ài",meaning:"事物正在蓬勃发展，一时不会终止",category:"兴起发展",frequency:5,sentiment:"褒义" }),
  idiom({ id:"ruhuorutu",name:"如火如荼",pinyin:"rú huǒ rú tú",meaning:"事物发展旺盛、气氛热烈",category:"兴起发展",frequency:5,sentiment:"褒义" }),
  idiom({ id:"rixinyueyi",name:"日新月异",pinyin:"rì xīn yuè yì",meaning:"发展进步很快，不断出现新事物",category:"兴起发展",frequency:5,sentiment:"褒义" }),
  idiom({ id:"gegudingxin",name:"革故鼎新",pinyin:"gé gù dǐng xīn",meaning:"除去旧的，建立新的",category:"文化革新",frequency:5,sentiment:"褒义",synonyms:["推陈出新"] }),
  idiom({ id:"tuichenchuxin",name:"推陈出新",pinyin:"tuī chén chū xīn",meaning:"去掉旧事物的糟粕，创造出新的事物",category:"文化革新",frequency:5,sentiment:"褒义",synonyms:["革故鼎新"] }),
  idiom({ id:"fengmaolinjiao",name:"凤毛麟角",pinyin:"fèng máo lín jiǎo",meaning:"珍贵而稀少的人或事物",category:"数量多少",frequency:5,sentiment:"褒义",synonyms:["屈指可数"],antonyms:["不胜枚举"] }),
  idiom({ id:"bushengmeiju",name:"不胜枚举",pinyin:"bù shèng méi jǔ",meaning:"数量很多，无法一一列举",category:"数量多少",frequency:5,antonyms:["凤毛麟角","屈指可数"] }),
  idiom({ id:"qianyimohua",name:"潜移默化",pinyin:"qián yí mò huà",meaning:"思想或性格在不知不觉中受到感染而变化",category:"影响教育",frequency:5,appliesTo:"思想、性格或习惯",sentiment:"中性" }),
  idiom({ id:"chizhiyiheng",name:"持之以恒",pinyin:"chí zhī yǐ héng",meaning:"长久坚持下去",category:"坚持积累",frequency:5,sentiment:"褒义",synonyms:["坚持不懈"] }),
  idiom({ id:"houjibofa",name:"厚积薄发",pinyin:"hòu jī bó fā",meaning:"长期充分积累后再稳健地发挥出来",category:"坚持积累",frequency:5,sentiment:"褒义" }),
  idiom({ id:"shebenzhuimo",name:"舍本逐末",pinyin:"shě běn zhú mò",meaning:"不抓根本环节，只在枝节上下功夫",category:"主次根本",frequency:5,sentiment:"贬义",synonyms:["本末倒置"] }),
  idiom({ id:"benmodaozhi",name:"本末倒置",pinyin:"běn mò dào zhì",meaning:"把主要和次要、根本和枝节的位置弄颠倒",category:"主次根本",frequency:5,sentiment:"贬义" }),
  idiom({ id:"daxiangjingting",name:"大相径庭",pinyin:"dà xiāng jìng tíng",meaning:"彼此相差很大，完全不同",category:"差距差别",frequency:5,antonyms:["如出一辙"] }),
  idiom({ id:"yicuerjiu",name:"一蹴而就",pinyin:"yī cù ér jiù",meaning:"事情轻而易举，一下子就能完成",category:"迅速及时",frequency:5,commonMistake:"常用于否定句，强调复杂事情不能一下完成",correctExample:"能力培养不可能一蹴而就，需要长期训练。" }),
  idiom({ id:"yizhenjianxue",name:"一针见血",pinyin:"yī zhēn jiàn xiě",meaning:"说话或文章直截了当，切中要害",category:"要害适当",frequency:4,sentiment:"褒义",appliesTo:"言论、文章或分析" }),
  idiom({ id:"yinuoqianjin",name:"一诺千金",pinyin:"yī nuò qiān jīn",meaning:"说话算数，信用极高",category:"诚信典故",frequency:4,sentiment:"褒义",source:"《史记·季布栾布列传》",person:"季布",event:"季布一诺",dynasty:"西汉",memoryTip:"季布的一句承诺，比千金更贵" }),
  idiom({ id:"pofuchenzhou",name:"破釜沉舟",pinyin:"pò fǔ chén zhōu",meaning:"下定决心，不顾一切干到底",category:"战事策略",frequency:4,sentiment:"褒义",source:"《史记·项羽本纪》",person:"项羽",event:"巨鹿之战",dynasty:"秦末" }),
  idiom({ id:"zhishangtanbing",name:"纸上谈兵",pinyin:"zhǐ shàng tán bīng",meaning:"空谈理论，不能解决实际问题",category:"战事策略",frequency:4,sentiment:"贬义",source:"《史记·廉颇蔺相如列传》",person:"赵括",event:"长平之战",dynasty:"战国" }),
  idiom({ id:"wangmeizhike",name:"望梅止渴",pinyin:"wàng méi zhǐ kě",meaning:"用空想或假象安慰自己",category:"方法眼光",frequency:4,sentiment:"中性",source:"《世说新语·假谲》",person:"曹操",event:"行军望梅",dynasty:"东汉" }),
  idiom({ id:"tuibisanshe",name:"退避三舍",pinyin:"tuì bì sān shè",meaning:"主动退让，不与人相争",category:"战事策略",frequency:3,source:"《左传·僖公二十三年》",person:"重耳",event:"城濮之战前践诺",dynasty:"春秋" }),
  idiom({ id:"zhiluweima",name:"指鹿为马",pinyin:"zhǐ lù wéi mǎ",meaning:"故意颠倒黑白，混淆是非",category:"道理争议",frequency:3,sentiment:"贬义",source:"《史记·秦始皇本纪》",person:"赵高",event:"朝堂试探群臣",dynasty:"秦" }),
  idiom({ id:"weiweijiuzhao",name:"围魏救赵",pinyin:"wéi wèi jiù zhào",meaning:"攻击敌人后方以迫使其撤回的策略",category:"战事策略",frequency:3,source:"《史记·孙子吴起列传》",person:"孙膑",event:"桂陵之战",dynasty:"战国" }),
  idiom({ id:"maosuizijian",name:"毛遂自荐",pinyin:"máo suì zì jiàn",meaning:"自告奋勇，主动推荐自己",category:"杰出优秀",frequency:3,sentiment:"褒义",source:"《史记·平原君虞卿列传》",person:"毛遂",event:"楚廷订盟",dynasty:"战国" })
];

export const worlds: World[] = [
  { id:"culture",name:"文化万象",subtitle:"从公考高频成语走入千年文脉",theme:"culture",progress:0,free:true },
  { id:"history",name:"华夏纪年",subtitle:"沿时间长河，重建人物与事件",theme:"history",progress:0,free:false },
  { id:"numbers",name:"数字工坊",subtitle:"把公式锻造成快速判断力",theme:"numbers",progress:0,free:false }
];
export const levels: Level[] = [
  { id:"idiom-1",worldId:"culture",chapterId:"idiom-foundation",name:"1-1 侦察关",kind:"lesson",status:"active",sort:1,questionCount:10,passScore:60,summary:"认识高频成语与基本释义" },
  { id:"idiom-2",worldId:"culture",chapterId:"idiom-foundation",name:"1-2 基础关",kind:"lesson",status:"locked",sort:2,questionCount:10,passScore:60,summary:"判断成语的正确使用场景" },
  { id:"idiom-3",worldId:"culture",chapterId:"idiom-foundation",name:"1-3 辨析关",kind:"lesson",status:"locked",sort:3,questionCount:10,passScore:60,summary:"识别近义、反义与易错含义" },
  { id:"idiom-4",worldId:"culture",chapterId:"idiom-foundation",name:"1-4 关系关",kind:"lesson",status:"locked",sort:4,questionCount:10,passScore:60,summary:"连接成语、人物、事件与朝代" },
  { id:"idiom-5",worldId:"culture",chapterId:"idiom-foundation",name:"1-5 应用关",kind:"lesson",status:"locked",sort:5,questionCount:10,passScore:60,summary:"在公考与工作语境中准确使用" },
  { id:"idiom-boss",worldId:"culture",chapterId:"idiom-foundation",name:"1-6 Boss · 成语试炼",kind:"boss",status:"locked",sort:6,questionCount:15,passScore:60,summary:"综合释义、语境、辨析与典故关系" }
];

export type SecretQuestion = { id:string; levelId:string; knowledgeId:string; public:PublicQuestion; answer:SubmittedAnswer; explanation:AnswerExplanation; difficulty:number; kind:"basic"|"relation"|"application" };
const optionIds = ["A","B","C","D"];
function choices(correct: IdiomContent, distractors: IdiomContent[]) { return [correct,...distractors].map((item,index)=>({id:optionIds[index]!,text:item.meaning})); }
function explanation(item: IdiomContent): AnswerExplanation { return { summary:item.meaning,whyCorrect:`“${item.name}”的核心语义是：${item.meaning}。`,whyUserAnswerWrong:"该选项忽略了成语的语义对象、感情色彩或使用条件。",commonMistake:item.commonMistake,usageScene:item.correctScene,relatedKnowledge:item.synonyms.map(name=>({id:name,name,relation:"近义辨析"})),memoryTip:item.memoryTip }; }
function definitionQuestion(item: IdiomContent,index:number,levelId:string,prefix="def"):SecretQuestion { const others=[1,2,3].map(offset=>idioms[(index+offset*7)%idioms.length]!); const options=choices(item,others); return {id:`${prefix}-${item.id}`,levelId,knowledgeId:item.id,public:{questionId:`${prefix}-${item.id}`,knowledgeId:item.id,type:"single_choice",stem:`“${item.name}”最准确的含义是？`,options},answer:"A",explanation:explanation(item),difficulty:item.difficulty,kind:"basic"}; }
function sceneQuestion(item: IdiomContent,levelId:string,prefix="scene"):SecretQuestion { return {id:`${prefix}-${item.id}`,levelId,knowledgeId:item.id,public:{questionId:`${prefix}-${item.id}`,knowledgeId:item.id,type:"scene_judgment",stem:`判断“${item.name}”使用是否恰当`,scene:item.correctExample,options:[{id:"A",text:"恰当"},{id:"B",text:"不恰当"}]},answer:"A",explanation:explanation(item),difficulty:Math.min(5,item.difficulty+1),kind:"application"}; }
const relationIdioms=idioms.filter(item=>item.person!=="—");
function relationQuestion(index:number,levelId:string,prefix="rel"):SecretQuestion { const selected=[0,1,2].map(offset=>relationIdioms[(index+offset)%relationIdioms.length]!); const leftItems=selected.map(item=>({id:item.id,text:item.name})); const rightItems=[...selected].reverse().map(item=>({id:`person-${item.id}`,text:item.person})); const answer=selected.map(item=>({leftId:item.id,rightId:`person-${item.id}`})); return {id:`${prefix}-${index+1}`,levelId,knowledgeId:selected[0]!.id,public:{questionId:`${prefix}-${index+1}`,knowledgeId:selected[0]!.id,type:"relation_match",stem:"把成语与对应的典故人物连接起来",leftItems,rightItems},answer,explanation:{summary:"这些成语都来自真实历史典故。",whyCorrect:selected.map(item=>`${item.name}—${item.person}`).join("；"),commonMistake:"只记成语含义，没有建立人物与事件联系。",memoryTip:"按人物—事件—成语三点成线记忆。"},difficulty:3,kind:"relation"}; }
export const questions: SecretQuestion[] = [
  ...idioms.slice(0,10).map((item,index)=>definitionQuestion(item,index,"idiom-1")),
  ...idioms.slice(0,10).map(item=>sceneQuestion(item,"idiom-2")),
  ...idioms.slice(10,20).map((item,index)=>definitionQuestion(item,index+10,"idiom-3","distinguish")),
  ...Array.from({length:10},(_,index)=>relationQuestion(index,"idiom-4")),
  ...idioms.slice(10,20).map(item=>sceneQuestion(item,"idiom-5","apply")),
  ...idioms.slice(20,25).map((item,index)=>definitionQuestion(item,index+20,"idiom-boss","boss-def")),
  ...idioms.slice(20,25).map(item=>sceneQuestion(item,"idiom-boss","boss-scene")),
  ...Array.from({length:5},(_,index)=>relationQuestion(index+3,"idiom-boss","boss-rel"))
];
export function publicQuestion(question: SecretQuestion) { return question.public; }
export function questionsForLevel(levelId:string) { return questions.filter(question=>question.levelId===levelId); }
