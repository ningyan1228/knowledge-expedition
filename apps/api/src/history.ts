import type { AnswerExplanation, PublicQuestion, SubmittedAnswer } from "@expedition/shared";
import type { SecretQuestion } from "./data.js";

export type HistoryItem={id:string;name:string;statement:string;category:"先秦秦汉"|"魏晋隋唐"|"宋元"|"明清"|"近代转型"|"革命与新中国";tip:string};
const fact=(id:string,name:string,statement:string,category:HistoryItem["category"],tip:string):HistoryItem=>({id,name,statement,category,tip});

// 本世界只收录历史时间线与制度事件；不复用“公考常识”或“文化万象”的题目。
export const historyItems:HistoryItem[]=[
  fact("zhou-feudal","分封制","西周实行分封制，以巩固对广大地区的统治。","先秦秦汉","西周分封，形成封邦建国格局。"),
  fact("zhou-rites","礼乐制度","西周礼乐制度与宗法制度相互配合，维护等级秩序。","先秦秦汉","宗法定亲疏，礼乐定秩序。"),
  fact("warring-seven","战国七雄","战国七雄是齐、楚、燕、韩、赵、魏、秦。","先秦秦汉","齐楚燕韩赵魏秦，七雄并立。"),
  fact("shangyang","商鞅变法","商鞅在秦孝公支持下变法，推动秦国富国强兵。","先秦秦汉","商鞅变法的舞台在秦国。"),
  fact("dujiangyan","都江堰","都江堰由战国时期秦国蜀郡太守李冰主持修建。","先秦秦汉","都江堰对应李冰，而非大禹。"),
  fact("muyebattle","牧野之战","牧野之战中，周武王击败商纣王，商朝灭亡。","先秦秦汉","牧野伐纣，周取代商。"),
  fact("qin-county","郡县制","秦朝在全国推行郡县制，加强中央对地方的直接管理。","先秦秦汉","郡县制是秦加强中央集权的重要制度。"),
  fact("qin-standard","秦朝统一措施","秦始皇统一文字、货币、度量衡，便利政令推行和经济交流。","先秦秦汉","书同文、车同轨、统一度量衡。"),
  fact("chu-han","楚汉之争","楚汉之争的最终结果是刘邦战胜项羽，建立汉朝。","先秦秦汉","楚汉相争，刘邦胜出。"),
  fact("han-wudi-confucian","罢黜百家","汉武帝接受董仲舒建议，实行“罢黜百家，独尊儒术”。","先秦秦汉","汉武帝与董仲舒、独尊儒术相连。"),

  fact("wenjing","文景之治","文景之治出现在西汉文帝、景帝时期，以轻徭薄赋、休养生息著称。","魏晋隋唐","文景在西汉，休养生息。"),
  fact("guangwu","光武中兴","光武中兴是东汉光武帝刘秀在位时出现的政治经济恢复局面。","魏晋隋唐","光武帝刘秀重建东汉。"),
  fact("caodu","官渡之战","官渡之战中曹操以少胜多击败袁绍，奠定统一北方的基础。","魏晋隋唐","官渡：曹操对袁绍。"),
  fact("chibi","赤壁之战","赤壁之战中孙刘联军击败曹操，三国鼎立局面由此逐步形成。","魏晋隋唐","赤壁是孙刘联军抗曹。"),
  fact("western-jin","西晋统一","西晋在280年灭吴，结束三国分立局面，实现短暂统一。","魏晋隋唐","西晋灭吴，三国终结。"),
  fact("feishui","淝水之战","淝水之战中东晋以少胜多击败前秦，保住江南。","魏晋隋唐","淝水：东晋胜前秦。"),
  fact("xiaowen","孝文帝改革","北魏孝文帝推行汉化改革，并将都城迁到洛阳。","魏晋隋唐","孝文帝改革的关键词是汉化、迁洛阳。"),
  fact("sui-unify","隋朝统一","隋文帝于589年灭陈，结束南北朝长期分裂局面。","魏晋隋唐","589年隋灭陈，南北重归统一。"),
  fact("keju","科举制度","科举制度创立于隋朝，以考试选拔官员。","魏晋隋唐","隋创科举，唐朝完善。"),
  fact("tang-xuanwu","玄武门之变","玄武门之变后，李世民即位，成为唐太宗。","魏晋隋唐","玄武门之后是唐太宗李世民。"),

  fact("kaiyuan","开元盛世","开元盛世出现在唐玄宗前期，是唐朝国力强盛时期。","宋元","开元对应唐玄宗前期。"),
  fact("anshi","安史之乱","安史之乱是唐朝由盛转衰的重大转折点。","宋元","安史之乱使唐朝由盛转衰。"),
  fact("tubo","唐蕃关系","文成公主入藏反映了唐朝与吐蕃之间的友好交往。","宋元","文成公主对应唐蕃关系。"),
  fact("chenqiao","陈桥兵变","陈桥兵变后赵匡胤建立北宋。","宋元","陈桥兵变，黄袍加身，赵匡胤建宋。"),
  fact("wanganshi","王安石变法","王安石变法发生在北宋神宗时期，目的在于富国强兵。","宋元","王安石变法属于北宋改革。"),
  fact("jingkang","靖康之变","靖康之变后北宋灭亡，宋室南渡，南宋建立。","宋元","靖康之变是北宋灭亡节点。"),
  fact("jiaozi","交子","交子出现在北宋，是世界上较早的纸币之一。","宋元","北宋交子，纸币先声。"),
  fact("yuan-found","元朝建立","1271年，忽必烈定国号为元。","宋元","忽必烈建立元朝，定国号元。"),
  fact("xingprovince","行省制度","元朝行省制度对后世地方行政制度影响深远。","宋元","行省制度的典型朝代是元朝。"),
  fact("yuan-unify","元朝统一","1279年元朝灭南宋，完成全国统一。","宋元","1279年元灭南宋，统一全国。"),

  fact("ming-found","明朝建立","1368年朱元璋建立明朝，年号洪武。","明清","朱元璋建明，年号洪武。"),
  fact("yongle-capital","迁都北京","明成祖朱棣迁都北京，称北京为京师。","明清","迁都北京的是明成祖朱棣。"),
  fact("zhenghe","郑和下西洋","郑和下西洋发生在明朝前期，展示了当时较强的航海能力。","明清","郑和下西洋属于明朝前期。"),
  fact("qijiguang","戚继光抗倭","明朝戚继光组织抗倭斗争，保卫东南沿海。","明清","戚继光的功绩是抗倭。"),
  fact("lishizhen","本草纲目","《本草纲目》的作者是明代医学家李时珍。","明清","李时珍写《本草纲目》。"),
  fact("zhangjuzheng","一条鞭法","张居正推行一条鞭法，促进赋役制度改革。","明清","一条鞭法与张居正相连。"),
  fact("qing-entry","清军入关","1644年清军入关，此后逐步建立对全国的统治。","明清","1644年是清军入关的年份。"),
  fact("zhengchenggong","郑成功收复台湾","1662年郑成功收复台湾，结束荷兰殖民者在台湾的统治。","明清","郑成功收复台湾，驱逐荷兰殖民者。"),
  fact("kangxi","康熙平定三藩","康熙帝平定三藩之乱，巩固了统一的多民族国家。","明清","平三藩是在康熙时期。"),
  fact("linzexu","虎门销烟","1839年林则徐在虎门销烟，显示了禁烟决心。","明清","虎门销烟的主持者是林则徐。"),

  fact("opium-war","鸦片战争","1840年鸦片战争爆发，中国开始沦为半殖民地半封建社会。","近代转型","1840年鸦片战争是中国近代史开端。"),
  fact("nanjing-treaty","南京条约","《南京条约》是中国近代史上第一个不平等条约。","近代转型","第一个不平等条约是《南京条约》。"),
  fact("taiping","太平天国运动","太平天国运动于1851年爆发，是一次规模巨大的农民战争。","近代转型","1851年，太平天国运动爆发。"),
  fact("yangwu","洋务运动","洋务运动提出“自强”“求富”，主张学习西方先进技术。","近代转型","洋务口号：自强、求富。"),
  fact("jiawu","甲午中日战争","甲午中日战争爆发于1894年，清政府战败。","近代转型","1894年甲午中日战争。"),
  fact("maguan","马关条约","《马关条约》是在甲午中日战争清政府战败后签订的。","近代转型","甲午战败后，签订《马关条约》。"),
  fact("wuxu","戊戌变法","戊戌变法发生于1898年，主张变法图强。","近代转型","1898年戊戌变法。"),
  fact("newculture","新文化运动","新文化运动提倡民主与科学，反对旧礼教和旧文学。","近代转型","新文化运动的旗帜是民主与科学。"),
  fact("mayfourth","五四运动","五四运动爆发于1919年，是一场彻底反帝反封建的爱国运动。","近代转型","1919年五四运动。"),
  fact("cpc-first","中共一大","中国共产党第一次全国代表大会于1921年召开。","近代转型","1921年中共一大，中国共产党诞生。"),

  fact("nanchang","南昌起义","南昌起义发生于1927年，打响了武装反抗国民党反动派的第一枪。","革命与新中国","1927年南昌起义，人民军队重要起点。"),
  fact("qiushou","秋收起义","秋收起义后，毛泽东率部向井冈山进军。","革命与新中国","秋收起义后上井冈山。"),
  fact("jinggangshan","井冈山革命根据地","井冈山革命根据地是中国第一个农村革命根据地。","革命与新中国","井冈山是第一个农村革命根据地。"),
  fact("longmarch","红军长征","中央红军长征开始于1934年，结束于1936年。","革命与新中国","长征：1934年出发，1936年胜利结束。"),
  fact("zunyi","遵义会议","遵义会议在长征途中召开，确立了毛泽东在党中央和红军的领导地位。","革命与新中国","遵义会议是长征中的重要转折。"),
  fact("xianincident","西安事变","西安事变和平解决，成为时局转换的枢纽，促进抗日民族统一战线初步形成。","革命与新中国","西安事变和平解决，促进联合抗日。"),
  fact("lugouqiao","七七事变","1937年七七事变后，中国全民族抗战开始。","革命与新中国","七七事变标志全民族抗战开始。"),
  fact("hundredreg","百团大战","百团大战发生于抗日战争时期，由彭德怀指挥。","革命与新中国","百团大战与彭德怀相连。"),
  fact("threecampaigns","三大战役","辽沈、淮海、平津三大战役基本消灭国民党军队主力。","革命与新中国","三大战役：辽沈、淮海、平津。"),
  fact("prc","新中国成立","1949年10月1日，中华人民共和国成立。","革命与新中国","1949年10月1日，新中国成立。")
];

