# 知识远征

> 把零散知识，走成一张自己的地图。

移动优先的知识闯关 MVP，包含首次引导、营地、世界地图、服务端判题、结果与掌握度、间隔复习、知识图谱、软付费页和 Mock 支付适配层。

## 本地运行

要求 Node.js 22 与 pnpm 10。

```bash
pnpm install
copy .env.example .env
pnpm dev
```

Web 默认 `http://localhost:5173`，API 默认 `http://localhost:8787`。没有 Notion/Supabase 密钥时自动使用 Mock 内容与本地玩家状态，核心流程仍可运行。

```bash
pnpm typecheck
pnpm test
pnpm build
```

数据库先执行 `supabase/migrations/001_initial.sql`，再执行 `supabase/seed/seed.sql`。部署说明见 `docs/deployment.md`。

## 测试身份

当前 MVP 无需账号：点击“开始我的远征”即创建浏览器本地游客进度。清除 localStorage 中 `knowledge-expedition-player` 可重置体验。

## 变更记录

- 0.1.0：完成项目骨架与可运行游客学习闭环；加入三世界地图、掌握度/复习算法、API 安全基线、Supabase 初始迁移、PWA、CI 与 Pages 工作流。
