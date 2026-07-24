-- 华夏纪年：史书体例、汉代集权与古代战役地理。内容只写入 Supabase。

insert into public.chapters (id,world_id,name,sort,is_free,published,version,description,intro,boss_name,boss_description) values
  ('history-records','history','史书与治道',2,true,true,1,'史书体例、古代治道与战役坐标 · 20 道训练题','以时间、人物、制度和地点为四条线，搭建可靠的历史坐标。','治道纵横试炼','在史书体例、制度目的和战争地理间识别准确关系。')
on conflict (id) do update set world_id=excluded.world_id,name=excluded.name,sort=excluded.sort,is_free=excluded.is_free,published=excluded.published,version=excluded.version,description=excluded.description,intro=excluded.intro,boss_name=excluded.boss_name,boss_description=excluded.boss_description;

insert into public.levels (id,chapter_id,name,kind,sort,pass_score,reward_xp,published,version,summary) values
  ('history-records-1','history-records','2-1 史笔千秋','lesson',1,60,0,true,1,'史书作者、体例与历史记述'),
  ('history-records-2','history-records','2-2 集权与战场','lesson',2,60,0,true,1,'汉代政策、诸子思想与战役地理'),
  ('history-records-boss','history-records','2-3 Boss · 纵横史识','boss',3,60,0,true,1,'综合判断史书、制度、人物与空间坐标')
on conflict (id) do update set chapter_id=excluded.chapter_id,name=excluded.name,kind=excluded.kind,sort=excluded.sort,pass_score=excluded.pass_score,reward_xp=excluded.reward_xp,published=excluded.published,version=excluded.version,summary=excluded.summary;

insert into public.knowledge_points (id,name,summary,core_fact,category,common_mistake,memory_tip,published,version) values
  ('history-shangshu','尚书','《尚书》汇集上古至春秋时期的政治文献，是儒家经典之一。','《尚书》以记言为主，是中国现存较早的历史文献。','史学典籍','把《尚书》的记言特点与《春秋》的编年特点混淆。','尚书记言，春秋编年。',true,1),
  ('history-chunqiu','春秋与三传','《春秋》为鲁国编年史，常与《左传》《公羊传》《穀梁传》并称春秋三传。','《春秋》以编年记事，《左传》《公羊传》《穀梁传》为春秋三传。','史学典籍','把《春秋》记作纪传体，或将三传的名称错配。','春秋编年，左公穀三传。',true,1),
  ('history-hanshu','汉书','班固撰《汉书》，是纪传体断代史的代表。','《汉书》作者为班固，是中国第一部纪传体断代史。','史学典籍','把《汉书》与《史记》的体例地位混淆。','司马迁通史，班固汉书断代。',true,1),
  ('history-zizhi','资治通鉴','北宋司马光主持编撰的编年体通史。','《资治通鉴》作者为司马光，是编年体通史。','史学典籍','把司马光与司马迁混淆，或把《资治通鉴》记为纪传体。','司马光通鉴，编年看治乱。',true,1),
  ('history-tongdian','通典','唐代杜佑编纂的典制体史书，重在记述历代制度沿革。','《通典》作者为杜佑，是典制体史书。','史学典籍','把《通典》与《资治通鉴》的体例功能混淆。','杜佑通典，专看制度沿革。',true,1),
  ('history-tuien','推恩令','汉武帝采纳主父偃建议推行推恩令，以分割诸侯封地的方式削弱王国势力。','推恩令由主父偃提出，实质是削弱诸侯王、加强中央集权。','中央集权','把推恩令说成秦始皇或唐太宗的政策，或只按字面理解为单纯赏赐。','主父偃推恩，名施恩实削藩。',true,1),
  ('history-hanfei','韩非与法术势','战国末期法家代表韩非综合法、术、势，强调君主集权。','韩非是法家集大成者，主张法、术、势相结合。','诸子百家','把韩非的“法治”直接等同于现代法治，或把法术势分别错配给其他学派。','韩非法术势，服务君主集权。',true,1),
  ('history-guandu','官渡之战','东汉末年曹操与袁绍在官渡作战，曹操取胜后奠定北方统一基础。','官渡之战发生在今河南一带，曹操以少胜多击败袁绍。','古代战役','把官渡与赤壁的交战双方、地点混淆。','官渡在豫，曹操胜袁绍。',true,1),
  ('history-chibi','赤壁之战','东汉末年孙刘联军在赤壁击败曹操，是三国鼎立形成的重要战役。','赤壁之战发生在今湖北一带，孙刘联军击败曹操。','古代战役','把赤壁战场错记为黄冈文赤壁，或把胜方记反。','赤壁在鄂，孙刘破曹。',true,1),
  ('history-feishui','淝水之战','东晋以少胜多击败前秦的重要战役，发生在今安徽寿县一带。','淝水之战发生在今安徽一带，东晋击败前秦。','古代战役','把淝水与赤壁、官渡的时代和战场混淆。','淝水在皖，东晋胜前秦。',true,1)
