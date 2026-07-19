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

## UI 架构（2026-07）

前端采用“深色营地 + 浅色羊皮纸”双主题：`AppShell` 负责桌面侧栏、移动底部导航和状态栏；`components/game-ui.tsx` 提供世界岛、关卡节点、答题选项、解析、复习卡、知识节点和状态组件；`mock-content.ts` 将六个世界的展示数据与后端数据边界分开。

主要体验路径：`/camp` 营地 → `/map` 六世界地图 → `/world/:id` 章节路线 → `/battle/:levelId` 答题与解析 → `/result/:sessionId` 结算；复习、图谱、个人中心、商城和排行榜继续使用既有路由与 API/本地状态，不改变服务器接口。

UI 使用 CSS 变量统一颜色、间距与圆角，并在 760px 以下切换为移动导航、纵向章节路线和单列答题布局；同时支持 `prefers-reduced-motion`。

## 登录与账号绑定（免费方案）

默认体验是“游客先玩”：点击“开始我的远征”会创建 Supabase Anonymous Auth 身份；游客可以学习、答题和看解析。完成首个 Boss 后才会出现“保存远征进度”提示，用户可以暂时跳过。绑定邮箱使用 6 位 OTP，绑定成功后保留原来的 `auth.users.id`，因此学习进度不需要复制。

开发阶段可使用 Supabase 内置邮件做少量调试；正式上线时在 Supabase Authentication 的 SMTP Settings 填写 Resend Free Custom SMTP：主机 `smtp.resend.com`、端口 `465`、用户名 `resend`、密码为 Resend API Key、发件人为 `知识远征 <login@auth.101921.xyz>`。先在 Resend 验证 `auth.101921.xyz`，并按 Resend 控制台提供的 SPF/DKIM 记录配置 DNS；不要把 API Key、Service Role Key 或 SMTP 密码提交到 GitHub。正式发布前请在 Resend 官方价格页复核当前免费额度和日发送限制；本项目不会接短信、不会自动升级套餐、不会因额度耗尽切换付费服务。

Supabase 设置步骤：启用 Anonymous Sign-Ins、Email OTP 和 Manual Identity Linking；将验证码邮件模板改为 6 位 `{{ .Token }}`；在 URL Configuration 中仅添加 `https://expedition.101921.xyz` 与本地开发地址。运行 `supabase/migrations/001_initial.sql` 后再运行 `supabase/migrations/002_auth_and_account_linking.sql`。

GitHub Pages 使用 Repository Variables（不是 Secret）提供 `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`、`VITE_TURNSTILE_SITE_KEY`；腾讯云 API 的 `.env` 使用 `SUPABASE_URL`、`SUPABASE_SERVICE_ROLE_KEY`、`TURNSTILE_SECRET_KEY`、`AUTH_EMAIL_COOLDOWN_SECONDS=60`、`AUTH_EMAIL_MAX_PER_15_MIN=3`、`AUTH_EMAIL_MAX_PER_IP_HOUR=8`。Turnstile 的 secret、Resend API Key、Service Role Key 仅放服务器 `.env`。未填写 Supabase 变量时，前端会使用开发 Mock Adapter，便于实现与视觉测试；这不是正式账号服务。

若游客输入的是已存在邮箱，应先通过“继续上次远征”登录原账号，再使用一次性合并凭证合并进度。合并只取更高关卡成绩/掌握度并去重错题，不直接累加金币、经验、订单或权益。
