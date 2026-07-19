import { useEffect, useRef, useState, type ClipboardEvent } from "react";
import { Check, Mail, ShieldCheck, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth, usingMockAuth } from "../auth";
import { usePlayer } from "../store";
import { TurnstileWidget } from "./turnstile";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function maskEmail(email: string) { const [name, host] = email.split("@"); return `${name?.slice(0, 1) ?? ""}***@${host ?? ""}`; }

function OtpInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const refs = useRef<Array<HTMLInputElement | null>>([]); const values = Array.from({ length: 6 }, (_, index) => value[index] ?? "");
  function setDigit(index: number, raw: string) { const digit = raw.replace(/\D/g, "").slice(-1); const next = [...values]; next[index] = digit; onChange(next.join("")); if (digit && index < 5) refs.current[index + 1]?.focus(); }
  function paste(event: ClipboardEvent<HTMLInputElement>) { const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6); if (!pasted) return; event.preventDefault(); onChange(pasted); refs.current[Math.min(5, pasted.length)]?.focus(); }
  return <div className="otp-inputs" aria-label="六位验证码">{values.map((digit, index) => <input key={index} ref={element => { refs.current[index] = element; }} value={digit} inputMode="numeric" maxLength={1} aria-label={`验证码第 ${index + 1} 位`} onPaste={paste} onChange={event => setDigit(index, event.target.value)} onKeyDown={event => { if (event.key === "Backspace" && !digit && index) refs.current[index - 1]?.focus(); }} />)}</div>;
}

export function AuthDialog() {
  const { dialog, closeDialog, requestBindEmail, verifyBindEmail, requestLoginEmail, verifyLoginEmail, openDialog, pendingEmail } = useAuth();
  const navigate = useNavigate();
  const onboarded = usePlayer((state) => state.onboarded);
  const [email, setEmail] = useState(""); const [code, setCode] = useState(""); const [captchaToken, setCaptchaToken] = useState<string>(); const [step, setStep] = useState<"email" | "otp">("email"); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [seconds, setSeconds] = useState(0);
  useEffect(() => { setEmail(pendingEmail ?? ""); setCode(""); setStep("email"); setError(""); setSeconds(0); }, [dialog, pendingEmail]);
  useEffect(() => { if (!seconds) return; const timer = window.setTimeout(() => setSeconds(value => value - 1), 1000); return () => window.clearTimeout(timer); }, [seconds]);
  if (!dialog) return null;
  const binding = dialog === "bind";
  async function send() { if (!emailPattern.test(email)) { setError("请输入有效的邮箱地址"); return; } setBusy(true); setError(""); try { if (binding) await requestBindEmail(email, captchaToken); else await requestLoginEmail(email, captchaToken); setStep("otp"); setSeconds(60); } catch (reason) { setError(reason instanceof Error ? reason.message : "当前记录已保留，请稍后再试"); } finally { setBusy(false); } }
  async function verify() { if (code.length !== 6) { setError("请输入 6 位验证码"); return; } setBusy(true); setError(""); try { if (binding) await verifyBindEmail(email, code); else await verifyLoginEmail(email, code); closeDialog(); if (!binding) navigate(onboarded ? "/camp" : "/onboarding"); } catch (reason) { setError(reason instanceof Error ? reason.message : "验证码不正确，请检查后重新输入"); } finally { setBusy(false); } }
  return <div className="auth-backdrop" role="presentation"><section className="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title"><button type="button" className="dialog-close" onClick={closeDialog} aria-label="关闭"><X /></button>{step === "email" ? <><span className="auth-icon"><Mail /></span><p className="eyebrow">{binding ? "保存远征进度" : "登录或注册"}</p><h2 id="auth-title">{binding ? "把这段远征带到下一台设备" : "用邮箱开启远征"}</h2><p>{binding ? "绑定邮箱后可同步进度、错题、知识图谱、连续学习记录与已获得徽章。" : "新邮箱会自动创建账号，已有邮箱会继续原来的远征。我们将发送 6 位验证码。"}</p><label className="email-field">邮箱地址<input value={email} type="email" autoComplete="email" placeholder="name@example.com" onChange={event => setEmail(event.target.value.trim())} /></label><TurnstileWidget onToken={setCaptchaToken} />{error && <p className="auth-error" role="alert">{error}</p>}<button type="button" className="button primary" disabled={busy} onClick={send}>{busy ? "正在发送…" : "发送验证码"}</button>{binding && error.includes("已有账号") ? <button type="button" className="dialog-skip" onClick={() => openDialog("login")}>使用原账号登录并合并进度</button> : binding ? <button type="button" className="dialog-skip" onClick={closeDialog}>暂时不用</button> : <button type="button" className="dialog-skip" onClick={closeDialog}>返回营地</button>}</> : <><span className="auth-icon"><ShieldCheck /></span><p className="eyebrow">邮箱验证</p><h2 id="auth-title">验证码已发送至 {maskEmail(email)}</h2><p>请输入邮件中的 6 位验证码。{usingMockAuth() && " 开发模拟模式可输入 123456。"}</p><OtpInput value={code} onChange={setCode} />{error && <p className="auth-error" role="alert">{error}</p>}<button type="button" className="button primary" disabled={busy || code.length !== 6} onClick={verify}>{busy ? "正在确认…" : binding ? "确认并保存进度" : "确认并开始远征"}</button><button type="button" className="dialog-skip" disabled={seconds > 0 || busy} onClick={send}>{seconds > 0 ? `${seconds} 秒后可重新发送` : "重新发送验证码"}</button><p className="auth-note"><Check /> 当前仅使用邮箱验证码；不接短信，不会自动开通付费服务。</p></>}</section></div>;
}
