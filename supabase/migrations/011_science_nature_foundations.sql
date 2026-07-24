-- 科技自然馆：技术史、生命科学、物理观察与地球宇宙基础训练。内容只写入 Supabase。

insert into public.worlds (id,name,slug,description,theme,free_chapter_count,published,version) values
  ('nature','科技自然馆','nature','从技术发明到自然规律，训练观察与推理','nature',1,true,1)
on conflict (id) do update set name=excluded.name,slug=excluded.slug,description=excluded.description,theme=excluded.theme,free_chapter_count=excluded.free_chapter_count,published=excluded.published,version=excluded.version;

insert into public.chapters (id,world_id,name,sort,is_free,published,version,description,intro,boss_name,boss_description) values
  ('nature-lab','科学观察室',1,true,true,1,'四大发明、生命科学、物理与天文地理 · 20 道训练题','用证据观察技术与自然：先识别规律，再排除看似正确的干扰。','自然规律试炼','把技术、生命、物理和宇宙知识串成可验证的解释。')
on conflict (id) do update set world_id=excluded.world_id,name=excluded.name,sort=excluded.sort,is_free=excluded.is_free,published=excluded.published,version=excluded.version,description=excluded.description,intro=excluded.intro,boss_name=excluded.boss_name,boss_description=excluded.boss_description;

insert into public.levels (id,chapter_id,name,kind,sort,pass_score,reward_xp,published,version,summary) values
  ('nature-tech-1','nature-lab','1-1 技术火种','lesson',1,60,0,true,1,'四大发明与传统医学养生常识'),
  ('nature-science-1','nature-lab','1-2 自然观察','lesson',2,60,0,true,1,'生命、物理、地球与宇宙基础规律'),
  ('nature-boss','nature-lab','1-3 Boss · 规律推演','boss',3,60,0,true,1,'跨越技术史与自然科学的综合辨析')
on conflict (id) do update set chapter_id=excluded.chapter_id,name=excluded.name,kind=excluded.kind,sort=excluded.sort,pass_score=excluded.pass_score,reward_xp=excluded.reward_xp,published=excluded.published,version=excluded.version,summary=excluded.summary;

insert into public.knowledge_points (id,name,summary,core_fact,category,common_mistake,memory_tip,published,version) values
  ('nature-four-inventions','四大发明','造纸术、印刷术、指南针、火药是中国古代重要科技成就。','中国古代四大发明包括造纸术、印刷术、指南针和火药。','技术史','把瓷器、丝绸等其他重要创造误列为四大发明。','纸印指南火，四大发明要记牢。',true,1),
  ('nature-paper','造纸术','蔡伦在东汉改进造纸术，推动书写材料普及。','蔡伦改进造纸术，所制纸被称为“蔡侯纸”。','技术史','把蔡伦记为造纸术唯一发明者，而忽略“改进”这一准确表述。','造纸蔡伦改进，东汉蔡侯纸。',true,1),
  ('nature-printing','印刷术','雕版印刷成熟后，北宋毕昇发明泥活字印刷术。','毕昇发明泥活字印刷术，生活在北宋。','技术史','把活字印刷与蔡伦、指南针或火药错配。','北宋毕昇，泥活字印刷。',true,1),
  ('nature-compass-gunpowder','指南针与火药','指南针推动航海发展，火药由炼丹活动中发展并用于军事。','指南针可用于导航；火药是中国古代重要发明。','技术史','把指南针功能记为计时，或把火药与印刷术用途混淆。','指南导航，火药军用。',true,1),
  ('nature-wuqinxi','五禽戏','东汉华佗创编的导引养生方法，模仿虎、鹿、熊、猿、鸟五种动物。','五禽戏创编者为华佗，五禽为虎、鹿、熊、猿、鸟。','传统医学','把《伤寒杂病论》的作者张仲景与华佗混淆。','东汉华佗五禽戏：虎鹿熊猿鸟。',true,1),
  ('nature-cell','细胞与生命','细胞是构成生物体结构和功能的基本单位。','细胞是生物体结构和功能的基本单位。','生命科学','把细胞与组织、器官、系统的层级关系混淆。','生命结构先看细胞。',true,1),
  ('nature-photosynthesis','光合作用','绿色植物利用光能，把二氧化碳和水转化为有机物，并释放氧气。','光合作用需要光、二氧化碳和水，产物包括有机物和氧气。','生命科学','把呼吸作用与光合作用的物质变化、能量变化混淆。','光合吃二氧化碳水，放出氧气造有机物。',true,1),
  ('nature-matter','空气与水','空气和水的组成是基础化学常识。','干燥空气中体积分数最大的是氮气；水的化学式为 H₂O。','化学基础','把氧气误认为空气中含量最多的气体。','空气氮最多，水是 H₂O。',true,1),
  ('nature-wave-light','声与光','声音传播需要介质；平面镜成像有确定的物理特点。','真空不能传声；平面镜所成像与物等大、正立。','物理观察','把光能在真空传播的特点套用到声音上。','真空不传声，平镜像等大正立。',true,1),
  ('nature-earth-space','地球与宇宙','地球运动与太阳系行星是天文地理基础。','地球自转产生昼夜交替；地球公转与地轴倾斜共同形成四季变化；太阳系最大行星是木星。','天文地理','把昼夜、四季都简单归因于同一种地球运动。','自转昼夜，公转加倾斜成四季，最大行星木星。',true,1)
