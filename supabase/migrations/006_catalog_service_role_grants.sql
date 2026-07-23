-- 题库表保持启用 RLS，浏览器端没有 SELECT 权限。
-- 腾讯云 API 使用 Supabase 的 secret/service_role key，在服务端读取完整题目与答案。
-- Supabase Data API 的新默认权限不会自动授予 service_role，因此这里显式最小授权。

grant usage on schema public to service_role;

grant select on table
  public.worlds,
  public.chapters,
  public.levels,
  public.knowledge_points,
  public.questions
to service_role;
