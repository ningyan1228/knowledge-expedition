# 《知识远征》网站游戏开发需求书（发给 Codex）

你现在要从零开发一个可部署、可扩展、可运营的网页知识闯关游戏，项目名为：

# 知识远征

副标题建议：

> 把零散知识，走成一张自己的地图。

请严格按照以下需求执行。不要只做静态原型，也不要只做几张展示页。第一阶段要交付一个可以真实运行的 MVP：能够选择学习目标、进入知识地图、完成关卡、记录进度、生成错题、安排复习、显示掌握度，并预留正式付费接口。

---

# 一、项目定位

《知识远征》不是普通刷题网站，也不是简单的题库列表，而是：

> 记忆训练 + 知识关系图谱 + 闯关地图 + 间隔复习 + 计算训练

目标用户包括：

1. 公务员、事业单位、教师编等考试用户；
2. 中学生、大学生；
3. 需要记忆成语、古诗词、历史、科技、生物、文化常识的人；
4. 需要训练资料分析、数量关系和基础计算速度的人；
5. 想利用碎片时间积累通识知识的人。

核心学习闭环：

```text
发现知识
→ 建立关系
→ 完成挑战
→ 查看解析
→ 纠正错误
→ 间隔复习
→ 长期掌握
```

---

# 二、技术架构

必须遵循下面的架构，不要自行改成其他重型方案。

## 1. 前端

```text
GitHub Pages
React
TypeScript
Vite
React Router
Zustand
Framer Motion
```

前端负责：

- 页面渲染；
- 闯关地图；
- 作答交互；
- 动画；
- 基础静态资源；
- PWA；
- 本地临时状态；
- 游戏音效开关；
- 移动端适配。

不要把 Notion Token、Supabase Service Role Key、题目答案或支付密钥放进前端。

## 2. 代理服务器

服务器配置约为：

```text
Ubuntu Server 22.04
2 核 CPU
2GB 内存
```

服务器只做无状态代理和业务验证，不保存玩家数据库、题库文件、图片、视频、音频或上传文件。

推荐：

```text
Node.js
TypeScript
Fastify
Zod
JWT
Pino
```

服务器负责：

- 隐藏 Notion Token；
- 接收前端请求；
- 校验玩家身份；
- 下发不含答案的题目；
- 校验答案；
- 计算得分和奖励；
- 更新玩家进度；
- 防刷和限流；
- 处理支付回调；
- 同步 Notion 内容到线上数据库；
- 内存短缓存。

服务器重启后不依赖本地业务文件恢复数据。

## 3. 内容后台

```text
Notion
```

Notion 只作为内容编辑、审核和发布后台，用于管理：

- 知识点；
- 题目；
- 关系；
- 世界；
- 章节；
- 关卡；
- 公式；
- 解析；
- 易错点；
- 版本；
- 上线状态。

玩家每做一道题时，不允许实时读取 Notion。

正确流程：

```text
Notion 编辑
→ 内容审核
→ 点击发布或执行同步
→ 写入 Supabase 内容表
→ 游戏读取 Supabase
```

## 4. 在线数据库

使用：

```text
Supabase PostgreSQL
Supabase Auth
```

Supabase 保存：

- 玩家账号；
- 游客账号；
- 学习目标；
- 关卡进度；
- 知识点掌握度；
- 错题；
- 复习计划；
- 连续学习；
- 成就；
- 排行榜；
- 订单；
- 权益；
- 内容镜像；
- 发布版本。

## 5. 静态资源

小型资源可放 GitHub Pages。

较大的图片、音频、动画资源预留对象存储接口，例如：

```text
Cloudflare R2
阿里云 OSS
腾讯云 COS
```

不要将大型资源放入代理服务器。

---

# 三、第一版 MVP 范围

第一版只做三个知识世界，不要一开始开发全部分类。

## 世界一：文化万象

作为免费主世界。

内容包含：

- 成语释义；
- 成语典故；
- 成语使用场景；
- 近义成语辨析；
- 易错成语；
- 传统文化；
- 古代典籍；
- 文学艺术；
- 节日与民俗。

## 世界二：华夏纪年

作为免费体验 + 付费解锁测试世界。

内容包含：

- 朝代顺序；
- 帝王与治世；
- 历史事件；
- 古代战役；
- 重大改革；
- 历史人物；
- 史书与作者；
- 古代科技与农书。

