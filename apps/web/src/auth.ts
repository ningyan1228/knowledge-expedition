import { createClient, type Session, type User } from "@supabase/supabase-js";
import { create } from "zustand";

export type AuthMode = "loading" | "guest" | "permanent" | "signed_out";
export type AuthDialogIntent = "bind" | "login";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
const mockIdentityKey = "knowledge-expedition-mock-identity";
const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim();

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  : null;

type AuthState = {
  mode: AuthMode;
  initialized: boolean;
  isAnonymous: boolean;
  user: User | null;
  session: Session | null;
  dialog: AuthDialogIntent | null;
  pendingEmail: string | null;
  pendingMergeToken: string | null;
  init: () => Promise<void>;
  startGuest: (captchaToken?: string) => Promise<void>;
  requestBindEmail: (email: string, captchaToken?: string) => Promise<void>;
  verifyBindEmail: (email: string, token: string) => Promise<void>;
  requestLoginEmail: (email: string, captchaToken?: string) => Promise<void>;
  verifyLoginEmail: (email: string, token: string) => Promise<void>;
  updateDisplayName: (displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  openDialog: (intent: AuthDialogIntent) => void;
  closeDialog: () => void;
};

function modeFor(user: User | null): AuthMode {
  if (!user) return "signed_out";
  return user.is_anonymous ? "guest" : "permanent";
}

function mockUser(id: string, email?: string, displayName?: string): User {
  return { id, app_metadata: {}, user_metadata: displayName ? { display_name: displayName } : {}, aud: "authenticated", created_at: new Date().toISOString(), is_anonymous: !email, email } as User;
}

export function displayNameFor(user: User | null): string {
  const displayName = user?.user_metadata?.display_name;
  return typeof displayName === "string" && displayName.trim() ? displayName.trim() : "远征者";
}

function friendlyError(error: unknown): Error {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("rate") || message.includes("too many")) return new Error("验证码发送较频繁，请稍后再试");
  if (message.includes("already") || message.includes("exists")) return new Error("该邮箱已有账号，请使用“继续上次远征”登录后合并进度");
  if (message.includes("captcha")) return new Error("安全验证未通过，请刷新后重试");
  if (message.includes("invalid") || message.includes("expired")) return new Error("验证码不正确或已过期，请重新获取");
  return new Error("当前记录已保留，请稍后再试");
}

