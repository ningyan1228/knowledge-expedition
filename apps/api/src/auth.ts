import { createClient, type User } from "@supabase/supabase-js";
import { createHash, randomBytes } from "node:crypto";
import type { FastifyRequest } from "fastify";

export type AuthContext = { userId: string; email: string | null; isAnonymous: boolean };
type EmailEvent = { timestamp: number; emailHash: string; ip: string };
type MergeTicket = { guestUserId: string; expiresAt: number; used: boolean };

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = supabaseUrl && serviceKey ? createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
const emailEvents: EmailEvent[] = [];
const mergeTickets = new Map<string, MergeTicket>();
const cooldownSeconds = Number(process.env.AUTH_EMAIL_COOLDOWN_SECONDS ?? 60);
const maxPerWindow = Number(process.env.AUTH_EMAIL_MAX_PER_15_MIN ?? 3);
const maxPerIpHour = Number(process.env.AUTH_EMAIL_MAX_PER_IP_HOUR ?? 8);

function hash(value: string) { return createHash("sha256").update(value).digest("hex"); }
function authHeader(request: FastifyRequest) { const value = request.headers.authorization; return value?.startsWith("Bearer ") ? value.slice(7) : null; }
function userContext(user: User): AuthContext { return { userId: user.id, email: user.email ?? null, isAnonymous: Boolean(user.is_anonymous) }; }

export async function optionalAuth(request: FastifyRequest): Promise<AuthContext | null> {
  const token = authHeader(request);
  if (!token || !supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return error || !data.user ? null : userContext(data.user);
}

export async function requireAuth(request: FastifyRequest): Promise<AuthContext> {
  const context = await optionalAuth(request);
  if (!context) { const error = new Error("请先开始远征或登录账号"); (error as Error & { statusCode: number }).statusCode = 401; throw error; }
  return context;
}

export async function requirePermanentUser(request: FastifyRequest): Promise<AuthContext> {
  const context = await requireAuth(request);
  if (context.isAnonymous) { const error = new Error("请先绑定邮箱后再使用此功能"); (error as Error & { statusCode: number }).statusCode = 403; throw error; }
  return context;
}

export async function registerEmailRequest(request: FastifyRequest, email: string, eventType: "bind" | "login") {
  const now = Date.now(); const emailHash = hash(email.toLowerCase()); const ip = request.ip;
  const recent = emailEvents.filter(event => event.timestamp > now - 15 * 60_000);
  const byEmail = recent.filter(event => event.emailHash === emailHash);
  const byIp = emailEvents.filter(event => event.timestamp > now - 60 * 60_000 && event.ip === ip);
  const latest = emailEvents.filter(event => event.emailHash === emailHash).at(-1);
  if (latest && now - latest.timestamp < cooldownSeconds * 1000) return { allowed: false, retryAfter: Math.ceil((cooldownSeconds * 1000 - (now - latest.timestamp)) / 1000) };
  if (byEmail.length >= maxPerWindow || byIp.length >= maxPerIpHour) return { allowed: false, retryAfter: cooldownSeconds };
  emailEvents.push({ timestamp: now, emailHash, ip });
  while (emailEvents.length && emailEvents[0]!.timestamp < now - 60 * 60_000) emailEvents.shift();
  const context = await optionalAuth(request);
  if (supabaseAdmin) await supabaseAdmin.from("auth_email_events").insert({ user_id: context?.userId ?? null, email_hash: emailHash, event_type: eventType, status: "requested", provider: process.env.RESEND_API_KEY ? "resend-smtp" : "supabase-default" });
  return { allowed: true, retryAfter: cooldownSeconds };
}

export async function verifyTurnstile(token: string | undefined, remoteIp: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: process.env.NODE_ENV !== "production", skipped: true };
  if (!token) return { ok: false, skipped: false };
  const body = new URLSearchParams({ secret, response: token, remoteip: remoteIp });
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  const result = await response.json() as { success?: boolean };
  return { ok: Boolean(result.success), skipped: false };
}

export async function createMergeTicket(request: FastifyRequest) {
  const context = await requireAuth(request);
  if (!context.isAnonymous) { const error = new Error("当前账号无需合并"); (error as Error & { statusCode: number }).statusCode = 400; throw error; }
  const rawToken = randomBytes(32).toString("base64url"); const tokenHash = hash(rawToken); const expiresAt = new Date(Date.now() + 15 * 60_000);
  mergeTickets.set(tokenHash, { guestUserId: context.userId, expiresAt: expiresAt.getTime(), used: false });
  if (supabaseAdmin) await supabaseAdmin.from("account_merge_tickets").insert({ token_hash: tokenHash, guest_user_id: context.userId, expires_at: expiresAt.toISOString() });
  return { token: rawToken, expiresAt: expiresAt.toISOString() };
}

export async function consumeMergeTicket(request: FastifyRequest, token: string) {
  const permanent = await requirePermanentUser(request); const tokenHash = hash(token); let local = mergeTickets.get(tokenHash);
  if (!local && supabaseAdmin) { const { data } = await supabaseAdmin.from("account_merge_tickets").select("guest_user_id, expires_at, used_at").eq("token_hash", tokenHash).maybeSingle(); if (data) local = { guestUserId: data.guest_user_id, expiresAt: new Date(data.expires_at).getTime(), used: Boolean(data.used_at) }; }
  if (!local || local.used || local.expiresAt < Date.now()) { const error = new Error("合并凭证无效或已过期"); (error as Error & { statusCode: number }).statusCode = 400; throw error; }
  local.used = true;
  if (supabaseAdmin) {
    const { error } = await supabaseAdmin.rpc("merge_guest_progress", { merge_token_hash: tokenHash, permanent_user_id: permanent.userId });
    if (error) throw error;
  }
  return { merged: true };
}

export async function saveSupabaseMastery(userId: string | null, input: { knowledgeId: string; score: number; correct: boolean; nextReviewAt: string }) {
  if (!supabaseAdmin || !userId) return;
  const { data: existing } = await supabaseAdmin.from("knowledge_mastery").select("mastery_score, correct_count, wrong_count, streak_correct").eq("user_id", userId).eq("knowledge_id", input.knowledgeId).maybeSingle();
  const correctCount = (existing?.correct_count ?? 0) + (input.correct ? 1 : 0); const wrongCount = (existing?.wrong_count ?? 0) + (input.correct ? 0 : 1);
  await supabaseAdmin.from("knowledge_mastery").upsert({ user_id: userId, knowledge_id: input.knowledgeId, mastery_score: Math.max(existing?.mastery_score ?? 0, input.score), correct_count: correctCount, wrong_count: wrongCount, streak_correct: input.correct ? (existing?.streak_correct ?? 0) + 1 : 0, last_result: input.correct, last_reviewed_at: new Date().toISOString(), next_review_at: input.nextReviewAt, status: input.score >= 80 ? "mastered" : "learning", updated_at: new Date().toISOString() }, { onConflict: "user_id,knowledge_id" });
}
