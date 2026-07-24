-- 文化万象：汉字典籍、戏曲艺术与古代科技文献。内容只写入 Supabase。

insert into public.chapters (id,world_id,name,sort,is_free,published,version,description,intro,boss_name,boss_description) values
  ('culture-classics','典籍与舞台',2,true,true,1,'汉字、戏曲、典籍与农工智慧 · 20 道训练题','从一部书、一种写法、一段身段开始，看见文化如何被保存和传承。','典籍舞台试炼','分清作者、体例、艺术门类与作品价值。')
on conflict (id) do update set world_id=excluded.world_id,name=excluded.name,sort=excluded.sort,is_free=excluded.is_free,published=excluded.published,version=excluded.version,description=excluded.description,intro=excluded.intro,boss_name=excluded.boss_name,boss_description=excluded.boss_description;

insert into public.levels (id,chapter_id,name,kind,sort,pass_score,reward_xp,published,version,summary) values
  ('culture-classics-1','culture-classics','2-1 字里春秋','lesson',1,60,0,true,1,'汉字源流、书法与经典文献'),
  ('culture-classics-2','culture-classics','2-2 舞台与工艺','lesson',2,60,0,true,1,'戏曲、农业与手工业技术'),
  ('culture-classics-boss','culture-classics','2-3 Boss · 文脉辨析','boss',3,60,0,true,1,'在作者、作品、门类和功能之间完成交叉判断')
on conflict (id) do update set chapter_id=excluded.chapter_id,name=excluded.name,kind=excluded.kind,sort=excluded.sort,pass_score=excluded.pass_score,reward_xp=excluded.reward_xp,published=excluded.published,version=excluded.version,summary=excluded.summary;

insert into public.knowledge_points (id,name,summary,core_fact,category,common_mistake,memory_tip,published,version) values
  ('culture-shuowen','说文解字','东汉许慎编撰的字书，是研究汉字形体的重要典籍。','《说文解字》作者为许慎，以小篆为主要字形，首创部首分类法。','汉字文化','把《说文解字》与《康熙字典》的作者、时代混淆。','东汉许慎说文解字，部首分类看字形。',true,1),
  ('culture-six-methods','六书','传统汉字构形和用字理论，包括象形、指事、会意、形声、转注、假借。','六书为象形、指事、会意、形声、转注、假借。','汉字文化','把“形声”误作六书之外的分类，或漏掉转注、假借。','象指会形，转假补齐六书。',true,1),
  ('culture-kangxi','康熙字典','清代编纂的大型字典，沿用二百一十四部首体系。','《康熙字典》采用二百一十四部首，按部首和笔画检字。','汉字文化','把《康熙字典》的二百一十四部首错记为《说文解字》的五百四十部首。','说文五百四十，康熙二百一十四。',true,1),
  ('culture-opera-four-skills','戏曲四功五法','戏曲表演的四功是唱、念、做、打，五法通常指手、眼、身、法、步。','唱念做打是戏曲四项基本功。','戏曲艺术','把“唱念做打”当作剧种名称或把“念”误解为纯粹朗读。','唱是声、念是白、做演形、打显武。',true,1),
  ('culture-kunqu','昆曲','昆曲以水磨腔著称，是中国古典戏曲的重要剧种。','昆曲的代表性唱腔为水磨腔，《牡丹亭》是其代表作品之一。','戏曲艺术','把水磨腔错配给京剧，把变脸错配给昆曲。','水磨腔配昆曲，牡丹亭里看游园。',true,1),
  ('culture-jingju','京剧','京剧综合唱、念、做、打等表演体系，常见唱腔有西皮、二黄。','京剧常见唱腔为西皮、二黄。','戏曲艺术','把京剧的西皮、二黄与昆曲水磨腔混淆。','京剧西皮二黄，昆曲水磨。',true,1),
  ('culture-shuijingzhu','水经注','北魏郦道元所著地理学名著，以水系为纲记录山川、地理和历史遗存。','《水经注》作者是北魏郦道元。','科技典籍','把《水经注》误认为沈括或宋应星著作。','水经注看山川，北魏郦道元。',true,1),
  ('culture-mengxi','梦溪笔谈','北宋沈括的笔记体科学著作，涉及天文、数学、地质等。','《梦溪笔谈》作者为北宋沈括。','科技典籍','把《梦溪笔谈》与《天工开物》《水经注》错配。','北宋沈括梦溪笔谈，百科笔记记科学。',true,1),
  ('culture-tiangong','天工开物','明末宋应星撰写的农业和手工业技术著作。','《天工开物》作者为宋应星，记录农业、纺织、冶炼等生产技术。','科技典籍','把宋应星与沈括、郦道元或贾思勰混淆。','天工开物宋应星，农工技术一书明。',true,1),
  ('culture-agriculture-books','农学典籍','《齐民要术》《农政全书》等记录中国古代农业经验。','《齐民要术》作者为贾思勰，《农政全书》作者为徐光启。','科技典籍','把两部农书的作者与时代混淆。','齐民贾思勰，农政徐光启。',true,1)