## 世界三：数字工坊

作为工具型世界。

内容包含：

- 两位数加减；
- 多位数混合计算；
- 两位数乘法；
- 除法估算；
- 百分数；
- 分数比较；
- 增长率；
- 增长量；
- 基期量；
- 比重；
- 平均数；
- 资料分析速算。

## MVP 内容量

第一版代码和数据结构按以下规模设计：

```text
3 个世界
15 个章节
100 个知识点
300～500 道题
3 个章节 Boss
1 套错题系统
1 套掌握度系统
1 套复习系统
1 套基础付费权益系统
```

开发阶段可以先内置少量示例数据，但数据结构必须可以扩展到上万知识点和题目。

---

# 四、信息架构

底部导航固定为：

```text
营地
地图
复习
图谱
我的
```

移动端优先，桌面端保持居中宽屏布局。

建议路由：

```text
/
 /onboarding
 /diagnosis
 /camp
 /map
 /world/:worldId
 /chapter/:chapterId
 /level/:levelId
 /battle/:sessionId
 /result/:sessionId
 /review
 /review/today
 /review/wrong
 /graph
 /graph/:knowledgeId
 /profile
 /profile/stats
 /profile/achievements
 /store
 /product/:productId
 /login
 /settings
```

---

# 五、首次进入流程

首次进入绝对不要立即要求付费，也不要先弹会员页。

完整流程：

```text
欢迎页
→ 选择学习目标
→ 选择每日学习时长
→ 10 题快速诊断
→ 生成推荐路线
→ 免费进入第一个章节
→ 完成首个 Boss
→ 展示掌握报告
→ 再自然引导继续学习或解锁内容
```

## 学习目标

提供：

```text
公务员考试
学生知识巩固
文化通识积累
计算速度训练
自由探索
```

## 每日时长

```text
轻量：5 分钟
标准：15 分钟
强化：30 分钟
```

## 游客模式

允许不注册直接试玩。

游客数据：

- 可保存在浏览器本地；
- 同时生成匿名 guest_id；
- 关键通关结果可写入 Supabase；
- 用户注册后支持合并游客进度。

不要在首次使用时强制手机号登录。

---

# 六、首页“营地”

首页不是分类列表，而是玩家当天的学习指挥中心。

页面结构：

## 1. 顶部欢迎区

显示：

```text
早上好，远征者
连续远征 6 天
今日完成度 40%
```

包含：

- 连续学习天数；
- 今日进度；
- 当前等级；
- 头像；
- 设置入口。

## 2. 继续远征

显示玩家上次停留位置：

```text
上次停留：
华夏纪年 · 秦汉篇 · 第 3 关
```

主按钮：

```text
继续远征
```

## 3. 今日任务

示例：

```text
成语辨析        8 / 10
历史时间线      3 / 8
增长率速算      0 / 10
到期复习        4 / 6
```

## 4. 今日记忆预警

显示：

```text
今天有 12 个知识点即将遗忘
```

按钮：

```text
立即复习
```

## 5. 本周薄弱点

示例：

```text
近义成语辨析
朝代时间顺序
基期量反推
```

## 6. 最近获得

显示：

- 新徽章；
- 新知识卡；
- 新点亮地区；
- 连胜纪录。

---

# 七、知识地图

地图是产品的核心视觉。

不要使用普通后台式卡片网格。

## 地图表现

采用纵向或横向远征路线：

```text
营地
→ 第一章
→ 第二章
→ 支线关卡
→ 宝箱
→ 章节 Boss
→ 下一片区域
```

每个世界有不同视觉语言：

### 文化万象

- 古卷；
- 书院；
- 牌匾；
- 印章；
- 墨色山水；
- 温暖朱砂色点缀。

### 华夏纪年

- 时间长河；
- 古地图；
- 城池；
- 战旗；
- 编年卷轴；
- 青铜与石刻质感。

### 数字工坊

- 数字仪表；
- 图表；
- 网格；
- 算盘；
- 尺规；
- 简洁现代科技感。

## 关卡状态

```text
未解锁
已解锁
进行中
已通关
三星通关
需要复习
Boss
支线
```

地图必须表现玩家已经走过的路径，而不是只显示一排模块按钮。

---

# 八、关卡结构

每个知识点不能只出一道选择题。

