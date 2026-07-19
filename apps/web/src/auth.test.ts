import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "./auth";

const storage = new Map<string, string>();
vi.stubGlobal("sessionStorage", { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value), removeItem: (key: string) => storage.delete(key), clear: () => storage.clear() });

describe("mock guest identity linking", () => {
  beforeEach(() => { storage.clear(); useAuth.setState({ mode: "signed_out", initialized: true, isAnonymous: false, user: null, session: null, pendingEmail: null, dialog: null }); });
  it("keeps the same user id after a guest binds an email", async () => {
    await useAuth.getState().startGuest(); const guestId = useAuth.getState().user?.id;
    await useAuth.getState().requestBindEmail("player@example.com"); await useAuth.getState().verifyBindEmail("player@example.com", "123456");
    expect(useAuth.getState().user?.id).toBe(guestId); expect(useAuth.getState().mode).toBe("permanent"); expect(useAuth.getState().user?.email).toBe("player@example.com");
  });
});
