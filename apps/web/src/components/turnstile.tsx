import { useEffect, useRef } from "react";

declare global { interface Window { turnstile?: { render: (element: HTMLElement, options: { sitekey: string; callback: (token: string) => void; "error-callback": () => void; "expired-callback": () => void }) => string; remove: (id: string) => void; }; } }
const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim();

export function TurnstileWidget({ onToken }: { onToken: (token: string | undefined) => void }) {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!siteKey || !container.current) return;
    let widgetId: string | undefined; const render = () => { if (!container.current || !window.turnstile) return; widgetId = window.turnstile.render(container.current, { sitekey: siteKey, callback: token => onToken(token), "error-callback": () => onToken(undefined), "expired-callback": () => onToken(undefined) }); };
    const existing = document.querySelector<HTMLScriptElement>('script[data-expedition-turnstile]');
    if (window.turnstile) render(); else if (existing) existing.addEventListener("load", render, { once: true }); else { const script = document.createElement("script"); script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"; script.async = true; script.defer = true; script.dataset.expeditionTurnstile = "true"; script.addEventListener("load", render, { once: true }); document.head.append(script); }
    return () => { if (widgetId && window.turnstile) window.turnstile.remove(widgetId); };
  }, [onToken]);
  return siteKey ? <div className="turnstile-box" ref={container} aria-label="安全验证" /> : null;
}