推荐关卡结构：

```text
侦察卡
→ 基础识别
→ 关系匹配
→ 场景应用
→ 易错辨析
→ 结果总结
```

## 1. 侦察卡

展示最少量核心信息，控制在 20～80 字。

不要一上来展示长篇教材。

## 2. 基础识别

题型：

- 单选；
- 多选；
- 判断；
- 填空；
- 上下句连接。

## 3. 关系匹配

题型：

- 人物与事件；
- 诗人与作品；
- 战役与时间；
- 典籍与作者；
- 成语与典故；
- 地点与文化；
- 公式与题型。

## 4. 场景应用

例如成语：

```text
给出真实语境，选择最适合的成语。
```

例如历史：

```text
给出事件描述，判断发生朝代。
```

例如计算：

```text
给出资料分析场景，选择最快公式。
```

## 5. 易错辨析

必须说明错误原因，而不是只显示红叉。

## 6. 结果页

显示：

- 正确率；
- 用时；
- 掌握度变化；
- 新增知识卡；
- 错误原因；
- 关联知识；
- 下次复习时间；
- 获得星级；
- 下一关。

---

# 九、Boss 关卡

Boss 关不能只是更难的单选题。

Boss 需要综合多个知识关系。

例如“项羽”Boss：

```text
人物身份
→ 巨鹿之战
→ 破釜沉舟
→ 楚汉之争
→ 垓下之战
→ 乌江自刎
```

Boss 题型可混合：

- 时间线排序；
- 人物拖拽；
- 地图地点；
- 成语典故；
- 判断；
- 场景选择；
- 最终综合题。

Boss 通关后：

- 解锁下一章节；
- 获得专属徽章；
- 生成章节掌握报告；
- 可以看到下一章节内容预览；
- 可以自然出现付费解锁入口。

---

# 十、成语系统

成语不能只训练“看词选释义”。

每个成语至少支持以下字段和玩法：

```text
成语
拼音
基本释义
感情色彩
适用对象
常见搭配
正确场景
错误场景
近义词
反义词
易混淆成语
出处
典故人物
朝代
历史事件
现代例句
错误例句
记忆提示
```

题型：

1. 释义选择；
2. 根据场景选成语；
3. 根据成语选场景；
4. 判断用法是否正确；
5. 改正错误用法；
6. 近义成语辨析；
7. 成语与人物匹配；
8. 成语与历史事件匹配；
9. 成语填空；
10. 成语关系图。

示例知识点：

```text
一诺千金
人物：季布
核心含义：说话算数，信用极高
训练重点：
- 释义
- 使用场景
- 人物典故
- 相近表达
- 现代应用
```

---

# 十一、历史系统

历史模块以时间线和关系为主。

支持：

```text
朝代
时间
都城
帝王
事件
人物
战役
制度
改革
典籍
科技
文化
地点
影响
```

主要题型：

- 朝代排序；
- 事件排序；
- 人物事件匹配；
- 战役双方匹配；
- 地点选择；
- 史书与作者；
- 改革与朝代；
- 帝王与治世；
- 成语典故关联；
- 章节综合 Boss。

时间线页面必须可视化。

---

# 十二、数字工坊

参考训练工具的高效率，但不要照搬现有截图视觉。

## 基础计算

支持：

```text
两位数加减
三位数加减
混合加减
两位数乘一位数
两位数乘两位数
三位数除一位数
三位数除两位数
乘法估算
除法估算
百分数
分数
```

## 资料分析

支持：

```text
现期量
基期量
增长量
增长率
比重
基期比重
平均数
倍数
年均增长率
百分点
增量比较
分数比较
截位直除
百化分
估算法
```

## 训练选项

```text
题量：5 / 10 / 20 / 50
模式：练习 / 限时 / 挑战
键盘：正序 / 乱序
反馈：立即 / 统一
错题优先：开 / 关
难度：1～5
```

## 动态出题

计算题可以通过参数模板动态生成。

不要把每一道计算题全部写进 Notion。

题目模板字段：

```text
template_id
type
difficulty
variable_rules
formula
answer_rule
explanation_template
time_limit
```

答案必须由后端验证。

---

# 十三、知识掌握度

每个知识点建立掌握度，不只是记录答对答错。

建议初版采用 0～100 分：