on conflict (id) do update set name=excluded.name,summary=excluded.summary,core_fact=excluded.core_fact,category=excluded.category,common_mistake=excluded.common_mistake,memory_tip=excluded.memory_tip,published=excluded.published,version=excluded.version;

insert into public.knowledge_relations (source_id,target_id,relation_type,label,weight) values
  ('history-shangshu','history-chunqiu','evolves_to','早期史书体例',1),
  ('history-chunqiu','history-hanshu','contrast','编年与纪传',1),
  ('history-hanshu','history-zizhi','contrast','断代纪传与编年通史',1),
  ('history-zizhi','history-tongdian','contrast','治乱编年与制度沿革',1),
  ('history-tuien','history-hanfei','context','中央集权',1),
  ('history-guandu','history-chibi','precedes','东汉末年战局',1),
  ('history-chibi','history-feishui','contrast','以少胜多',1),
  ('history-tuien','history-republic-founded','context','国家治理演进',1)
on conflict (source_id,target_id,relation_type) do update set label=excluded.label,weight=excluded.weight;

with seed(id,knowledge_id,level_id,stem,a,b,c,d,answer,summary,why_correct,why_wrong,mistake,tip,difficulty) as (values
  ('history-records-01','history-shangshu','history-records-1','《尚书》在体例上以什么为主？','记言','编年','纪传','国别','A','正确答案：记言','《尚书》主要保存诰、誓、命等言论性文献，以记言见长。','《春秋》为编年体，《史记》是纪传体；国别体代表如《国语》《战国策》。','把所有早期史书笼统记成编年体。','尚书记言。',2),
  ('history-records-02','history-chunqiu','history-records-1','《春秋》的体例是？','国别体','编年体','纪传体','纪事本末体','B','正确答案：编年体','《春秋》按年、季、月记事，是编年体史书的早期代表。','纪传体以人物为中心，国别体以国家为单位，均不符合本书基本形式。','把“春秋”当作时代名称而忽略其记事顺序。','春秋按年记，编年体。',1),
  ('history-records-03','history-chunqiu','history-records-1','下列属于“春秋三传”的是？','《左传》《公羊传》《穀梁传》','《史记》《汉书》《后汉书》','《尚书》《春秋》《论语》','《国语》《战国策》《资治通鉴》','A','正确答案：《左传》《公羊传》《穀梁传》','左传、公羊传、穀梁传是阐释《春秋》的三部传。','其余选项是不同类别的史书或经书组合。','因书名相近或都属古籍而随意组合。','左公穀，春秋三传。',2),
  ('history-records-04','history-hanshu','history-records-1','《汉书》的作者是？','司马迁','班固','范晔','陈寿','B','正确答案：班固','东汉班固撰《汉书》，记载西汉一代历史。','司马迁著《史记》，范晔著《后汉书》，陈寿著《三国志》。','将前四史的作者彼此错配。','班固汉书，范晔后汉。',1),
  ('history-records-05','history-hanshu','history-records-1','关于《汉书》的表述，正确的是？','中国第一部纪传体断代史','中国第一部纪传体通史','第一部编年体通史','第一部国别体史书','A','正确答案：中国第一部纪传体断代史','《汉书》专记西汉一朝，开创纪传体断代史的典范。','《史记》才是第一部纪传体通史；《资治通鉴》是编年体通史。','把“第一部”后的体例和范围漏记。','史记通史，汉书断代。',3),
  ('history-records-06','history-zizhi','history-records-1','《资治通鉴》的作者是？','司马迁','司马光','杜佑','刘知几','B','正确答案：司马光','北宋司马光主持编撰《资治通鉴》。','司马迁著《史记》，杜佑著《通典》，刘知几著《史通》。','同姓史家造成的作者混淆。','司马光通鉴。',1),
  ('history-records-07','history-zizhi','history-records-1','《资治通鉴》的体例是？','编年体通史','纪传体断代史','典制体史书','笔记体科学著作','A','正确答案：编年体通史','《资治通鉴》以时间为纲记述从战国到五代的历史。','纪传体断代史是《汉书》典型特征；典制体对应《通典》。','只记住书名中的“鉴”，忽略体例。','通鉴按年，编年通史。',2),
  ('history-records-08','history-tongdian','history-records-1','《通典》的作者是？','杜佑','班固','司马光','许慎','A','正确答案：杜佑','唐代杜佑编纂《通典》，系统记录制度沿革。','其余人物分别对应史书、通史或字书。','将“通典”误当作“通鉴”。','杜佑通典。',1),
  ('history-records-09','history-tongdian','history-records-1','《通典》最突出的内容特点是？','记述历代制度沿革','专记三国人物传记','汇集诗歌总集','记录水系地理','A','正确答案：记述历代制度沿革','《通典》是典制体史书，关注食货、选举、职官等制度。','三国人物、水系和诗歌分别属于其他著作的核心内容。','把“通”理解为无所不包而忽略其制度主题。','通典看典章制度。',2),
  ('history-records-10','history-shangshu','history-records-1','下列“著作—体例”对应正确的是？','《尚书》—记言体','《春秋》—纪传体','《汉书》—编年体','《资治通鉴》—国别体','A','正确答案：《尚书》—记言体','《尚书》以记言为主。','《春秋》是编年体，《汉书》是纪传体断代史，《资治通鉴》是编年体通史。','在多本史书间只校对书名，不校对体例。','尚书记言，春秋通鉴编年，汉书纪传。',3),
  ('history-records-11','history-tuien','history-records-2','汉武帝推行推恩令时，提出建议的人是？','晁错','主父偃','商鞅','李斯','B','正确答案：主父偃','主父偃建议推行推恩令，汉武帝采纳后用以削弱诸侯王。','晁错主张削藩；商鞅、李斯是战国和秦代人物。','把“削藩”相关人物混为一谈。','推恩主父偃。',1),
  ('history-records-12','history-tuien','history-records-2','推恩令的实质是？','奖励诸侯建立更大封国','削弱诸侯王、加强中央集权','废除郡县制恢复分封制','设立三省六部制','B','正确答案：削弱诸侯王、加强中央集权','推恩令允许诸侯王将封地分给子弟，造成封国越分越小，从而削弱王国势力。','名称带“恩”并不代表其政治效果是扩张诸侯权力。','只按政策名称理解，而没有分析制度结果。','名推恩，实削藩。',3),
  ('history-records-13','history-hanfei','history-records-2','韩非思想的核心组合是？','仁义礼乐','法、术、势','兼爱非攻','无为而治','B','正确答案：法、术、势','韩非综合法、术、势思想，是法家集大成者。','仁义礼乐偏儒家，兼爱非攻属墨家，无为而治常与道家相关。','将诸子百家的关键词串台。','韩非法术势。',1),
  ('history-records-14','history-hanfei','history-records-2','下列关于韩非的表述，正确的是？','主张以法、术、势维护君主集权','主张兼爱并反对战争','主张以仁政为根本','主张无为而治、顺应自然','A','正确答案：主张以法、术、势维护君主集权','韩非的思想服务于强化君主权力与中央集权。','其余主张分别属于墨家、儒家、道家的典型思想取向。','用现代“法治”概念替代韩非的君主法术思想。','韩非的法术势，核心是君主集权。',3),
  ('history-records-15','history-guandu','history-records-2','官渡之战的交战双方主要是？','曹操与袁绍','曹操与孙刘联军','东晋与前秦','项羽与刘邦','A','正确答案：曹操与袁绍','官渡之战中曹操击败袁绍，奠定统一北方的基础。','曹操与孙刘联军对应赤壁；东晋与前秦对应淝水。','只记住曹操参与，未区分不同战役。','官渡曹袁，赤壁孙刘。',1),
  ('history-records-16','history-guandu','history-records-2','官渡之战发生在今哪一地区附近？','河南','湖北','安徽','河北','A','正确答案：河南','官渡位于今河南中牟附近，是东汉末年重要战场。','湖北常与赤壁相关，安徽常与淝水相关。','把著名战役按相近的中原地名混淆。','官渡在豫。',2),
  ('history-records-17','history-chibi','history-records-2','赤壁之战中击败曹操的一方是？','孙刘联军','袁绍军','前秦军','西楚军','A','正确答案：孙刘联军','孙权、刘备联军在赤壁战胜曹操，是三国鼎立形成的重要条件。','袁绍与曹操对阵在官渡；前秦败于淝水。','将东汉末年三场势力关系混淆。','赤壁孙刘破曹。',1),
  ('history-records-18','history-chibi','history-records-2','赤壁之战的主要战场位于今哪一省份一带？','湖北','河南','安徽','山西','A','正确答案：湖北','考试中通常将赤壁战场定位在今湖北赤壁一带。','河南对应官渡，安徽对应淝水。','把文学中的“文赤壁”与战场地点混同。','赤壁在鄂。',2),
  ('history-records-19','history-feishui','history-records-2','淝水之战中取胜的一方是？','东晋','前秦','曹魏','西汉','A','正确答案：东晋','东晋军队在淝水之战中以少胜多，击败前秦。','曹魏、西汉均不属于这场战役的交战主体。','把“以少胜多”的战役结论套错到别的时代。','淝水东晋胜前秦。',1),
  ('history-records-20','history-feishui','history-records-2','淝水之战发生在今哪一省份一带？','安徽','湖北','河南','陕西','A','正确答案：安徽','淝水之战战场位于今安徽寿县一带。','湖北、河南分别更常与赤壁、官渡关联。','只背了战役名称，没有建立地点坐标。','淝水在皖。',2),
  ('history-records-boss-01','history-hanshu','history-records-boss','下列关于史书体例的判断，正确的是？','《史记》是纪传体通史，《汉书》是纪传体断代史','《春秋》是纪传体通史，《资治通鉴》是断代史','《尚书》是国别体，《通典》是诗歌总集','《三国志》是编年体通史，《水经注》是典制体','A','正确答案：《史记》是纪传体通史，《汉书》是纪传体断代史','两书都采用纪传体，但《史记》通贯多代，《汉书》专记西汉。','其余选项将常见史书的体例、范围错置。','只背“第一部”而不分通史和断代。','史记通史，汉书断代。',3),
  ('history-records-boss-02','history-tuien','history-records-boss','下列“政策—目的”对应正确的是？','推恩令—削弱诸侯王、加强中央集权','推恩令—建立行省制度','三省六部制—分封同姓诸侯','郡县制—恢复宗法分封','A','正确答案：推恩令—削弱诸侯王、加强中央集权','汉武帝以推恩令逐步分割诸侯封地，强化中央对地方的控制。','其余政策目的和时代均不相符。','把制度名称与时代背景切开记忆。','推恩削藩，中央更强。',3),
  ('history-records-boss-03','history-chibi','history-records-boss','下列战役与地点对应正确的是？','官渡—河南、赤壁—湖北、淝水—安徽','官渡—湖北、赤壁—安徽、淝水—河南','官渡—安徽、赤壁—河南、淝水—湖北','官渡—山西、赤壁—河北、淝水—陕西','A','正确答案：官渡—河南、赤壁—湖北、淝水—安徽','三场战役的常见考查坐标依次为豫、鄂、皖。','干扰项将三个战场循环互换，专门考查地点坐标。','只记战役故事，未将其落在地图上。','官渡豫，赤壁鄂，淝水皖。',3),
  ('history-records-boss-04','history-hanfei','history-records-boss','下列思想家与主张对应正确的是？','韩非—法、术、势','孔子—兼爱非攻','墨子—无为而治','老子—仁政','A','正确答案：韩非—法、术、势','韩非综合法、术、势，是法家代表人物。','兼爱非攻属墨家，无为而治属道家，仁政常与孟子相关。','四家关键词记忆不成体系。','韩非法术势；墨兼爱；道无为；孟仁政。',3)
)
insert into public.questions (id,knowledge_id,level_id,question_type,stem,options,correct_answer,explanation,difficulty,published,version)
select id,knowledge_id,level_id,'single_choice',stem,
  jsonb_build_object('options',jsonb_build_array(jsonb_build_object('id','A','text',a),jsonb_build_object('id','B','text',b),jsonb_build_object('id','C','text',c),jsonb_build_object('id','D','text',d))),
  to_jsonb(answer),jsonb_build_object('summary',summary,'whyCorrect',why_correct,'whyUserAnswerWrong',why_wrong,'commonMistake',mistake,'memoryTip',tip),difficulty,true,1
from seed
on conflict (id) do update set knowledge_id=excluded.knowledge_id,level_id=excluded.level_id,question_type=excluded.question_type,stem=excluded.stem,options=excluded.options,correct_answer=excluded.correct_answer,explanation=excluded.explanation,difficulty=excluded.difficulty,published=excluded.published,version=excluded.version;

grant select on table public.knowledge_relations to service_role;
