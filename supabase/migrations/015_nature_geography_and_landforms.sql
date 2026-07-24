-- 科技自然馆：地貌、中国地理与自然分界线。内容只写入 Supabase。

insert into public.worlds (id,name,slug,description,theme,free_chapter_count,published,version) values
  ('nature','科技自然馆','nature','从技术发明到自然规律，训练观察与推理','nature',1,true,1)
on conflict (id) do update set name=excluded.name,slug=excluded.slug,description=excluded.description,theme=excluded.theme,free_chapter_count=excluded.free_chapter_count,published=excluded.published,version=excluded.version;

insert into public.chapters (id,world_id,name,sort,is_free,published,version,description,intro,boss_name,boss_description) values
  ('nature-landforms','nature','山河观察站',2,true,true,1,'高原、山脉、河流与自然分界线 · 20 道训练题','让地貌、气候、河流与区域特征在地图上彼此照应。','山河坐标试炼','通过区域特征和成因，定位中国自然地理。')
on conflict (id) do update set world_id=excluded.world_id,name=excluded.name,sort=excluded.sort,is_free=excluded.is_free,published=excluded.published,version=excluded.version,description=excluded.description,intro=excluded.intro,boss_name=excluded.boss_name,boss_description=excluded.boss_description;

insert into public.levels (id,chapter_id,name,kind,sort,pass_score,reward_xp,published,version,summary) values
  ('nature-landforms-1','nature-landforms','2-1 大地形貌','lesson',1,60,0,true,1,'四大高原、山地与地貌成因'),
  ('nature-landforms-2','nature-landforms','2-2 山河分界','lesson',2,60,0,true,1,'秦岭—淮河线、河流与区域气候'),
  ('nature-landforms-boss','nature-landforms','2-3 Boss · 山河定位','boss',3,60,0,true,1,'把地貌、气候与区域位置连成完整地图')
on conflict (id) do update set chapter_id=excluded.chapter_id,name=excluded.name,kind=excluded.kind,sort=excluded.sort,pass_score=excluded.pass_score,reward_xp=excluded.reward_xp,published=excluded.published,version=excluded.version,summary=excluded.summary;

insert into public.knowledge_points (id,name,summary,core_fact,category,common_mistake,memory_tip,published,version) values
  ('nature-qinghai-tibet','青藏高原','平均海拔高、面积大，是世界海拔最高的高原。','青藏高原是世界海拔最高的高原，被称为“世界屋脊”。','中国地理','把“世界屋脊”误配给黄土高原或云贵高原。','青藏高原最高，世界屋脊记牢。',true,1),
  ('nature-inner-mongolia','内蒙古高原','地势较平坦开阔，是中国第二大高原。','内蒙古高原地势平坦开阔，草原广布。','中国地理','把内蒙古高原的草原景观误配给黄土或云贵高原。','内蒙古高原平，草原辽阔。',true,1),
  ('nature-loess','黄土高原','黄土广布、沟壑纵横，水土流失问题突出。','黄土高原主要位于黄河中游地区，地表沟壑纵横。','中国地理','把喀斯特地貌或冰川地貌错配给黄土高原。','黄土高原沟壑深，水土保持要当心。',true,1),
  ('nature-yunnan-guizhou','云贵高原','石灰岩广布，喀斯特地貌典型。','云贵高原喀斯特地貌发育广泛。','中国地理','把喀斯特地貌错配给青藏高原或内蒙古高原。','云贵多岩溶，喀斯特成景观。',true,1),
  ('nature-qinling-huaihe','秦岭淮河线','秦岭—淮河一线是中国重要自然地理分界线。','秦岭—淮河线大致是1月0℃等温线和800毫米年等降水量线附近。','中国地理','把秦岭—淮河线误当作单一行政区界或所有河流的分界。','秦淮线：一月零度、八百毫米。',true,1),
  ('nature-north-south','南北方自然差异','秦岭—淮河线南北在耕地类型、作物熟制和降水等方面存在典型差异。','北方多旱地、以小麦等为主；南方多水田、以水稻等为主。','中国地理','机械认为所有南北地区都完全一致，而忽略“总体上”的区域差异。','北麦旱地，南稻水田。',true,1),
  ('nature-yangtze-yellow','长江黄河','长江是中国第一长河，黄河是中华文明重要发源地之一。','长江是中国第一长河；黄河中游流经黄土高原，含沙量大。','中国地理','把长江、黄河的长度地位和流经地貌混淆。','长江最长，黄河中游穿黄土。',true,1),
  ('nature-karst','喀斯特地貌','可溶性岩石在水的溶蚀作用下形成峰林、溶洞等景观。','喀斯特地貌以流水溶蚀作用为主，常见溶洞、峰林。','地貌成因','把喀斯特简单归为风力侵蚀或冰川侵蚀。','水溶石灰岩，溶洞峰林现。',true,1),
  ('nature-plateau-formation','高原形成','高原形成常与地壳运动、抬升及长期外力作用有关。','青藏高原隆升与板块碰撞、地壳运动密切相关。','地貌成因','把所有高原的形成只归结为河流沉积。','高原先看地壳抬升，再看外力雕刻。',true,1),
  ('nature-four-famous-mountains','佛教四大名山','五台山、峨眉山、普陀山、九华山是佛教四大名山。','五台山、峨眉山、普陀山、九华山合称佛教四大名山。','文化地理','把五岳、四大佛教名山和四大名楼混淆。','五台文殊，峨眉普贤，普陀观音，九华地藏。',true,1)