```text
未接触：0
刚认识：1～20
初步掌握：21～40
较熟悉：41～60
基本掌握：61～80
长期掌握：81～100
```

影响因素：

- 是否答对；
- 连续答对次数；
- 用时；
- 题型难度；
- 是否依赖提示；
- 间隔多久后仍能答对；
- 是否能完成应用题；
- 是否能完成关系题。

示例规则：

```text
首次基础题答对：+8
关系题答对：+10
应用题答对：+12
使用提示后答对：+3
答错：-5
隔 7 天复习答对：+15
连续 3 次答对：额外 +5
```

计算逻辑放在后端，前端只显示结果。

---

# 十四、间隔复习

实现简化版间隔复习算法。

初始复习节点：

```text
答错后 10 分钟
第 1 天
第 3 天
第 7 天
第 15 天
第 30 天
```

根据作答表现动态调整：

```text
完全不会：10 分钟后
模糊记得：1 天后
正常答对：3 天后
快速答对：7 天后
长期稳定：15～30 天后
```

复习页包括：

```text
今日到期
昨日错题
长期薄弱
即将遗忘
已掌握
收藏复习
```

复习完成后必须显示：

```text
今天保住了 8 个即将遗忘的知识点
```

---

# 十五、知识图谱

知识图谱不能做成复杂难看的大黑块。

采用可读性优先的“中心节点 + 分组关系卡”。

例如点击“赤壁之战”：

```text
中心：赤壁之战

时间
208 年

人物
曹操
孙权
刘备
周瑜

地点
长江赤壁

关联作品
《三国志》
《三国演义》
《赤壁赋》

相关典故
万事俱备，只欠东风
```

支持：

- 点击节点继续探索；
- 收藏节点；
- 查看掌握度；
- 进入专项练习；
- 显示尚未解锁关系；
- 展示“你已经掌握了 6 / 10 个关联知识”。

移动端不要强行展示大型力导向图。

桌面端可选用 React Flow，但默认仍采用分组关系布局。

---

# 十六、免费与付费设计

核心原则：

> 用户先体验完整价值，再出现付费。

不要一上来收费。

## 永久免费内容

必须包括：

- 游客模式；
- 首次诊断；
- 第一个完整世界的一部分；
- 每个世界第一章；
- 每日训练；
- 基础错题复习；
- 免费题目的完整基础解析；
- 连续学习；
- 基础掌握报告；
- 每日一次 Boss；
- 基础知识图谱；
- 基础计算训练。

## 付费内容

可包括：

- 完整世界；
- 高级专项路线；
- 无限自定义训练；
- 高级关系题；
- 深度知识图谱；
- 完整学习报告；
- 更长时间的数据统计；
- 无限错题保存；
- 考前冲刺路线；
- 新版本时政和政治理论；
- AI 个性化复习计划，后期再做。

## 初期商品

### 商品一：单世界永久解锁

示例：

```text
文化万象完整包
华夏纪年完整包
世界文明完整包
资料分析速算包
```

建议测试价格：

```text
9.9～29.9 元
```

价格必须在后台可配置，不写死。

### 商品二：全站远征通行证

建议测试：

```text
季度：39.9 元
年度：99 元
```

价格必须在后台可配置。

## 软付费出现时机

只在以下位置出现：

1. 完成免费章节后；
2. 主动点击锁定章节；
3. 查看高级报告；
4. 进入付费专项；
5. 7 天完整体验结束后。

不要在作答中途弹付费。

## 解锁页结构

必须先展示：

```text
本世界包含什么
适合谁
有多少章节
有哪些题型
能解决什么问题
免费试看一关
```

然后才展示价格。

按钮同时保留：

```text
继续免费复习
解锁完整世界
```

## 禁止的付费方式

禁止：

- 首屏会员弹窗；
- 强制绑定支付；
- 不付费看不到错题原因；
- 售卖体力；
- 购买正确答案；
- 假倒计时；
- 默认自动续费；
- 做题一半突然锁定；
- 免费用户无法正常使用。

---

# 十七、支付系统

第一版支付必须模块化，不绑定单一支付平台。

定义统一接口：

```ts
interface PaymentProvider {
  createOrder(input: CreateOrderInput): Promise<CreateOrderResult>;
  verifyCallback(input: unknown): Promise<VerifiedPayment>;
  queryOrder(orderId: string): Promise<OrderStatus>;
  refund(orderId: string, amount: number): Promise<RefundResult>;
}
```