on conflict (id) do update set name=excluded.name,summary=excluded.summary,core_fact=excluded.core_fact,category=excluded.category,common_mistake=excluded.common_mistake,memory_tip=excluded.memory_tip,published=excluded.published,version=excluded.version;

insert into public.knowledge_relations (source_id,target_id,relation_type,label,weight) values
  ('culture-shuowen','culture-six-methods','explains','六书释字',1),
  ('culture-shuowen','culture-kangxi','evolves_to','部首检字演进',1),
  ('culture-opera-four-skills','culture-kunqu','applies_to','戏曲表演',1),
  ('culture-opera-four-skills','culture-jingju','applies_to','戏曲表演',1),
  ('culture-shuijingzhu','culture-mengxi','context','科技典籍',1),
  ('culture-mengxi','culture-tiangong','context','古代科学记录',1),
  ('culture-tiangong','culture-agriculture-books','context','生产技术文献',1),
  ('culture-kunqu','culture-festivals','context','传统艺术',1)
on conflict (source_id,target_id,relation_type) do update set label=excluded.label,weight=excluded.weight;

with seed(id,knowledge_id,level_id,stem,a,b,c,d,answer,summary,why_correct,why_wrong,mistake,tip,difficulty) as (values
  ('culture-classics-01','culture-shuowen','culture-classics-1','《说文解字》的作者是？','许慎','班固','司马迁','郦道元','A','正确答案：许慎','《说文解字》由东汉许慎编撰，是汉字学重要典籍。','班固著《汉书》，司马迁著《史记》，郦道元著《水经注》。','只记书名，未把作者和学科位置对应起来。','东汉许慎说文解字。',1),
  ('culture-classics-02','culture-shuowen','culture-classics-1','《说文解字》在汉字学上的重要贡献是？','首创部首分类法','首次采用二百一十四部首','首创活字印刷','首次统一简化字','A','正确答案：首创部首分类法','许慎以部首统摄字形，奠定了传统部首检字的基础。','二百一十四部首与《康熙字典》体系有关；印刷和简化字并非本书贡献。','把后世字典制度倒灌给东汉典籍。','说文先分部首。',2),
  ('culture-classics-03','culture-six-methods','culture-classics-1','下列属于“六书”的是？','象形、指事、会意、形声、转注、假借','象形、会意、楷书、行书、草书、隶书','诗、书、礼、易、春秋、乐','宫、商、角、徵、羽、变宫','A','正确答案：象形、指事、会意、形声、转注、假借','六书是传统的汉字构形和用字理论。','其余选项分别是书体、经书或音律概念，不是六书。','看到六个并列词便按数量猜测。','象指会形，转假补齐。',2),
  ('culture-classics-04','culture-kangxi','culture-classics-1','《康熙字典》采用的部首数是？','五百四十部','二百一十四部','一百八十九部','六十部','B','正确答案：二百一十四部','《康熙字典》沿用并固定了二百一十四部首体系。','五百四十部对应《说文解字》的部首系统。','把不同时代字典的部首数混在一起。','说文540，康熙214。',2),
  ('culture-classics-05','culture-shuijingzhu','culture-classics-1','《水经注》的作者是？','宋应星','郦道元','沈括','贾思勰','B','正确答案：郦道元','《水经注》是北魏郦道元的地理学名著。','宋应星著《天工开物》，沈括著《梦溪笔谈》，贾思勰著《齐民要术》。','科技典籍多而作者对不上。','水经注，郦道元。',1),
  ('culture-classics-06','culture-mengxi','culture-classics-1','下列“著作—作者”对应正确的是？','《梦溪笔谈》—沈括','《梦溪笔谈》—宋应星','《水经注》—许慎','《天工开物》—司马光','A','正确答案：《梦溪笔谈》—沈括','沈括在北宋写成《梦溪笔谈》，涵盖多门科学观察。','宋应星、许慎、司马光分别对应其他典籍或史书。','只记住作品性质，忽略作者。','梦溪沈括，天工宋应星。',2),
  ('culture-classics-07','culture-tiangong','culture-classics-1','《天工开物》主要记录的是？','农业和手工业生产技术','帝王世系与战争','诗歌格律','佛教戒律','A','正确答案：农业和手工业生产技术','《天工开物》系统记录农业、纺织、冶炼等生产技术。','史书、诗论和宗教典籍的功能均不符合该书定位。','把“开物”误解为自然哲学空泛概念。','天工开物，农工技术。',2),
  ('culture-classics-08','culture-agriculture-books','culture-classics-1','《齐民要术》的作者是？','徐光启','贾思勰','李时珍','宋应星','B','正确答案：贾思勰','北魏贾思勰撰写《齐民要术》，总结农业生产经验。','徐光启著《农政全书》，李时珍著《本草纲目》，宋应星著《天工开物》。','将古代科技著作横向错配。','齐民贾思勰。',1),
  ('culture-classics-09','culture-agriculture-books','culture-classics-1','《农政全书》的作者是？','贾思勰','徐光启','沈括','陈寿','B','正确答案：徐光启','《农政全书》由明代徐光启编撰，是农业科学重要著作。','贾思勰对应《齐民要术》，其余两人不是该书作者。','把同属农学的书误认为同一作者。','农政全书徐光启。',2),
  ('culture-classics-10','culture-six-methods','culture-classics-1','“日、月、山”这类字的造字方法通常属于？','象形','指事','会意','假借','A','正确答案：象形','象形字以形象描摹事物的外形为基本特点。','指事用符号提示抽象意义，会意组合偏旁表示意义，假借借用同音或近音字。','仅凭字形简单而不区分构形方式。','看形画物，多是象形。',2),
  ('culture-classics-11','culture-opera-four-skills','culture-classics-2','中国戏曲“四功”是指？','唱念做打','生旦净丑','手眼身法步','宫商角徵羽','A','正确答案：唱念做打','唱、念、做、打是戏曲表演的四项基本功。','生旦净丑是行当；手眼身法步是五法；宫商角徵羽是五声音阶。','把戏曲的几个“五/四项并列概念”混淆。','唱念做打是四功。',1),
  ('culture-classics-12','culture-opera-four-skills','culture-classics-2','戏曲表演中“做”主要指？','声乐演唱','念白语言','形体和动作表演','武器制作','C','正确答案：形体和动作表演','“做”强调以程式化身段、动作表现人物和情境。','唱对应声乐，念对应念白，武打属于“打”的范围。','把日常汉字含义直接代入术语。','做演形，打显武。',2),
  ('culture-classics-13','culture-kunqu','culture-classics-2','下列与昆曲对应正确的是？','水磨腔','变脸','西皮、二黄','二人转','A','正确答案：水磨腔','水磨腔是昆曲最具代表性的唱腔。','变脸常与川剧相关，西皮二黄常见于京剧。','把剧种的标志性艺术符号混为一团。','昆曲水磨腔。',1),
  ('culture-classics-14','culture-kunqu','culture-classics-2','《牡丹亭》通常与下列哪一剧种关联最密切？','昆曲','京剧','豫剧','评剧','A','正确答案：昆曲','《牡丹亭》是汤显祖作品，也是昆曲经典剧目。','京剧、豫剧、评剧各有代表剧目，但此题考查《牡丹亭》的昆曲传统。','把“戏曲名作”泛化到所有剧种。','牡丹亭，昆曲游园。',2),
  ('culture-classics-15','culture-jingju','culture-classics-2','京剧常见的两种主要唱腔是？','水磨腔、梆子腔','西皮、二黄','高腔、昆腔','花腔、帮腔','B','正确答案：西皮、二黄','西皮和二黄是京剧常见的基本唱腔。','水磨腔对应昆曲，其他名称并非本题的固定组合。','只记住“京剧唱腔丰富”而没掌握核心名称。','京剧西皮二黄。',2),
  ('culture-classics-16','culture-opera-four-skills','culture-classics-2','下列关于戏曲表演的表述，正确的是？','“打”主要指武打技艺','“念”只用于无声动作','“唱”与音乐无关','“做”只指服装制作','A','正确答案：“打”主要指武打技艺','戏曲四功中，“打”指武打及相关技艺表现。','念是语言艺术，唱与音乐相关，做是形体表演。','把舞台术语按照字面随意理解。','唱声念白，做形打武。',2),
  ('culture-classics-boss-01','culture-shuijingzhu','culture-classics-boss','下列“著作—作者—领域”对应正确的是？','《水经注》—郦道元—地理','《梦溪笔谈》—宋应星—医学','《天工开物》—许慎—史学','《齐民要术》—司马迁—天文','A','正确答案：《水经注》—郦道元—地理','《水经注》以水系和地理记录为核心，作者为郦道元。','其他选项将作者或领域交叉错配。','三元对应题只核对其中一个要素。','水经郦道元，地理记山川。',3),
  ('culture-classics-boss-02','culture-tiangong','culture-classics-boss','下列关于古代科技典籍的判断，正确的是？','《天工开物》重在农业和手工业技术','《说文解字》主要记载水系','《梦溪笔谈》是西汉断代史','《农政全书》作者是贾思勰','A','正确答案：《天工开物》重在农业和手工业技术','《天工开物》系统记录生产技术，是认识明代农工技术的重要文献。','其余选项分别错在书的性质、时代或作者。','将“科技典籍”笼统记忆，未做作品定位。','天工农工，梦溪科学，说文字形。',3),
  ('culture-classics-boss-03','culture-opera-four-skills','culture-classics-boss','“唱念做打”和“手眼身法步”的关系是？','前者为四功，后者为五法','前者为五法，后者为四功','两者都是京剧唱腔','两者都是古代字书检索法','A','正确答案：前者为四功，后者为五法','戏曲表演常以“四功五法”概括基本训练体系。','四功和五法并非互换概念，也与唱腔和检字法无关。','将相近的成套术语颠倒。','四功唱念做打，五法手眼身法步。',3),
  ('culture-classics-boss-04','culture-kangxi','culture-classics-boss','下列关于部首检字演变的表述，正确的是？','《说文解字》部首多，《康熙字典》采用二百一十四部首','《康熙字典》早于《说文解字》','许慎编撰《天工开物》','二百一十四部首是六书的类别数量','A','正确答案：《说文解字》部首多，《康熙字典》采用二百一十四部首','从《说文解字》的五百四十部到《康熙字典》的二百一十四部，体现了检字体系演进。','其余选项混淆时代、作者或概念类别。','把部首数当作六书数，或忘记时代先后。','说文540，康熙214，六书只有六类。',3)
)
insert into public.questions (id,knowledge_id,level_id,question_type,stem,options,correct_answer,explanation,difficulty,published,version)
select id,knowledge_id,level_id,'single_choice',stem,
  jsonb_build_object('options',jsonb_build_array(jsonb_build_object('id','A','text',a),jsonb_build_object('id','B','text',b),jsonb_build_object('id','C','text',c),jsonb_build_object('id','D','text',d))),
  to_jsonb(answer),jsonb_build_object('summary',summary,'whyCorrect',why_correct,'whyUserAnswerWrong',why_wrong,'commonMistake',mistake,'memoryTip',tip),difficulty,true,1
from seed
on conflict (id) do update set knowledge_id=excluded.knowledge_id,level_id=excluded.level_id,question_type=excluded.question_type,stem=excluded.stem,options=excluded.options,correct_answer=excluded.correct_answer,explanation=excluded.explanation,difficulty=excluded.difficulty,published=excluded.published,version=excluded.version;

grant select on table public.knowledge_relations to service_role;