on conflict (id) do update set name=excluded.name,summary=excluded.summary,core_fact=excluded.core_fact,category=excluded.category,common_mistake=excluded.common_mistake,memory_tip=excluded.memory_tip,published=excluded.published,version=excluded.version;

insert into public.knowledge_relations (source_id,target_id,relation_type,label,weight) values
  ('nature-qinghai-tibet','nature-plateau-formation','explained_by','高原隆升',1),
  ('nature-inner-mongolia','nature-loess','contrast','高原景观对照',1),
  ('nature-loess','nature-yangtze-yellow','context','黄河中游地貌',1),
  ('nature-yunnan-guizhou','nature-karst','contains','岩溶地貌',1),
  ('nature-qinling-huaihe','nature-north-south','explains','南北区域差异',1),
  ('nature-qinling-huaihe','nature-yangtze-yellow','context','山河分界',1)
on conflict (source_id,target_id,relation_type) do update set label=excluded.label,weight=excluded.weight;

with seed(id,knowledge_id,level_id,stem,a,b,c,d,answer,summary,why_correct,why_wrong,mistake,tip,difficulty) as (values
  ('nature-landforms-01','nature-qinghai-tibet','nature-landforms-1','被称为“世界屋脊”的是？','青藏高原','黄土高原','云贵高原','内蒙古高原','A','正确答案：青藏高原','青藏高原平均海拔高，是世界海拔最高的高原。','其余高原各有典型地貌，但不具有“世界屋脊”的称号。','将“四大高原”只按方位记而不记特征。','青藏最高，世界屋脊。',1),
  ('nature-landforms-02','nature-inner-mongolia','nature-landforms-1','地势较平坦开阔、草原广布的高原是？','黄土高原','内蒙古高原','云贵高原','青藏高原','B','正确答案：内蒙古高原','内蒙古高原以平坦开阔的草原景观著称。','黄土高原沟壑纵横，云贵高原岩溶典型，青藏高原海拔最高。','只看到“高原”而忽略表面形态。','内蒙古高原平，草原广。',1),
  ('nature-landforms-03','nature-loess','nature-landforms-1','沟壑纵横、水土流失问题突出的典型地区是？','青藏高原','内蒙古高原','黄土高原','东南丘陵','C','正确答案：黄土高原','黄土高原土质疏松，长期流水侵蚀形成沟壑地貌。','其他地区虽也可能发生侵蚀，但并非这一组合的典型答案。','把“黄土”只当土壤颜色，不理解地貌后果。','黄土沟壑深，水土要保持。',1),
  ('nature-landforms-04','nature-yunnan-guizhou','nature-landforms-1','喀斯特地貌最典型的高原是？','青藏高原','内蒙古高原','黄土高原','云贵高原','D','正确答案：云贵高原','云贵高原石灰岩广布，流水溶蚀形成大量岩溶地貌。','青藏以高寒高海拔著称，内蒙古以草原平坦著称，黄土高原以沟壑著称。','将“奇峰溶洞”当作所有山地共有景观。','云贵岩溶多。',1),
  ('nature-landforms-05','nature-karst','nature-landforms-1','形成溶洞、峰林等喀斯特地貌的主要外力作用是？','流水溶蚀','风力沉积','冰川堆积','海浪搬运','A','正确答案：流水溶蚀','水对可溶性岩石的长期溶蚀是喀斯特地貌形成的重要机制。','风、冰川、海浪也塑造地貌，但不是岩溶地貌的主因。','只按地貌外观猜测，不问岩石和作用机制。','水溶石灰岩，峰林溶洞来。',2),
  ('nature-landforms-06','nature-plateau-formation','nature-landforms-1','青藏高原隆升与下列哪项关系最密切？','板块碰撞和地壳运动','河流长期沉积','海浪侵蚀海岸','风力搬运沙丘','A','正确答案：板块碰撞和地壳运动','青藏高原的形成与印度板块和欧亚板块碰撞造成的地壳抬升密切相关。','河流、海浪、风力主要是外力作用，不能解释高原的大规模隆升。','把地表塑形的外力作用当作构造隆升的根源。','青藏高原，板块碰撞抬升。',2),
  ('nature-landforms-07','nature-four-famous-mountains','nature-landforms-1','下列属于佛教四大名山的是？','五台山、峨眉山、普陀山、九华山','泰山、华山、衡山、恒山','黄山、庐山、雁荡山、武夷山','嵩山、泰山、峨眉山、九华山','A','正确答案：五台山、峨眉山、普陀山、九华山','该四山与佛教文化关系密切，合称佛教四大名山。','五岳和其他名山不能与四大佛教名山混列。','把“名山”概念中不同分类随意拼接。','五峨普九，四大佛教名山。',2),
  ('nature-landforms-08','nature-four-famous-mountains','nature-landforms-1','与文殊菩萨道场相对应的名山是？','五台山','峨眉山','普陀山','九华山','A','正确答案：五台山','五台山对应文殊菩萨；峨眉、普陀、九华分别常与普贤、观音、地藏对应。','题目考查四山四菩萨的固定对应，不能按山名字面推断。','只背了四座山，没建立一一对应。','五台文殊。',2),
  ('nature-landforms-09','nature-yangtze-yellow','nature-landforms-1','中国第一长河是？','长江','黄河','珠江','淮河','A','正确答案：长江','长江是中国第一长河。','黄河在中华文明史上地位重要，但长度不及长江。','以文化影响替代长度比较。','中国第一长河长江。',1),
  ('nature-landforms-10','nature-yangtze-yellow','nature-landforms-1','黄河含沙量较大的重要原因之一是中游流经？','黄土高原','青藏高原','内蒙古高原','云贵高原','A','正确答案：黄土高原','黄土高原土质疏松、侵蚀明显，大量泥沙进入黄河。','其余高原的地貌特征不同，不能解释这一典型现象。','只背黄河“黄”而不理解泥沙来源。','黄河中游过黄土，泥沙随水走。',2),
  ('nature-landforms-11','nature-qinling-huaihe','nature-landforms-2','秦岭—淮河一线大致与下列哪组地理界线相近？','1月0℃等温线和800毫米年等降水量线','热带与南温带分界线','地势第一、二级阶梯分界线','季风区与非季风区分界线','A','正确答案：1月0℃等温线和800毫米年等降水量线','秦岭—淮河线是中国南北自然地理的重要分界，常以这两条气候线概括。','地势阶梯、季风区等分界线主要由其他山脉和地形线构成。','把中国所有重要地理分界线都套到秦岭—淮河线上。','秦淮线：零度、八百。',3),
  ('nature-landforms-12','nature-north-south','nature-landforms-2','下列关于秦岭—淮河线南北农业差异的概括，正确的是？','北方多旱地小麦，南方多水田水稻','北方多水田水稻，南方多旱地小麦','南北均以水稻和水田为主','南北均以小麦和旱地为主','A','正确答案：北方多旱地小麦，南方多水田水稻','受降水、热量等条件影响，北方旱地农业和南方水田农业差异明显。','区域内部有差异，但考试通常考查总体上的南北对比。','把局部例外当成总体规律。','北麦旱地，南稻水田。',2),
  ('nature-landforms-13','nature-qinling-huaihe','nature-landforms-2','下列关于秦岭—淮河线的理解，正确的是？','是南北自然地理差异的重要界线','是所有省级行政区的边界','是中国最长河流的入海口','是所有高原的共同边缘','A','正确答案：是南北自然地理差异的重要界线','秦岭—淮河线关联气温、降水、植被和农业等多方面南北差异。','它并非行政区界，也与河口、高原边缘无直接固定关系。','把自然地理界线误当作行政边界。','秦淮分南北，自然界线不是省界。',2),
  ('nature-landforms-14','nature-north-south','nature-landforms-2','下列哪项更符合中国北方地区的一般特征？','1月平均气温低于0℃的地区较多','全年降水普遍超过1600毫米','以双季稻为主要熟制','水田面积普遍大于旱地','A','正确答案：1月平均气温低于0℃的地区较多','北方冬季较冷，1月0℃等温线以北的地区范围较大。','高降水、双季稻和水田占优更符合南方较湿热地区的一般特征。','用某个南方局部特征替代北方整体特征。','北方冬冷旱地多。',2),
  ('nature-landforms-15','nature-loess','nature-landforms-2','治理黄土高原水土流失的关键方向是？','保持水土、合理利用土地','大量开垦陡坡耕地','完全砍伐植被扩大裸地','只修建沿海防潮堤','A','正确答案：保持水土、合理利用土地','植被恢复、坡面治理和合理利用土地有助于减少侵蚀和泥沙流失。','扩大裸地、陡坡开垦会加重侵蚀，防潮堤针对沿海问题。','把不同地区的生态治理措施套错对象。','黄土治流失，先保土保水。',3),
  ('nature-landforms-16','nature-yunnan-guizhou','nature-landforms-2','下列景观最可能在云贵高原广泛出现的是？','溶洞和峰林','连续沙丘海','广阔冰盖','三角洲平原','A','正确答案：溶洞和峰林','云贵高原岩溶作用强，溶洞、峰林等景观典型。','沙丘、冰盖和三角洲分别对应其他环境和地貌过程。','仅凭“高原”二字推测景观。','云贵岩溶，溶洞峰林。',2),
  ('nature-landforms-boss-01','nature-qinghai-tibet','nature-landforms-boss','下列“四大高原—典型特征”对应正确的是？','青藏高原—世界屋脊','内蒙古高原—喀斯特地貌','黄土高原—草原平坦','云贵高原—海拔最高','A','正确答案：青藏高原—世界屋脊','青藏高原海拔高，是“世界屋脊”。','内蒙古高原以草原平坦著称，黄土高原沟壑纵横，云贵高原岩溶典型。','把四大高原的标签循环错配。','青藏高、内蒙平、黄土沟、云贵溶。',3),
  ('nature-landforms-boss-02','nature-karst','nature-landforms-boss','下列地貌与主要成因对应正确的是？','喀斯特地貌—流水溶蚀可溶性岩石','黄土沟壑—海浪侵蚀','青藏高原—纯粹河流沉积','沙丘—冰川堆积','A','正确答案：喀斯特地貌—流水溶蚀可溶性岩石','岩溶地貌由水对可溶性岩石的长期溶蚀形成。','其他选项把不同外力或内力作用错配给地貌。','只背景观名称，不理解形成过程。','喀斯特靠水溶。',3),
  ('nature-landforms-boss-03','nature-qinling-huaihe','nature-landforms-boss','某地位于秦岭—淮河线以南，以下描述更可能正确的是？','水田较多，水稻种植较常见','冬季普遍严寒，旱地小麦占绝对优势','年降水量普遍低于400毫米','属于所有高原的核心区','A','正确答案：水田较多，水稻种植较常见','秦岭—淮河线以南总体热量、降水条件较好，水田农业和水稻种植更常见。','其余描述更接近干旱或北方地区特征，或与区域判断无关。','把自然界线当作精确单一的气候线，却忽略总体规律。','秦淮南，水田稻。',3),
  ('nature-landforms-boss-04','nature-four-famous-mountains','nature-landforms-boss','下列“名山—相关菩萨”对应正确的是？','普陀山—观音菩萨','五台山—地藏菩萨','峨眉山—文殊菩萨','九华山—普贤菩萨','A','正确答案：普陀山—观音菩萨','普陀山对应观音；五台、峨眉、九华依次对应文殊、普贤、地藏。','干扰项将四座名山与四位菩萨循环错配。','背山名却没有建立人物关联。','五文殊、峨普贤、普观音、九地藏。',3)
)
insert into public.questions (id,knowledge_id,level_id,question_type,stem,options,correct_answer,explanation,difficulty,published,version)
select id,knowledge_id,level_id,'single_choice',stem,
  jsonb_build_object('options',jsonb_build_array(jsonb_build_object('id','A','text',a),jsonb_build_object('id','B','text',b),jsonb_build_object('id','C','text',c),jsonb_build_object('id','D','text',d))),
  to_jsonb(answer),jsonb_build_object('summary',summary,'whyCorrect',why_correct,'whyUserAnswerWrong',why_wrong,'commonMistake',mistake,'memoryTip',tip),difficulty,true,1
from seed
on conflict (id) do update set knowledge_id=excluded.knowledge_id,level_id=excluded.level_id,question_type=excluded.question_type,stem=excluded.stem,options=excluded.options,correct_answer=excluded.correct_answer,explanation=excluded.explanation,difficulty=excluded.difficulty,published=excluded.published,version=excluded.version;

grant select on table public.knowledge_relations to service_role;