先实现：

```text
MockPaymentProvider
```

用于本地开发和测试。

正式接入时再增加具体支付渠道。

支付流程：

```text
前端选择商品
→ 后端创建订单
→ 支付渠道支付
→ 支付回调到代理服务器
→ 后端验签
→ 更新 Supabase 订单
→ 创建玩家权益
→ 前端刷新权益
```

绝不能只依靠前端跳转成功页面判断支付成功。

权益表必须独立于订单表。

---

# 十八、Notion 数据库结构

建立以下数据库。

## 1. Worlds

字段：

```text
WorldID
Name
Slug
Description
Cover
Theme
Sort
FreeChapterCount
Published
Version
```

## 2. Chapters

```text
ChapterID
WorldID
Name
Description
Order
Cover
UnlockRule
IsFree
ProductID
Published
Version
```

## 3. Levels

```text
LevelID
ChapterID
Name
LevelType
Order
Description
PassScore
TimeLimit
RewardXP
RewardCoins
RequiredLevelID
Published
Version
```

## 4. KnowledgePoints

```text
KnowledgeID
Name
World
Category1
Category2
Summary
CoreFact
Time
Person
Place
Work
Event
UsageScene
CommonMistake
MemoryTip
Difficulty
StableOrCurrent
Source
SourceDate
ReviewStatus
Published
Version
```

## 5. Relations

```text
RelationID
SourceKnowledgeID
RelationType
TargetKnowledgeID
Label
Weight
Description
Published
Version
```

关系类型示例：

```text
人物—事件
人物—作品
人物—朝代
成语—人物
成语—典故
诗词—诗人
诗词—地点
战役—时间
战役—人物
典籍—作者
典籍—朝代
发明—人物
制度—朝代
```

## 6. Questions

```text
QuestionID
KnowledgeID
LevelID
QuestionType
Stem
OptionA
OptionB
OptionC
OptionD
CorrectAnswer
Explanation
WrongOptionExplanation
Hint
Difficulty
TimeLimit
Tags
Source
ReviewStatus
Published
Version
```

## 7. FormulaTemplates

```text
TemplateID
Name
Category
Difficulty
VariableRules
Formula
AnswerRule
ExplanationTemplate
TimeLimit
Published
Version
```

## 8. Products

```text
ProductID
Name
ProductType
Description
Price
OriginalPrice
EntitlementCode
Active
Sort
```

## 9. ReleaseVersions

```text
ReleaseID
Version
Status
PublishedAt
Notes
ContentHash
```

---

# 十九、Supabase 数据表

至少建立：

```text
profiles
guest_accounts
user_goals
worlds
chapters
levels
knowledge_points
knowledge_relations
questions
formula_templates
learning_sessions
question_attempts
knowledge_mastery
review_schedule
wrong_questions
favorites
chapter_progress
level_progress
achievements
user_achievements
daily_tasks
daily_task_progress
streaks
products
orders
payment_events
entitlements
content_releases
sync_logs
leaderboards
```

## 核心字段示例

### knowledge_mastery

```text
id
user_id
knowledge_id
mastery_score
correct_count
wrong_count
streak_correct
last_result
last_reviewed_at
next_review_at
status
created_at
updated_at
```

### question_attempts

```text
id
user_id
session_id
question_id
answer
is_correct
time_spent_ms
used_hint
mastery_delta
created_at
```

### entitlements

```text
id
user_id
entitlement_code
source_order_id
starts_at
expires_at
status
created_at
```

必须配置 RLS。

普通用户只能读取和修改自己的玩家数据。

题目答案不能通过匿名数据库查询暴露给前端。

---

# 二十、API 设计

建议接口：

## 公共

```text
GET  /api/v1/config
GET  /api/v1/worlds
GET  /api/v1/worlds/:id
GET  /api/v1/chapters/:id
GET  /api/v1/products
```

## 身份

```text
POST /api/v1/auth/guest
POST /api/v1/auth/merge-guest
GET  /api/v1/me
```

## 学习

```text
POST /api/v1/diagnosis/start
POST /api/v1/diagnosis/submit
POST /api/v1/sessions/start
GET  /api/v1/sessions/:id/question
POST /api/v1/sessions/:id/answer
POST /api/v1/sessions/:id/complete
GET  /api/v1/progress
GET  /api/v1/mastery
```

