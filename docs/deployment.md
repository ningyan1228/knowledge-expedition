# 部署

Web 由 `.github/workflows/pages.yml` 构建并发布到 GitHub Pages。若仓库名不是 `knowledge-expedition`，同步修改 `apps/web/vite.config.ts` 的 Pages base。

API/代理层部署到腾讯云 `~/projects/knowledge-expedition-proxy`，加入现有 Docker `web` 网络，由 nginx-proxy 与 acme-companion 提供 HTTPS：

```bash
cd ~/projects/knowledge-expedition-proxy
cp .env.example .env
docker compose -f docker-compose.api.yml up -d --build
docker compose -f docker-compose.api.yml logs -f --tail=100
```

服务器 `.env` 中填写 `LETSENCRYPT_EMAIL`、实际 GitHub Pages 来源 `WEB_ORIGIN`，以及 Supabase/Notion 服务端密钥。前端生产构建固定使用 `https://knowledge-expedition-api.gjsx.uno/api/v1`，服务器不保存玩家文件或本地业务数据库。

DNS 需增加 A 记录：主机记录 `knowledge-expedition-api`，记录值 `43.128.149.75`。生效后检查 `https://knowledge-expedition-api.gjsx.uno/health`。
