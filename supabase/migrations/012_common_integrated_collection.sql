-- 公考常识：国家象征、史学文献与传统医学的综合判断训练。内容只写入 Supabase。

insert into public.chapters (id,world_id,name,sort,is_free,published,version,description,intro,boss_name,boss_description) values
  ('common-integrated','common','知行万象',2,true,true,1,'国家象征、史学文献、传统医学与跨域判断 · 20 道训练题','把零散常识放进人物、文献、时间与制度的坐标中。','万象综合试炼','综合判断作品、人物、制度与国家象征的准确对应。')
on conflict (id) do update set world_id=excluded.world_id,name=excluded.name,sort=excluded.sort,is_free=excluded.is_free,published=excluded.published,version=excluded.version,description=excluded.description,intro=excluded.intro,boss_name=excluded.boss_name,boss_description=excluded.boss_description;

insert into public.levels (id,chapter_id,name,kind,sort,pass_score,reward_xp,published,version,summary) values
  ('common-integrated-1','common-integrated','2-1 国之象征','lesson',1,60,0,true,1,'国家象征与近现代文化常识'),
  ('common-integrated-2','common-integrated','2-2 典籍与医道','lesson',2,60,0,true,1,'史学文献、小说与传统医学'),
  ('common-integrated-boss','common-integrated','2-3 Boss · 万象综合','boss',3,60,0,true,1,'在时间、作者、体裁、人物和功能间完成综合辨析')
on conflict (id) do update set chapter_id=excluded.chapter_id,name=excluded.name,kind=excluded.kind,sort=excluded.sort,pass_score=excluded.pass_score,reward_xp=excluded.reward_xp,published=excluded.published,version=excluded.version,summary=excluded.summary;

insert into public.knowledge_points (id,name,summary,core_fact,category,common_mistake,memory_tip,published,version) values
  ('common-anthem','中华人民共和国国歌','《义勇军进行曲》由田汉作词、聂耳作曲，原为电影《风云儿女》主题曲。','《义勇军进行曲》是中华人民共和国国歌，田汉作词、聂耳作曲。','国家象征','把词作者和曲作者颠倒，或误认为其最初就是国歌。','田汉词，聂耳曲，义勇军进行曲。',true,1),
  ('common-sanguozhi','三国志','陈寿撰写的纪传体断代史，记载魏、蜀、吴三国历史。','《三国志》作者为陈寿，是纪传体断代史。','史学文献','把《三国志》正史与《三国演义》小说混淆。','陈寿西晋撰三志，纪传断代魏蜀吴。',true,1),
  ('common-sanguoyanyi','三国演义','以三国时期历史为背景的章回体历史演义小说。','《三国演义》通常署为罗贯中，是历史演义小说而非正史。','史学文献','将演义情节直接当作正史结论。','三国志是史，三国演义是小说。',true,1),
  ('common-zhangzhongjing','张仲景与伤寒杂病论','张仲景是东汉医学家，《伤寒杂病论》是重要医学著作。','《伤寒杂病论》作者为张仲景。','传统医学','把张仲景著作错配给华佗或李时珍。','伤寒杂病论，看张仲景。',true,1),
  ('common-lishizhen','李时珍与本草纲目','李时珍编撰《本草纲目》，是中国本草学重要著作。','《本草纲目》作者为李时珍。','传统医学','把本草、伤寒、内经作者横向错配。','本草纲目，李时珍。',true,1),
  ('common-huangdi-neijing','黄帝内经','《黄帝内经》是中医学理论体系的重要经典。','《黄帝内经》是中医基础理论的重要经典，不是个人专著署名。','传统医学','把经典的理论地位和作者归属机械等同。','中医理论看内经，临床伤寒看仲景。',true,1),
  ('common-lin-zexu','林则徐诗句','“苟利国家生死以，岂因祸福避趋之”出自林则徐《赴戍登程口占示家人》。','该名句表达以国家利益为重的担当精神。','近现代文化','把名句作者错记为其他近现代人物。','苟利国家生死以，林则徐。',true,1),
  ('common-chronology','干支纪年','天干与地支相配形成六十年一循环的干支纪年体系。','十天干与十二地支依次相配，六十年为一甲子。','传统文化','把天干、地支数量或循环年数记错。','十干十二支，六十成甲子。',true,1),
  ('common-embroidery','四大名绣','苏绣、湘绣、粤绣、蜀绣合称中国四大名绣。','四大名绣为苏绣、湘绣、粤绣、蜀绣。','传统工艺','把杭绣、汴绣等知名绣种误列入四大名绣。','苏湘粤蜀，四大名绣。',true,1),
  ('common-historical-records','史记','司马迁撰写的《史记》开创纪传体通史体例。','《史记》作者为司马迁，是中国第一部纪传体通史。','史学文献','把《史记》与《汉书》《三国志》的体例、作者混淆。','司马迁史记，纪传通史第一部。',true,1)