## 复习

```text
GET  /api/v1/review/today
POST /api/v1/review/start
POST /api/v1/review/:sessionId/answer
GET  /api/v1/wrong-questions
```

## 图谱

```text
GET  /api/v1/knowledge/:id
GET  /api/v1/knowledge/:id/relations
GET  /api/v1/knowledge/:id/practice
```

## 订单

```text
POST /api/v1/orders
GET  /api/v1/orders/:id
POST /api/v1/payments/callback/:provider
GET  /api/v1/entitlements
```

## 内容同步

仅管理员：

```text
POST /api/v1/admin/sync/notion
GET  /api/v1/admin/sync/status
POST /api/v1/admin/release
```

---

# 二十一、安全要求

必须实现：

1. 所有输入使用 Zod 校验；
2. API 限流；
3. CORS 白名单；
4. Helmet 或等价安全响应头；
5. Notion Token 只在服务端；
6. Supabase Service Role Key 只在服务端；
7. 题目答案不下发；
8. 奖励由服务端计算；
9. 前端不能直接提交金币、星级或通关状态；
10. 支付回调必须验签；
11. 防止重复领取奖励；
12. 订单回调必须幂等；
13. 防止重复提交同一题获得奖励；
14. 管理接口必须有独立管理员鉴权；
15. 日志不得记录密码、Token 和完整支付信息；
16. 服务器日志自动轮转；
17. 禁止把数据库密钥写进 GitHub 仓库；
18. 提供 `.env.example`。

---

# 二十二、视觉设计

整体气质：

```text
知识地图
探险手册
轻游戏化
高级但不沉重
有文化感但不古板
```

避免：

- 大面积浅绿色工具界面；
- 后台管理风；
- 所有卡片尺寸一样；
- 廉价卡通；
- 过度霓虹；
- 过度玻璃拟态；
- 满屏小按钮；
- 复杂大黑块知识图谱。

## 配色建议

基础背景：

```text
#F5F1E8
#EEE7D8
#17211D
```

主色：

```text
#2E5B4F
```

强调色：

```text
#B4553D
#C49A4A
#496A8A
```

文字：

```text
#1C241F
#657068
```

不同世界使用不同辅助色，但整体保持统一。

## 字体

中文：

```text
Noto Serif SC
Noto Sans SC
```

数字和英文：

```text
Inter
Cormorant Garamond
```

## 动效

使用克制的动效：

- 地图路径点亮；
- 关卡解锁；
- 纸张展开；
- 星级结算；
- 知识节点浮现；
- 答题反馈；
- Boss 通关；
- 页面淡入。

支持 `prefers-reduced-motion`。

---

# 二十三、响应式要求

优先适配：

```text
390 × 844
430 × 932
768 × 1024
1440 × 900
```

移动端：

- 底部导航；
- 单手操作；
- 主要按钮触控区域不小于 44px；
- 不出现横向溢出；
- 作答区固定易操作；
- 键盘弹起时页面不乱。

桌面端：

- 地图和知识图谱可更宽；
- 左右分栏；
- 保持内容聚焦；
- 最大内容宽度控制在 1440～1600px。

---

# 二十四、PWA

实现基础 PWA：

- 可添加到桌面；
- manifest；
- 图标；
- 基础缓存；
- 离线打开壳页面；
- 网络断开提示；
- 不缓存敏感接口；
- 新版本提示刷新。

---

# 二十五、内容审核与版本

内容分两类：

## 稳定知识

例如：

- 古代文化；
- 成语典故；
- 古代史；
- 古诗词；
- 基础数学公式。

## 时效知识

例如：

- 时政；
- 政治理论；
- 现行法律；
- 国际组织数据；
- 统计数据。

时效知识必须包含：

```text
适用年份
更新时间
来源日期
审核状态
版本号
```

前端显示：

```text
适用版本：2026
最近更新：2026-xx-xx
```

不要把旧版本内容继续当成当前内容展示。

---

# 二十六、数据分析

记录但不要过度采集。

至少统计：

```text
首次进入完成率
诊断完成率
首关完成率
首个 Boss 完成率
次日留存
7 日留存
每日学习时长
各章节退出率
错题率
复习完成率
付费页访问率
试看完成率
下单率
支付成功率
```