on conflict (id) do update set name=excluded.name,summary=excluded.summary,core_fact=excluded.core_fact,category=excluded.category,common_mistake=excluded.common_mistake,memory_tip=excluded.memory_tip,published=excluded.published,version=excluded.version;

insert into public.knowledge_relations (source_id,target_id,relation_type,label,weight) values
  ('nature-four-inventions','nature-paper','contains','技术成就',1),
  ('nature-four-inventions','nature-printing','contains','技术成就',1),
  ('nature-four-inventions','nature-compass-gunpowder','contains','技术成就',1),
  ('nature-cell','nature-photosynthesis','context','生命活动',1),
  ('nature-matter','nature-photosynthesis','material','物质变化',1),
  ('nature-wave-light','nature-earth-space','context','科学观察',1),
  ('nature-wuqinxi','nature-cell','context','生命健康',1)
on conflict (source_id,target_id,relation_type) do update set label=excluded.label,weight=excluded.weight;

with seed(id,knowledge_id,level_id,stem,a,b,c,d,answer,summary,why_correct,why_wrong,mistake,tip,difficulty) as (values
  ('nature-tech-01','nature-four-inventions','nature-tech-1','下列哪组均属于中国古代四大发明？','造纸术、印刷术、指南针、火药','瓷器、丝绸、茶叶、火药','造纸术、青铜器、指南针、火药','活字印刷、地动仪、丝绸、指南针','A','正确答案：造纸术、印刷术、指南针、火药','四大发明的固定组合为造纸术、印刷术、指南针和火药。','瓷器、丝绸、青铜器等同样重要，但不在“四大发明”固定组合内。','把“中国古代重要创造”泛化成“四大发明”。','纸印指南火。',2),
  ('nature-tech-02','nature-paper','nature-tech-1','下列关于蔡伦与造纸术的表述，正确的是？','蔡伦在唐朝发明了活字印刷','蔡伦在东汉改进造纸术','蔡伦主持修建了都江堰','蔡伦发现了指南针','B','正确答案：蔡伦在东汉改进造纸术','蔡伦在东汉改进造纸术，所制纸被称为蔡侯纸。','活字印刷对应北宋毕昇；都江堰和指南针也不对应蔡伦。','将“改进造纸术”写成“发明活字印刷”。','造纸蔡伦改进。',2),
  ('nature-tech-03','nature-printing','nature-tech-1','北宋发明泥活字印刷术的人是？','蔡伦','沈括','毕昇','张衡','C','正确答案：毕昇','毕昇生活在北宋，发明泥活字印刷术。','蔡伦关联造纸术；沈括记载相关科技成果；张衡与地动仪相关。','将技术发明者与记载者混淆。','北宋毕昇，泥活字。',1),
  ('nature-tech-04','nature-compass-gunpowder','nature-tech-1','指南针在航海中的主要作用是？','测量空气湿度','记录时间','制造火药','辨别方向、辅助导航','D','正确答案：辨别方向、辅助导航','指南针利用地磁性质指示方向，是航海导航的重要工具。','计时、气象观测和火药制造不属于指南针的核心用途。','知道名称却没有把握其实际功能。','指南导航。',1),
  ('nature-tech-05','nature-compass-gunpowder','nature-tech-1','关于火药的表述，正确的是？','火药是中国古代重要发明之一','火药最初用于活字排版','火药只能用于民间照明','火药与炼丹活动无关','A','正确答案：火药是中国古代重要发明之一','火药由古代炼丹活动中逐步发展，并在军事等领域得到应用。','其他选项分别误解火药来源或用途。','把技术起源、用途和后世应用混为一谈。','火药炼丹起，后来军用广。',2),
  ('nature-tech-06','nature-wuqinxi','nature-tech-1','五禽戏的创编者是？','扁鹊','华佗','张仲景','李时珍','B','正确答案：华佗','五禽戏是东汉华佗创编的导引养生方法。','张仲景著有《伤寒杂病论》，李时珍著有《本草纲目》。','将中医人物的著作与养生方法错配。','东汉华佗五禽戏。',1),
  ('nature-tech-07','nature-wuqinxi','nature-tech-1','下列哪项不属于华佗的相关贡献？','五禽戏','麻沸散','《伤寒杂病论》','夹脊穴','C','正确答案：《伤寒杂病论》','《伤寒杂病论》作者是张仲景；五禽戏、麻沸散等常与华佗相关。','题目故意把两位东汉医学家的成果放在一起。','张仲景伤寒论，华佗五禽麻沸。',3),
  ('nature-tech-08','nature-wuqinxi','nature-tech-1','五禽戏中的“五禽”不包括？','虎','鹿','熊','龙','D','正确答案：龙','五禽戏模仿虎、鹿、熊、猿、鸟五种动物，不包括龙。','龙常见于中国传统文化意象，但不是五禽戏动作名称。','根据传统意象猜答案，忽略固定列表。','虎鹿熊猿鸟。',2),
  ('nature-science-01','nature-cell','nature-science-1','构成生物体结构和功能的基本单位是？','细胞','组织','器官','系统','A','正确答案：细胞','细胞是生物体结构和功能的基本单位；组织、器官、系统是更高层级。','四个选项都与生命结构有关，关键在于层级。','将组织、器官、系统当作最小功能单位。','生命结构先看细胞。',1),
  ('nature-science-02','nature-photosynthesis','nature-science-1','绿色植物进行光合作用时，需要利用的气体是？','氧气','二氧化碳','氮气','氢气','B','正确答案：二氧化碳','光合作用利用光能，把二氧化碳和水转化为有机物，并释放氧气。','氧气是光合作用的重要产物，不是其主要吸收气体。','将光合作用与呼吸作用的气体交换方向记反。','光合吃二氧化碳，放出氧气。',2),
  ('nature-science-03','nature-photosynthesis','nature-science-1','关于光合作用的表述，正确的是？','在黑暗中只要有水即可持续进行','把氧气和有机物分解为二氧化碳和水','利用光能合成有机物，并释放氧气','只发生在动物细胞中','C','正确答案：利用光能合成有机物，并释放氧气','绿色植物通过光合作用利用光能制造有机物，并释放氧气。','分解有机物释放能量是呼吸作用的特征。','把光合作用、呼吸作用的方向与能量变化混淆。','光合造有机物、放氧气。',3),
  ('nature-science-04','nature-matter','nature-science-1','干燥空气中体积分数最大的气体是？','氧气','二氧化碳','稀有气体','氮气','D','正确答案：氮气','干燥空气中氮气体积分数最高，氧气约占五分之一。','氧气与生命活动关系密切，但并非空气中含量最多。','按重要性而不是含量判断。','空气氮最多。',1),
  ('nature-science-05','nature-matter','nature-science-1','水的化学式是？','H₂O','CO₂','O₂','H₂','A','正确答案：H₂O','一个水分子由两个氢原子和一个氧原子构成，化学式为 H₂O。','CO₂是二氧化碳，O₂是氧气，H₂是氢气。','把常见分子式的下标与元素混淆。','水是 H₂O。',1),
  ('nature-science-06','nature-wave-light','nature-science-1','宇航员在太空真空环境中不能直接听到对方说话，主要因为？','真空中没有光','真空中声音传播缺少介质','太空没有空气中的氧气','声音在真空中速度太快','B','正确答案：真空中声音传播缺少介质','声音是机械波，传播需要介质；真空中不能传声。','光可以在真空传播，但声音不能，不能把两者混同。','把“无空气”简单理解为“没有任何传播”。','真空不传声。',2),
  ('nature-science-07','nature-wave-light','nature-science-1','平面镜所成的像具有的特点是？','倒立缩小的实像','正立放大的实像','正立等大的虚像','倒立等大的实像','C','正确答案：正立等大的虚像','平面镜成像与物等大、正立，且为虚像。','实像、虚像以及放大缩小是光学题常见组合干扰。','只记住“镜中像”而没有记成像性质。','平镜像等大正立。',3),
  ('nature-science-08','nature-earth-space','nature-science-1','昼夜交替形成的主要原因是？','地球自转','地球公转','月球绕地球运动','太阳绕地球运动','A','正确答案：地球自转','地球自转使地球不同半球交替面向太阳，形成昼夜交替。','公转与地轴倾斜共同造成四季变化，不能与自转混为一谈。','把昼夜和四季都归因于公转。','自转昼夜。',1),
  ('nature-science-09','nature-earth-space','nature-science-1','四季变化的形成与下列哪项关系最密切？','月相变化','地球公转和地轴倾斜','地球自转速度变化','太阳每日东升西落','B','正确答案：地球公转和地轴倾斜','地球绕太阳公转且地轴倾斜，使不同季节受太阳照射角度和昼夜长短发生变化。','自转解释昼夜交替，月相主要与日地月相对位置有关。','只记住“地球公转”而漏掉地轴倾斜这一条件。','公转加倾斜，四季才分明。',3),
  ('nature-science-10','nature-earth-space','nature-science-1','太阳系中体积最大的行星是？','地球','火星','木星','土星','C','正确答案：木星','木星是太阳系体积最大的行星。','地球适合生命但不是最大行星；土星有明显光环但体积小于木星。','将“最显眼”“最适居”误当作“最大”。','最大行星木星。',1),
  ('nature-boss-01','nature-four-inventions','nature-boss','single_choice','下列“技术—作用”对应正确的是？','指南针—辅助航海导航','活字印刷—测量地震','造纸术—制造火药','火药—记录经纬度','A','正确答案：指南针—辅助航海导航','指南针的核心作用是辨别方向、辅助导航。','其余选项将不同技术的用途交叉错配。','只背技术名称，不理解实际用途。','指南导航，纸写印传，火药军用。',3),
  ('nature-boss-02','nature-cell','nature-boss','single_choice','下列生命活动的叙述，正确的是？','呼吸作用只在白天进行','光合作用可制造有机物','细胞不是生命活动的基本单位','氧气是光合作用吸收的主要气体','B','正确答案：光合作用可制造有机物','光合作用利用光能合成有机物并释放氧气。','呼吸作用并非只在白天进行；细胞是结构和功能基本单位。','将光合、呼吸和细胞层级混为同一概念。','光合造有机物，细胞是基本单位。',3),
  ('nature-boss-03','nature-wave-light','nature-boss','single_choice','下列关于声和光的说法，正确的是？','声音和光都不能在真空传播','声音可在真空传播，光不能','光可在真空传播，声音不能','声音和光都必须依靠空气传播','C','正确答案：光可在真空传播，声音不能','光是电磁波，可以在真空传播；声音是机械波，需要介质。','“空气”只是常见介质，不是光传播的必要条件。','把声音、光都当作同一种波来理解。','真空不传声，光能穿真空。',3),
  ('nature-boss-04','nature-earth-space','nature-boss','single_choice','下列现象与地球运动对应正确的是？','昼夜交替—地球自转','四季变化—月球公转','太阳东升西落—地球公转','木星最大—地球自转','A','正确答案：昼夜交替—地球自转','地球自转带来昼夜交替及太阳的周日视运动；四季与公转和地轴倾斜有关。','其余选项把不同天文现象的成因拼接在一起。','把日常观测现象与真实运动机制混淆。','自转昼夜，公转倾斜四季。',3)
)
insert into public.questions (id,knowledge_id,level_id,question_type,stem,options,correct_answer,explanation,difficulty,published,version)
select id,knowledge_id,level_id,'single_choice',stem,
  jsonb_build_object('options',jsonb_build_array(jsonb_build_object('id','A','text',a),jsonb_build_object('id','B','text',b),jsonb_build_object('id','C','text',c),jsonb_build_object('id','D','text',d))),
  to_jsonb(answer),jsonb_build_object('summary',summary,'whyCorrect',why_correct,'whyUserAnswerWrong',why_wrong,'commonMistake',mistake,'memoryTip',tip),difficulty,true,1
from seed
on conflict (id) do update set knowledge_id=excluded.knowledge_id,level_id=excluded.level_id,question_type=excluded.question_type,stem=excluded.stem,options=excluded.options,correct_answer=excluded.correct_answer,explanation=excluded.explanation,difficulty=excluded.difficulty,published=excluded.published,version=excluded.version;

grant select on table public.knowledge_relations to service_role;