on conflict (id) do update set name=excluded.name,summary=excluded.summary,core_fact=excluded.core_fact,category=excluded.category,common_mistake=excluded.common_mistake,memory_tip=excluded.memory_tip,published=excluded.published,version=excluded.version;

insert into public.knowledge_relations (source_id,target_id,relation_type,label,weight) values
  ('common-sanguozhi','common-sanguoyanyi','contrast','正史与演义',1),
  ('common-zhangzhongjing','nature-wuqinxi','contrast','东汉医学人物',1),
  ('common-lishizhen','common-huangdi-neijing','context','中医典籍',1),
  ('common-historical-records','common-sanguozhi','timeline','史学传统',1),
  ('common-chronology','culture-festivals','context','传统时间',1),
  ('common-embroidery','culture-calligraphy','context','传统工艺',1),
  ('common-anthem','history-republic-founded','context','国家记忆',1)
on conflict (source_id,target_id,relation_type) do update set label=excluded.label,weight=excluded.weight;

with seed(id,knowledge_id,level_id,stem,a,b,c,d,answer,summary,why_correct,why_wrong,mistake,tip,difficulty) as (values
  ('common-integrated-01','common-anthem','common-integrated-1','《义勇军进行曲》的词作者是？','田汉','聂耳','冼星海','郭沫若','A','正确答案：田汉','《义勇军进行曲》由田汉作词、聂耳作曲。','聂耳是曲作者；其他人物也有文艺贡献，但不对应本题。','把词作者、曲作者颠倒。','田汉词，聂耳曲。',1),
  ('common-integrated-02','common-anthem','common-integrated-1','《义勇军进行曲》最初是下列哪部电影的主题曲？','《渔光曲》','《风云儿女》','《马路天使》','《十字街头》','B','正确答案：《风云儿女》','《义勇军进行曲》诞生于 1935 年，原为电影《风云儿女》的主题曲。','题目考查国歌诞生背景，而非只考词曲作者。','把国歌的现行地位与最初创作场景混为一谈。','义勇军进行曲，原是风云儿女主题曲。',2),
  ('common-integrated-03','common-sanguozhi','common-integrated-2','《三国志》的作者是？','罗贯中','司马迁','陈寿','班固','C','正确答案：陈寿','《三国志》由西晋史学家陈寿撰写。','罗贯中对应《三国演义》，司马迁对应《史记》，班固对应《汉书》。','将多部史书与作者打乱记忆。','陈寿写三国志。',1),
  ('common-integrated-04','common-sanguozhi','common-integrated-2','《三国志》的史学体例是？','编年体通史','国别体史书','章回体小说','纪传体断代史','D','正确答案：纪传体断代史','《三国志》记载魏、蜀、吴三国历史，是纪传体断代史。','章回体历史演义小说是《三国演义》的文学属性。','将正史体例与演义小说体裁混淆。','三国志：陈寿、纪传、断代。',2),
  ('common-integrated-05','common-sanguoyanyi','common-integrated-2','关于《三国演义》的表述，正确的是？','是陈寿撰写的正史','通常署为罗贯中，是历史演义小说','是司马迁撰写的纪传体通史','是东汉医学著作','B','正确答案：通常署为罗贯中，是历史演义小说','《三国演义》通常署为罗贯中，是章回体历史演义小说。','正史《三国志》与演义小说不能混作同一种史料。','把小说情节当作正史结论。','三国志是史，三国演义是小说。',2),
  ('common-integrated-06','common-zhangzhongjing','common-integrated-2','《伤寒杂病论》的作者是？','华佗','李时珍','张仲景','孙思邈','C','正确答案：张仲景','《伤寒杂病论》作者是东汉医学家张仲景。','华佗关联五禽戏和麻沸散；李时珍关联《本草纲目》。','把中医人物只按“名医”概念笼统记忆。','伤寒杂病论，看张仲景。',1),
  ('common-integrated-07','common-lishizhen','common-integrated-2','《本草纲目》的作者是？','李时珍','张仲景','华佗','扁鹊','A','正确答案：李时珍','《本草纲目》是李时珍编撰的本草学重要著作。','张仲景、华佗属于不同医学成就的代表人物。','把本草、伤寒、养生方法的作者互换。','本草纲目，李时珍。',1),
  ('common-integrated-08','common-huangdi-neijing','common-integrated-2','下列关于《黄帝内经》的表述，正确的是？','是李时珍的本草著作','是中医学基础理论的重要经典','是张仲景的临床专著','是华佗创编的养生操','B','正确答案：是中医学基础理论的重要经典','《黄帝内经》是中医基础理论的重要经典。','《本草纲目》《伤寒杂病论》和五禽戏分别属于不同医学知识模块。','将中医经典、专著与养生法混为同一类别。','中医理论看内经。',2),
  ('common-integrated-09','common-lin-zexu','common-integrated-1','“苟利国家生死以，岂因祸福避趋之”的作者是？','林则徐','魏源','龚自珍','谭嗣同','A','正确答案：林则徐','该句出自林则徐《赴戍登程口占示家人》。','四人均为近代重要人物，须以诗句出处准确辨别。','只按时代相近而错配作者。','苟利国家生死以，林则徐。',2),
  ('common-integrated-10','common-chronology','common-integrated-1','“六十年一甲子”所对应的纪年体系是？','年号纪年','干支纪年','公元纪年','星座纪年','B','正确答案：干支纪年','十天干与十二地支依次相配，六十年为一个循环。','年号纪年以帝王年号为标志，不能混用。','只记住甲子，不清楚其组合规则。','十干十二支，六十成甲子。',2),
  ('common-integrated-11','common-embroidery','common-integrated-1','下列属于中国四大名绣的是？','杭绣','苏绣','汴绣','京绣','B','正确答案：苏绣','苏绣、湘绣、粤绣、蜀绣合称四大名绣。','其他绣种也有地方特色，但不在四大名绣固定组合内。','将知名地方绣种全部列入四大名绣。','苏湘粤蜀。',1),
  ('common-integrated-12','common-historical-records','common-integrated-2','《史记》的作者是？','班固','司马光','司马迁','陈寿','C','正确答案：司马迁','《史记》由司马迁撰写，开创纪传体通史体例。','班固著《汉书》，司马光主编《资治通鉴》，陈寿著《三国志》。','将史书作者只按姓氏或时代猜测。','司马迁史记。',1),
  ('common-integrated-13','common-historical-records','common-integrated-2','下列关于《史记》的表述，正确的是？','中国第一部纪传体通史','中国第一部编年体通史','三国时期断代史','章回体历史演义小说','A','正确答案：中国第一部纪传体通史','《史记》是中国第一部纪传体通史。','编年体通史代表为《资治通鉴》；其他体例也不对应《史记》。','混淆“纪传体”“通史”“断代史”三个概念。','史记：纪传体通史第一部。',3),
  ('common-integrated-14','common-anthem','common-integrated-boss','single_choice','下列“人物—贡献”对应正确的是？','田汉—《义勇军进行曲》词作者','聂耳—《义勇军进行曲》词作者','陈寿—《三国演义》作者','华佗—《本草纲目》作者','A','正确答案：田汉—《义勇军进行曲》词作者','田汉作词、聂耳作曲；陈寿著《三国志》，《本草纲目》作者为李时珍。','多组人物都很熟悉，必须抓住具体“作品—角色”对应。','把作者、词作者、曲作者和医书作者混用。','田汉词聂耳曲；三国志陈寿；本草李时珍。',3),
  ('common-integrated-15','common-sanguozhi','common-integrated-boss','single_choice','下列关于《三国志》与《三国演义》的比较，正确的是？','二者均为陈寿所著正史','《三国志》为正史，《三国演义》为历史演义小说','《三国演义》早于《三国志》成书','二者均为纪传体断代史','B','正确答案：《三国志》为正史，《三国演义》为历史演义小说','《三国志》是陈寿撰写的纪传体断代史；《三国演义》通常署为罗贯中，是历史演义小说。','二者均涉及三国人物，但史料性质不同。','以题材相同替代体裁与史料性质判断。','三国志是史，三国演义是小说。',3),
  ('common-integrated-16','common-zhangzhongjing','common-integrated-boss','single_choice','下列医学人物与著作或方法的对应，错误的是？','张仲景—《伤寒杂病论》','李时珍—《本草纲目》','华佗—五禽戏','华佗—《黄帝内经》','D','正确答案：华佗—《黄帝内经》','《黄帝内经》是中医基础理论经典，不是华佗个人著作；华佗与五禽戏相关。','其余搭配均为常见且正确的医学常识。','把传统医学经典与个人成就等同。','仲景伤寒，时珍本草，华佗五禽，内经是理论经典。',3),
  ('common-integrated-17','common-chronology','common-integrated-boss','single_choice','下列对传统纪年的理解，正确的是？','天干有十二个，地支有十个','十天干和十二地支依次相配形成干支纪年','甲子只指一个月的第一天','年号纪年与帝王统治无关','B','正确答案：十天干和十二地支依次相配形成干支纪年','十天干、十二地支相配，形成六十年一循环的干支体系。','选项颠倒天干地支数量，或误解甲子和年号纪年。','记住数字但不理解组合规则。','十干十二支，六十成甲子。',3),
  ('common-integrated-18','common-embroidery','common-integrated-boss','single_choice','下列组合中，全部属于中国四大名绣的是？','苏绣、湘绣、粤绣、蜀绣','苏绣、杭绣、京绣、蜀绣','湘绣、汴绣、粤绣、京绣','苏绣、苗绣、粤绣、蜀绣','A','正确答案：苏绣、湘绣、粤绣、蜀绣','四大名绣固定为苏、湘、粤、蜀四种。','其余选项掺入具有地方特色但不属四大名绣的绣种。','只凭地名熟悉程度选择。','苏湘粤蜀，四大名绣。',2),
  ('common-integrated-19','common-historical-records','common-integrated-boss','single_choice','按作者生活时代先后排列，下列顺序正确的是？','司马迁—陈寿—罗贯中','罗贯中—陈寿—司马迁','陈寿—司马迁—罗贯中','司马迁—罗贯中—陈寿','A','正确答案：司马迁—陈寿—罗贯中','司马迁为西汉史学家，陈寿为西晋史学家，罗贯中为元末明初小说家。','先按作者所处朝代定位，再比较先后。','把三国题材作品的作者都误放在同一时代。','司马迁西汉，陈寿西晋，罗贯中元末明初。',4),
  ('common-integrated-20','common-lin-zexu','common-integrated-boss','single_choice','下列常识表述正确的是？','“苟利国家生死以”体现以国家利益为重的担当精神','《三国演义》是陈寿撰写的正史','《本草纲目》由张仲景编撰','干支纪年七十年为一甲子','A','正确答案：“苟利国家生死以”体现以国家利益为重的担当精神','该句出自林则徐作品，表达以国家利益为重的担当精神。','其余选项分别误配史书作者、医学著作作者和干支循环年数。','把多个学科的固定事实混在一题时遗漏细节。','国事林则徐，三志陈寿，本草时珍，甲子六十。',3)
)
insert into public.questions (id,knowledge_id,level_id,question_type,stem,options,correct_answer,explanation,difficulty,published,version)
select id,knowledge_id,level_id,'single_choice',stem,
  jsonb_build_object('options',jsonb_build_array(jsonb_build_object('id','A','text',a),jsonb_build_object('id','B','text',b),jsonb_build_object('id','C','text',c),jsonb_build_object('id','D','text',d))),
  to_jsonb(answer),jsonb_build_object('summary',summary,'whyCorrect',why_correct,'whyUserAnswerWrong',why_wrong,'commonMistake',mistake,'memoryTip',tip),difficulty,true,1
from seed
on conflict (id) do update set knowledge_id=excluded.knowledge_id,level_id=excluded.level_id,question_type=excluded.question_type,stem=excluded.stem,options=excluded.options,correct_answer=excluded.correct_answer,explanation=excluded.explanation,difficulty=excluded.difficulty,published=excluded.published,version=excluded.version;

grant select on table public.knowledge_relations to service_role;
