import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { BookOpen, Brain, Check, ChevronDown, ChevronRight, CircleHelp, Compass, Flag, Gem, Home, LockKeyhole, LogOut, Map, Medal, Network, ScrollText, ShieldCheck, ShoppingBag, Sparkles, Swords, Trophy, UserRound, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { Level, PublicQuestion } from "@expedition/shared";
import type { ExpeditionWorld } from "../mock-content";
import { api, type PlayerProfile } from "../api";
import { displayNameFor, useAuth } from "../auth";

const emptyProfile: PlayerProfile = {
  xp: 0, coins: 0, stars: 0, completedLevels: 0, masteryCount: 0,
  totalQuestions: 0, correctAnswers: 0, correctRate: 0, studyDays: 0,
  streak: 0, masteryRate: 0, weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
};

export function ProgressBar({ value, tone = "gold", label }: { value: number; tone?: "gold" | "green" | "violet" | "blue"; label?: string }) {
  return <div className="mastery-bar" aria-label={label ?? `进度 ${value}%`}><i className={`tone-${tone}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>;
}

export function ProgressRing({ value, label = "今日完成度" }: { value: number; label?: string }) {
  return <div className="progress-ring" style={{ "--progress": `${value * 3.6}deg` } as CSSProperties} aria-label={`${label} ${value}%`}><div><strong>{value}%</strong><span>{label}</span></div></div>;
}

export function TopStatusBar({ dark = false }: { dark?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [profile, setProfile] = useState<PlayerProfile>(emptyProfile);
  const navigate = useNavigate();
  const signOut = useAuth(state => state.signOut);
  const user = useAuth(state => state.user);
  const mode = useAuth(state => state.mode);
  const accountLabel = mode === "permanent" ? user?.email ?? "已登录账号" : "当前为游客模式";
  const displayName = displayNameFor(user);
  const avatar = displayName.slice(0, 1) || "远";
  const level = Math.max(1, Math.floor(profile.xp / 300) + 1);

  useEffect(() => {
    let disposed = false;
    void api.profile().then(data => { if (!disposed) setProfile(data); }).catch(() => { if (!disposed) setProfile(emptyProfile); });
    return () => { disposed = true; };
  }, [user?.id]);

  async function handleSignOut() {
    if (!window.confirm("确定退出当前账号吗？退出后可随时重新登录继续学习。")) return;
    setSigningOut(true);
    try {
      await signOut();
      navigate("/", { replace: true });
    } catch {
      window.alert("退出登录暂时失败，请稍后再试。");
      setSigningOut(false);
    }
  }

  return <div className={`top-status ${dark ? "is-dark" : ""}`} aria-label="远征者状态">
    <span><Sparkles /> 连续学习 <b>{profile.streak} 天</b></span><span><Trophy /> <b>{profile.coins}</b></span><span><Gem /> <b>{profile.stars}</b></span>
    <div className="account-menu">
      <button type="button" className="account-menu-trigger" aria-expanded={menuOpen} aria-haspopup="menu" onClick={() => setMenuOpen(open => !open)}>
        <span className="status-avatar" aria-hidden="true">{avatar}</span><span className="level-label">{displayName} Lv.{level}</span><ChevronDown aria-hidden="true" />
      </button>
      {menuOpen && <div className="account-menu-popover" role="menu">
        <div className="account-menu-summary"><span className="status-avatar" aria-hidden="true">{avatar}</span><div><b>{displayName} Lv.{level}</b><small>{accountLabel}</small></div></div>
        <Link to="/account" role="menuitem" onClick={() => setMenuOpen(false)}><UserRound />账号与隐私</Link>
        <button type="button" role="menuitem" disabled={signingOut} onClick={() => void handleSignOut()}><LogOut />{signingOut ? "正在退出…" : "退出登录"}</button>
      </div>}
    </div>
  </div>;
}

const desktopNav = [
  ["/camp", Home, "营地"], ["/map", Map, "地图"], ["/review", Brain, "复习"], ["/graph", Network, "图谱"], ["/store", ShoppingBag, "商城"], ["/profile", UserRound, "我的"],
] as const;

export function DesktopSidebar() {
  const path = useLocation().pathname;
  return <aside className="desktop-sidebar"><Link to="/camp" className="sidebar-brand" aria-label="知识远征，返回营地"><Compass /></Link><nav>{desktopNav.map(([to, Icon, label]) => <Link className={path.startsWith(to) ? "active" : ""} to={to} key={to}><Icon /><span>{label}</span></Link>)}</nav></aside>;
}

export function MobileBottomNav() {
  const path = useLocation().pathname;
  return <nav className="mobile-bottom-nav" aria-label="主导航">{desktopNav.filter(([to]) => to !== "/store").map(([to, Icon, label]) => <Link className={path.startsWith(to) ? "active" : ""} to={to} key={to}><Icon /><span>{label}</span></Link>)}</nav>;
}

export function AppShell({ children, title, subtitle, theme = "paper", action }: { children: ReactNode; title: string; subtitle?: string; theme?: "paper" | "camp"; action?: ReactNode }) {
  return <div className={`app-shell theme-${theme}`}><DesktopSidebar /><main className="shell-content"><header className="shell-top"><div><p>{subtitle ?? "知识远征"}</p><h1>{title}</h1></div><TopStatusBar dark={theme === "camp"} />{action}</header>{children}</main><MobileBottomNav /></div>;
}

export function QuestCard({ icon, title, current, total, tone = "gold" }: { icon: ReactNode; title: string; current: number; total: number; tone?: "gold" | "green" | "violet" | "blue" }) {
  const value = Math.round((current / total) * 100);
  return <article className="quest-card"><span className={`quest-icon tone-${tone}`}>{icon}</span><div><div className="quest-label"><b>{title}</b><small>{current}/{total}</small></div><ProgressBar value={value} tone={tone} /></div></article>;
}

export function AchievementBadge({ icon, title, caption }: { icon: ReactNode; title: string; caption: string }) {
  return <div className="achievement-badge"><span>{icon}</span><b>{title}</b><small>{caption}</small></div>;
}

export function WorldIslandCard({ world }: { world: ExpeditionWorld }) {
  return <Link className={`world-island island-${world.visual} ${world.locked ? "is-locked" : ""}`} to={world.locked ? "/store" : `/world/${world.id}`} aria-label={`${world.name}，${world.locked ? "尚未解锁" : "进入世界"}`}><div className="island-art"><span className="island-cloud cloud-one" /><span className="island-cloud cloud-two" /><span className="island-landmark">{world.visual === "history" ? "城" : world.visual === "culture" ? "书" : world.visual === "poetry" ? "月" : world.visual === "civilization" ? "柱" : world.visual === "nature" ? "星" : "算"}</span></div><div className="island-copy"><h2>{world.name}</h2><p>{world.landmark}</p><span><Trophy /> {world.stars}</span></div>{world.locked && <div className="lock-overlay"><LockKeyhole /><span>待解锁</span></div>}<div className="island-enter">{world.locked ? "查看世界" : "进入世界"}<ChevronRight /></div></Link>;
}

const levelIcons = { lesson: BookOpen, branch: Network, boss: Swords };
export function LevelNode({ level, active }: { level: Level; active?: boolean }) { const Icon = levelIcons[level.kind]; const content=<><span className="node-icon">{level.status === "locked" ? <LockKeyhole /> : <Icon />}</span><b>{level.name}</b><small>{level.summary}</small>{Boolean(level.stars)&&<span className="level-stars">{"★".repeat(level.stars??0)}</span>}</>; return level.status==="locked"?<div aria-disabled="true" className="level-node locked">{content}</div>:<Link to={`/battle/${level.id}`} className={`level-node ${level.status} ${active ? "current" : ""}`}>{content}</Link>; }

export function ChapterPath({ levels }: { levels: Level[] }) { return <div className="chapter-path">{levels.map((level, index) => <div className="chapter-step" key={level.id}><LevelNode level={level} active={level.status === "active"} />{index < levels.length - 1 && <i className={level.status === "complete" ? "lit" : ""} />}</div>)}</div>; }

export function OptionButton({ option, index, selected, disabled, result, onClick }: { option: string; index: number; selected: boolean; disabled: boolean; result?: "correct" | "wrong" | undefined; onClick: () => void }) {
  return <button type="button" disabled={disabled} onClick={onClick} className={`option-button ${selected ? "selected" : ""} ${result ?? ""}`}><span>{String.fromCharCode(65 + index)}</span><b>{option}</b>{result === "correct" && <Check />} {result === "wrong" && <X />}</button>;
}

export function QuestionCard({ question, children }: { question: PublicQuestion | null; children: ReactNode }) { return <section className="question-card"><p className="paper-kicker"><ScrollText /> 场景应用</p><h2>{question?.stem ?? "正在展开题卷…"}</h2><div className="option-list">{children}</div></section>; }

export function AnswerExplanation({ correct, explanation, delta, nextReview }: { correct: boolean; explanation: string; delta: number; nextReview: string }) {
  return <aside className={`answer-explanation ${correct ? "is-correct" : "is-wrong"}`} aria-live="polite"><div className="explanation-title">{correct ? <Check /> : <CircleHelp />}<div><strong>{correct ? "回答正确" : "这里容易望文生义"}</strong><span>掌握度 {delta > 0 ? "+" : ""}{delta}</span></div></div><section><h3>为什么这样判断</h3><p>{explanation}</p></section><section><h3>记忆提示</h3><p>{correct ? "把判断依据和典故人物一起记住，下一次更稳。" : "先回到关键词，再排除与题干场景不符的选项。"}</p></section><footer><Brain /> 下次复习：{new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric" }).format(new Date(nextReview))}</footer></aside>;
}

export function ReviewScheduleCard({ label, count, active }: { label: string; count: string; active?: boolean }) { return <article className={`schedule-card ${active ? "active" : ""}`}><span>{label}</span><strong>{count}</strong><small>个知识点</small></article>; }

export function KnowledgeNode({ icon, label, items, discovered, onPick }: { icon: ReactNode; label: string; items: Array<{id:string;name:string}>; discovered?: boolean; onPick?:(id:string)=>void }) {
  const primary = items[0];
  return <section className={`knowledge-node ${discovered ? "discovered" : ""}`}>
    <button type="button" className="knowledge-node-button" disabled={!primary} onClick={() => primary && onPick?.(primary.id)}>
      <span>{icon}</span><b>{label}</b><small>{primary?.name ?? "等待发现"}</small>
    </button>
    <div aria-label={`${label}关联知识`}>{items.slice(1).map(item => <button type="button" key={item.id} onClick={() => onPick?.(item.id)}>{item.name}</button>)}</div>
  </section>;
}

export function KnowledgeDetailPanel() { return <aside className="knowledge-detail"><p className="paper-kicker">历史事件</p><h2>赤壁之战</h2><dl><div><dt>时间</dt><dd>公元 208 年</dd></div><div><dt>参战方</dt><dd>曹操 vs 孙刘联军</dd></div><div><dt>结果</dt><dd>孙刘联军胜利</dd></div></dl><p>东汉末年的关键战役，奠定三国鼎立局面。将人物、地点和典故一起记忆，更容易建立稳定知识网络。</p><h3>相关知识</h3><ul><li>官渡之战</li><li>三国鼎立</li><li>周瑜</li><li>赤壁赋</li></ul><Link className="button primary" to="/battle/idiom-2">去学习这个知识点</Link></aside>; }

export function EmptyState({ title, body, description }: { title: string; body?: string; description?: string }) { return <div className="empty-state"><Compass /><h2>{title}</h2><p>{body ?? description}</p></div>; }
export function LoadingSkeleton() { return <div className="loading-skeleton"><i /><i /><i /></div>; }
export function ErrorState({ body, title, description }: { body?: string; title?: string; description?: string }) { return <div className="error-state"><ShieldCheck /><p>{body ?? [title, description].filter(Boolean).join("：")}</p></div>; }
export { Flag, Medal, Trophy, Sparkles, Brain, BookOpen, Check, Compass };