const optionIds=["A","B","C","D"];
function hash(value:string){let result=2166136261;for(const char of value){result^=char.charCodeAt(0);result=Math.imul(result,16777619);}return result>>>0;}
function shuffle<T>(values:T[],seed:string){const output=[...values];let state=hash(seed);for(let index=output.length-1;index>0;index--){state=(Math.imul(state,1664525)+1013904223)>>>0;const target=state%(index+1);[output[index],output[target]]=[output[target]!,output[index]!];}return output;}
function levelFor(index:number){return index<10?"history-1":index<20?"history-2":index<30?"history-3":index<40?"history-4":index<50?"history-5":"history-boss";}
function createQuestion(item:HistoryItem,index:number):SecretQuestion{
  const same=historyItems.filter(candidate=>candidate.category===item.category&&candidate.id!==item.id);
  const distractors=[1,2,3].map(offset=>same[(index+offset*3)%same.length]!);
  const slots=shuffle([0,0,0,1,1,1,2,2,3,3],`${item.category}:answer-slots`);
  const correctIndex=slots[index%slots.length]!;
  const options=shuffle(distractors,`${item.id}:options`);options.splice(correctIndex,0,item);
  const answer=optionIds[correctIndex]!;
  const explanation:AnswerExplanation={summary:item.statement,whyCorrect:`“${item.name}”的正确表述是：${item.statement}`,whyUserAnswerWrong:"干扰项把相近的时代、人物或事件关系混在了一起，应回到准确的时间线判断。",commonMistake:`不要只凭名称猜测，要把“${item.name}”放回所属朝代与事件链。`,memoryTip:item.tip};
  const publicQuestion:PublicQuestion={questionId:`history-${item.id}`,knowledgeId:item.id,type:"single_choice",stem:`关于“${item.name}”，下列说法正确的是？`,options:options.map((option,optionIndex)=>({id:optionIds[optionIndex]!,text:option.statement}))};
  return {id:`history-${item.id}`,levelId:levelFor(index),knowledgeId:item.id,public:publicQuestion,answer,explanation,difficulty:index%5+1,kind:"basic"};
}

export const historyQuestions=historyItems.map(createQuestion);