后台第一版不需要做复杂管理系统，可以先通过 Supabase 查询和简单统计页面查看。

---

# 二十七、项目目录建议

```text
knowledge-expedition/
├─ apps/
│  ├─ web/
│  └─ api/
├─ packages/
│  ├─ shared/
│  ├─ game-engine/
│  ├─ content-schema/
│  └─ ui/
├─ supabase/
│  ├─ migrations/
│  ├─ seed/
│  └─ policies/
├─ docs/
│  ├─ architecture.md
│  ├─ notion-schema.md
│  ├─ api.md
│  ├─ deployment.md
│  └─ content-guide.md
├─ .github/
│  └─ workflows/
├─ package.json
├─ pnpm-workspace.yaml
└─ README.md
```

推荐使用 pnpm workspace。

---

# 二十八、开发阶段

## 阶段一：项目骨架

完成：

- Monorepo；
- React 前端；
- Fastify API；
- Supabase 连接；
- 环境变量；
- GitHub Pages 部署；
- API 部署说明；
- 基础 CI。

## 阶段二：核心闭环

完成：

- 首次引导；
- 游客模式；
- 地图；
- 章节；
- 作答；
- 后端判题；
- 结果页；
- 进度；
- 掌握度。

## 阶段三：复习与图谱

完成：

- 错题；
- 今日复习；
- 间隔复习；
- 知识关系；
- 掌握度视图。

## 阶段四：内容同步

完成：

- Notion 数据读取；
- 内容校验；
- 发布到 Supabase；
- 同步日志；
- 版本管理。

## 阶段五：付费

完成：

- 商品页；
- 权益；
- Mock 支付；
- 订单；
- 回调；
- 解锁逻辑；
- 软付费页面。

## 阶段六：优化

完成：

- PWA；
- 动效；
- 性能；
- 无障碍；
- 移动端细节；
- 错误监控；
- 测试。

---

# 二十九、验收标准

MVP 必须满足：

1. 用户可以不注册进入；
2. 可以选择学习目标；
3. 可以完成 10 题诊断；
4. 可以获得推荐路线；
5. 可以进入知识地图；
6. 可以开始关卡；
7. 题目答案不在前端源码中；
8. 后端能正确判题；
9. 可以查看答案解析；
10. 可以记录进度；
11. 可以生成错题；
12. 可以安排下一次复习；
13. 可以查看知识点掌握度；
14. 可以查看知识关系；
15. 可以完成章节 Boss；
16. 可以看到软付费解锁页；
17. 免费用户仍能继续复习；
18. Mock 支付完成后可以获得权益；
19. 刷新页面后进度不丢失；
20. 服务器不保存业务数据库或玩家文件；
21. GitHub Pages 可正常部署；
22. 移动端无横向滚动；
23. Lighthouse 基础性能可接受；
24. README 中包含完整部署步骤；
25. 提供测试账号和示例数据。

---

# 三十、代码要求

1. TypeScript 开启严格模式；
2. 不使用大量 `any`；
3. 组件职责清晰；
4. 业务逻辑和 UI 分离；
5. API 有统一错误结构；
6. 提供 loading、empty、error 状态；
7. 关键逻辑提供单元测试；
8. 支付和奖励逻辑提供测试；
9. 内容同步提供校验报告；
10. 不要只写伪代码；
11. 不要留大量未实现按钮；
12. 不要为了展示效果写死用户数据；
13. 先做稳定的核心闭环，再做装饰动画；
14. 每完成一个阶段，更新 README 和变更记录。

---

# 三十一、启动指令

请按以下顺序开始：

1. 先输出你对项目架构的理解；
2. 输出你准备创建的目录结构；
3. 输出数据库迁移计划；
4. 输出第一阶段实施清单；
5. 然后直接开始创建项目；
6. 不要只给建议；
7. 遇到缺失的密钥时，使用 `.env.example` 和 Mock 数据继续开发；
8. 不要因为暂时没有 Notion 或 Supabase 密钥而停止；
9. 所有外部服务必须提供可替换适配层；
10. 第一目标是完成可以本地运行的完整 MVP。

项目名称固定为：

```text
知识远征
```

品牌文案：

```text
把零散知识，走成一张自己的地图。
```

先完成可运行版本，再逐步扩展成语、诗词、世界历史、科技、生物、政治理论、法律常识、资料分析和数量关系。