async function captchaPreflight(captchaToken: string | undefined, session: Session | null) {
  if (!apiUrl || !captchaToken) return;
  const response = await fetch(`${apiUrl}/auth/turnstile/verify`, { method: "POST", headers: { "content-type": "application/json", ...(session ? { authorization: `Bearer ${session.access_token}` } : {}) }, body: JSON.stringify({ token: captchaToken }) });
  if (!response.ok) throw new Error("安全验证未通过，请刷新后重试");
}
async function emailPreflight(email: string, eventType: "bind" | "login", session: Session | null, captchaToken?: string) {
  if (!apiUrl) return;
  await captchaPreflight(captchaToken, session);
  const response = await fetch(`${apiUrl}/auth/email/request`, { method: "POST", headers: { "content-type": "application/json", ...(session ? { authorization: `Bearer ${session.access_token}` } : {}) }, body: JSON.stringify({ email, eventType }) });
  if (!response.ok) throw friendlyError(await response.json().catch(() => null));
}
async function apiAuthCall<T>(path: string, session: Session | null, body?: unknown): Promise<T> {
  if (!apiUrl || !session) throw new Error("当前记录已保留，请稍后再试");
  const response = await fetch(`${apiUrl}${path}`, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${session.access_token}` }, ...(body ? { body: JSON.stringify(body) } : {}) });
  if (!response.ok) throw new Error("当前记录已保留，请稍后再试");
  return response.json() as Promise<T>;
}

export const useAuth = create<AuthState>((set, get) => ({
  mode: "loading", initialized: false, isAnonymous: false, user: null, session: null, dialog: null, pendingEmail: null, pendingMergeToken: null,
  init: async () => {
    if (!supabase) {
      const raw = sessionStorage.getItem(mockIdentityKey);
      const parsed = raw ? JSON.parse(raw) as { id: string; email?: string; displayName?: string } : null;
      const user = parsed ? mockUser(parsed.id, parsed.email, parsed.displayName) : null;
      set({ user, mode: modeFor(user), isAnonymous: Boolean(user?.is_anonymous), initialized: true });
      return;
    }
    const { data } = await supabase.auth.getSession();
    set({ user: data.session?.user ?? null, session: data.session, mode: modeFor(data.session?.user ?? null), isAnonymous: Boolean(data.session?.user?.is_anonymous), initialized: true });
    supabase.auth.onAuthStateChange((_event, session) => set({ user: session?.user ?? null, session, mode: modeFor(session?.user ?? null), isAnonymous: Boolean(session?.user?.is_anonymous) }));
  },
  startGuest: async (captchaToken) => {
    if (!supabase) {
      const id = crypto.randomUUID(); const user = mockUser(id); sessionStorage.setItem(mockIdentityKey, JSON.stringify({ id })); set({ user, session: null, mode: "guest", isAnonymous: true }); return;
    }
    if (import.meta.env.PROD && (!turnstileSiteKey || !captchaToken)) throw new Error("请先完成安全验证");
    await captchaPreflight(captchaToken, get().session);
    const { data, error } = await supabase.auth.signInAnonymously({ options: captchaToken ? { captchaToken } : {} });
    if (error) throw friendlyError(error);
    set({ user: data.user, session: data.session, mode: "guest", isAnonymous: true });
  },
  requestBindEmail: async (email, captchaToken) => {
    await emailPreflight(email, "bind", get().session, captchaToken);
    if (!supabase) { set({ pendingEmail: email }); return; }
    if (import.meta.env.PROD && (!turnstileSiteKey || !captchaToken)) throw new Error("请先完成安全验证");
    // supabase-js 2.110 exposes no captchaToken option on updateUser; the proxy preflight above verifies Turnstile before this identity-linking request.
    const { error } = await supabase.auth.updateUser({ email }, { emailRedirectTo: window.location.origin });
    if (error) {
      const message = error.message.toLowerCase();
      if ((message.includes("already") || message.includes("exists")) && get().session) {
        const ticket = await apiAuthCall<{ token: string }>("/auth/merge-ticket", get().session);
        set({ pendingEmail: email, pendingMergeToken: ticket.token });
      }
      throw friendlyError(error);
    }
    set({ pendingEmail: email });
  },
  verifyBindEmail: async (email, token) => {
    if (!supabase) { if (token !== "123456") throw new Error("验证码不正确，请检查后重新输入"); const current = get().user; if (!current) throw new Error("游客会话已失效，请重新开始远征"); const displayName = displayNameFor(current); const user = mockUser(current.id, email, displayName); sessionStorage.setItem(mockIdentityKey, JSON.stringify({ id: current.id, email, displayName })); set({ user, mode: "permanent", isAnonymous: false, pendingEmail: null }); return; }
    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: "email_change" });
    if (error) throw friendlyError(error);
    const session = data.session ?? (await supabase.auth.getSession()).data.session;
    set({ user: session?.user ?? data.user ?? null, session, mode: "permanent", isAnonymous: false, pendingEmail: null });
  },
  requestLoginEmail: async (email, captchaToken) => {
    await emailPreflight(email, "login", get().session, captchaToken);
    if (!supabase) { set({ pendingEmail: email }); return; }
    if (import.meta.env.PROD && (!turnstileSiteKey || !captchaToken)) throw new Error("请先完成安全验证");
    // 首次输入的新邮箱也应创建正式账户；游客账号可在后续完成绑定。
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: window.location.origin, ...(captchaToken ? { captchaToken } : {}) } });
    if (error) throw friendlyError(error); set({ pendingEmail: email });
  },
  verifyLoginEmail: async (email, token) => {
    if (!supabase) { if (token !== "123456") throw new Error("验证码不正确，请检查后重新输入"); const user = mockUser(crypto.randomUUID(), email); sessionStorage.setItem(mockIdentityKey, JSON.stringify({ id: user.id, email })); set({ user, mode: "permanent", isAnonymous: false, pendingEmail: null }); return; }
    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
    if (error) throw friendlyError(error);
    const mergeToken = get().pendingMergeToken;
    if (mergeToken) await apiAuthCall("/auth/merge", data.session, { token: mergeToken });
    set({ user: data.user, session: data.session, mode: "permanent", isAnonymous: false, pendingEmail: null, pendingMergeToken: null });
  },
  updateDisplayName: async displayName => {
    const normalized = displayName.trim().replace(/\s+/g, " ");
    if (normalized.length < 2 || normalized.length > 16) throw new Error("昵称请使用 2–16 个字符");
    const current = get().user;
    if (!current) throw new Error("请先登录后再修改昵称");
    if (!supabase) {
      const user = mockUser(current.id, current.email, normalized);
      sessionStorage.setItem(mockIdentityKey, JSON.stringify({ id: current.id, email: current.email, displayName: normalized }));
      set({ user });
      return;
    }
    const { data, error } = await supabase.auth.updateUser({ data: { display_name: normalized } });
    if (error) throw friendlyError(error);
    set({ user: data.user ?? current });
  },
  signOut: async () => { if (supabase) await supabase.auth.signOut(); sessionStorage.removeItem(mockIdentityKey); set({ user: null, session: null, mode: "signed_out", isAnonymous: false }); },
  openDialog: intent => set({ dialog: intent, pendingEmail: intent === "login" ? get().pendingEmail : null }), closeDialog: () => set({ dialog: null, pendingEmail: null }),
}));

export function getAccessToken() { return useAuth.getState().session?.access_token; }
export function usingMockAuth() { return !supabase; }
