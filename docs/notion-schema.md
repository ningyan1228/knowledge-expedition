# Notion 内容模型

按需求书创建 Worlds、Chapters、Levels、KnowledgePoints、Relations、Questions、FormulaTemplates、Products、ReleaseVersions 九个数据库。所有内容表必须具有 `Published` 与 `Version`；Questions 的答案仅由同步任务写入服务端数据库。发布流程为：编辑 → 审核 → Zod 校验 → 单事务写入 Supabase → 写入 release 与 sync log。
