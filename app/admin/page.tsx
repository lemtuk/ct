"use client";

import { useEffect, useState, useCallback } from "react";
import {
  adminLogin, adminVerify, adminLogout,
  getStats, getUsers, getWallets, approveWallet, rejectWallet,
  getPendingWithdrawals, approveWithdrawal, rejectWithdrawal,
  getAdminSettings, updateSettings,
} from "@/lib/adminApi";

type Stats = { totalUsers: number; activeUsers: number; totalStaked: number; totalEarned: number; pendingWithdrawals: number; pendingWallets: number };
type User = { id: number; walletAddress: string; stakedAmount: number; totalEarned: number; claimableRewards: number; vipLevel: number; status: string; joinDate: string; walletBalance?: { eth: string; usdt: string } };
type PendingWallet = { id: number; walletAddress: string; network: string; timestamp: string; ipAddress: string };
type Withdrawal = { id: number; walletAddress: string; amount: number; netAmount: number; fee: number; status: string; withdrawalType: string; requestedAt: string };

const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const shortAddr = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`;
const timeAgo = (d: string) => {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [logging, setLogging] = useState(false);
  const [tab, setTab] = useState<"overview" | "wallets" | "users" | "withdrawals" | "settings">("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [wallets, setWallets] = useState<{ pending: PendingWallet[]; approved: string[]; rejected: string[] }>({ pending: [], approved: [], rejected: [] });
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [editSettings, setEditSettings] = useState<Record<string, string>>({});
  const [savingSettings, setSavingSettings] = useState(false);
  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchUsers, setSearchUsers] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showToast = (text: string, ok: boolean) => {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    adminVerify()
      .then((r) => { if (r.valid) setAuthed(true); })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  const load = useCallback(async () => {
    if (!authed) return;
    setLoading(true);
    try {
      const [s, u, w, wd] = await Promise.all([
        getStats().catch(() => null),
        getUsers().catch(() => []),
        getWallets().catch(() => ({ pending: [], approved: [], rejected: [] })),
        getPendingWithdrawals().catch(() => []),
      ]);
      if (s) setStats(s);
      setUsers(u);
      setWallets(w);
      setWithdrawals(wd);
    } catch { /* handled per-call */ }
    setLoading(false);
  }, [authed]);

  useEffect(() => { load(); }, [load]);

  const loadSettings = useCallback(async () => {
    if (!authed) return;
    try {
      const s = await getAdminSettings();
      setSettings(s);
      setEditSettings(s);
    } catch { /* ignore */ }
  }, [authed]);

  useEffect(() => { if (tab === "settings") loadSettings(); }, [tab, loadSettings]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginErr("");
    setLogging(true);
    try {
      await adminLogin(username, password);
      setAuthed(true);
    } catch (err) {
      setLoginErr(err instanceof Error ? err.message : "Invalid credentials");
    }
    setLogging(false);
  }

  async function handleApproveWallet(addr: string) {
    try { await approveWallet(addr); showToast(`Wallet ${shortAddr(addr)} approved`, true); load(); }
    catch (e) { showToast(e instanceof Error ? e.message : "Failed", false); }
  }
  async function handleRejectWallet(addr: string) {
    try { await rejectWallet(addr); showToast(`Wallet ${shortAddr(addr)} rejected`, true); load(); }
    catch (e) { showToast(e instanceof Error ? e.message : "Failed", false); }
  }
  async function handleApproveWithdrawal(w: Withdrawal) {
    try { await approveWithdrawal(w.id, w.walletAddress); showToast(`Withdrawal #${w.id} approved`, true); load(); }
    catch (e) { showToast(e instanceof Error ? e.message : "Failed", false); }
  }
  async function handleRejectWithdrawal(w: Withdrawal) {
    try { await rejectWithdrawal(w.id, w.walletAddress); showToast(`Withdrawal #${w.id} rejected`, true); load(); }
    catch (e) { showToast(e instanceof Error ? e.message : "Failed", false); }
  }
  async function handleSaveSettings() {
    setSavingSettings(true);
    try { await updateSettings(editSettings); setSettings(editSettings); showToast("Settings saved", true); }
    catch (e) { showToast(e instanceof Error ? e.message : "Failed to save", false); }
    setSavingSettings(false);
  }

  const filteredUsers = users.filter((u) =>
    u.walletAddress.toLowerCase().includes(searchUsers.toLowerCase()) ||
    u.status.toLowerCase().includes(searchUsers.toLowerCase())
  );

  // ── Loading / Login screens ──
  if (checking) {
    return (
      <div style={S.loginWrap}>
        <div style={S.spinner} />
        <p style={{ color: "#8FA69D", marginTop: "1rem" }}>Verifying session...</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div style={S.loginWrap}>
        <div style={S.loginCard}>
          <div style={S.loginLogo}>
            <div style={S.logoIcon}>B</div>
            <span style={{ fontSize: "1.25rem", fontWeight: 700 }}>BestBuy Admin</span>
          </div>
          <p style={{ color: "#8FA69D", fontSize: "0.9rem", margin: "0 0 1.5rem" }}>Sign in to access the admin panel</p>
          {loginErr && <div style={S.errorBox}>{loginErr}</div>}
          <form onSubmit={handleLogin}>
            <label style={S.label}>Username</label>
            <input style={S.input} placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
            <label style={{ ...S.label, marginTop: "1rem" }}>Password</label>
            <input style={S.input} type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            <button style={{ ...S.btnPrimary, width: "100%", marginTop: "1.5rem", opacity: logging ? 0.6 : 1 }} type="submit" disabled={logging}>
              {logging ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Main Admin Layout ──
  const navItems = [
    { key: "overview", label: "Overview", icon: "📊" },
    { key: "wallets", label: "Wallets", icon: "👛", badge: wallets.pending.length },
    { key: "users", label: "Users", icon: "👥", badge: users.length },
    { key: "withdrawals", label: "Withdrawals", icon: "💸", badge: withdrawals.length },
    { key: "settings", label: "Settings", icon: "⚙️" },
  ] as const;

  return (
    <div style={S.layout}>
      {/* Sidebar */}
      <aside style={{ ...S.sidebar, ...(sidebarOpen ? { transform: "translateX(0)" } : {}) }}>
        <div style={S.sidebarHeader}>
          <div style={S.logoIcon}>B</div>
          <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>BestBuy</span>
          <button style={S.closeSidebar} onClick={() => setSidebarOpen(false)}>✕</button>
        </div>
        <nav style={S.nav}>
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => { setTab(item.key); setSidebarOpen(false); }}
              style={{
                ...S.navItem,
                ...(tab === item.key ? S.navItemActive : {}),
              }}
            >
              <span style={{ fontSize: "1.1rem", width: 28, textAlign: "center" as const }}>{item.icon}</span>
              <span>{item.label}</span>
              {"badge" in item && item.badge > 0 && (
                <span style={S.badge}>{item.badge}</span>
              )}
            </button>
          ))}
        </nav>
        <div style={S.sidebarFooter}>
          <button style={S.logoutBtn} onClick={() => { adminLogout(); setAuthed(false); }}>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div style={S.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <main style={S.main}>
        {/* Top bar */}
        <header style={S.topBar}>
          <button style={S.menuBtn} onClick={() => setSidebarOpen(true)}>☰</button>
          <h1 style={S.pageTitle}>{navItems.find((n) => n.key === tab)?.label}</h1>
          <div style={S.topRight}>
            <button style={S.refreshBtn} onClick={load} disabled={loading}>
              {loading ? "↻" : "↻"} Refresh
            </button>
            <div style={S.statusDot} title="Backend connected" />
          </div>
        </header>

        {/* Toast */}
        {toast && (
          <div style={{ ...S.toast, background: toast.ok ? "rgba(46, 230, 168, 0.15)" : "rgba(255, 107, 107, 0.15)", borderColor: toast.ok ? "#2EE6A8" : "#ff6b6b", color: toast.ok ? "#2EE6A8" : "#ff6b6b" }}>
            {toast.ok ? "✓" : "✗"} {toast.text}
          </div>
        )}

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div style={S.content}>
            <div style={S.statsGrid}>
              {[
                { label: "Total Users", value: stats?.totalUsers ?? 0, icon: "👥", color: "#2EE6A8" },
                { label: "Active Users", value: stats?.activeUsers ?? 0, icon: "✓", color: "#14B8A6" },
                { label: "Total Staked", value: `$${fmt(stats?.totalStaked ?? 0)}`, icon: "📈", color: "#2EE6A8" },
                { label: "Total Earned", value: `$${fmt(stats?.totalEarned ?? 0)}`, icon: "💰", color: "#f6851b" },
                { label: "Pending Wallets", value: stats?.pendingWallets ?? 0, icon: "⏳", color: stats?.pendingWallets ? "#f6851b" : "#8FA69D" },
                { label: "Pending Withdrawals", value: stats?.pendingWithdrawals ?? 0, icon: "📤", color: stats?.pendingWithdrawals ? "#ff6b6b" : "#8FA69D" },
              ].map((s, i) => (
                <div key={i} style={S.statCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#8FA69D", fontSize: "0.85rem" }}>{s.label}</span>
                    <span style={{ fontSize: "1.5rem" }}>{s.icon}</span>
                  </div>
                  <div style={{ fontSize: "1.75rem", fontWeight: 700, color: s.color, marginTop: "0.5rem" }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div style={S.section}>
              <h3 style={S.sectionTitle}>Quick Actions</h3>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" as const }}>
                <button style={S.actionBtn} onClick={() => setTab("wallets")}>
                  Review Wallets {wallets.pending.length > 0 && <span style={S.actionBadge}>{wallets.pending.length}</span>}
                </button>
                <button style={S.actionBtn} onClick={() => setTab("withdrawals")}>
                  Review Withdrawals {withdrawals.length > 0 && <span style={S.actionBadge}>{withdrawals.length}</span>}
                </button>
                <button style={S.actionBtn} onClick={() => setTab("users")}>
                  Manage Users
                </button>
              </div>
            </div>

            {/* Recent wallets preview */}
            {wallets.pending.length > 0 && (
              <div style={S.section}>
                <h3 style={S.sectionTitle}>Recent Wallet Requests</h3>
                <div style={S.tableWrap}>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <th style={S.th}>Address</th>
                        <th style={S.th}>Network</th>
                        <th style={S.th}>Time</th>
                        <th style={S.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wallets.pending.slice(0, 5).map((w) => (
                        <tr key={w.id} style={S.tr}>
                          <td style={S.tdMono}>{shortAddr(w.walletAddress)}</td>
                          <td style={S.td}><span style={S.networkBadge}>{w.network}</span></td>
                          <td style={S.td}>{timeAgo(w.timestamp)}</td>
                          <td style={S.td}>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <button style={S.btnSmGreen} onClick={() => handleApproveWallet(w.walletAddress)}>Approve</button>
                              <button style={S.btnSmRed} onClick={() => handleRejectWallet(w.walletAddress)}>Reject</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── WALLETS ── */}
        {tab === "wallets" && (
          <div style={S.content}>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" as const }}>
              <div style={S.miniStat}><span style={{ color: "#8FA69D" }}>Pending</span><strong style={{ color: "#f6851b" }}>{wallets.pending.length}</strong></div>
              <div style={S.miniStat}><span style={{ color: "#8FA69D" }}>Approved</span><strong style={{ color: "#2EE6A8" }}>{wallets.approved.length}</strong></div>
              <div style={S.miniStat}><span style={{ color: "#8FA69D" }}>Rejected</span><strong style={{ color: "#ff6b6b" }}>{wallets.rejected.length}</strong></div>
            </div>

            {wallets.pending.length === 0 ? (
              <div style={S.emptyState}>
                <span style={{ fontSize: "3rem" }}>✓</span>
                <p>No pending wallet requests</p>
              </div>
            ) : (
              <div style={S.tableWrap}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>#</th>
                      <th style={S.th}>Wallet Address</th>
                      <th style={S.th}>Network</th>
                      <th style={S.th}>IP Address</th>
                      <th style={S.th}>Requested</th>
                      <th style={S.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wallets.pending.map((w, i) => (
                      <tr key={w.id} style={S.tr}>
                        <td style={S.td}>{i + 1}</td>
                        <td style={S.tdMono}>{w.walletAddress}</td>
                        <td style={S.td}><span style={S.networkBadge}>{w.network}</span></td>
                        <td style={S.td}>{w.ipAddress}</td>
                        <td style={S.td}>{timeAgo(w.timestamp)}</td>
                        <td style={S.td}>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button style={S.btnSmGreen} onClick={() => handleApproveWallet(w.walletAddress)}>Approve</button>
                            <button style={S.btnSmRed} onClick={() => handleRejectWallet(w.walletAddress)}>Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── USERS ── */}
        {tab === "users" && (
          <div style={S.content}>
            <div style={{ marginBottom: "1rem" }}>
              <input
                style={{ ...S.input, maxWidth: 400 }}
                placeholder="Search by wallet address or status..."
                value={searchUsers}
                onChange={(e) => setSearchUsers(e.target.value)}
              />
            </div>
            {filteredUsers.length === 0 ? (
              <div style={S.emptyState}>
                <span style={{ fontSize: "3rem" }}>👥</span>
                <p>{searchUsers ? "No matching users" : "No users registered yet"}</p>
              </div>
            ) : (
              <div style={S.tableWrap}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>ID</th>
                      <th style={S.th}>Wallet</th>
                      <th style={S.th}>Wallet Balance</th>
                      <th style={S.th}>Staked</th>
                      <th style={S.th}>Earned</th>
                      <th style={S.th}>Claimable</th>
                      <th style={S.th}>VIP</th>
                      <th style={S.th}>Status</th>
                      <th style={S.th}>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} style={S.tr}>
                        <td style={S.td}>{u.id}</td>
                        <td style={S.tdMono}>{shortAddr(u.walletAddress)}</td>
                        <td style={S.td}>
                          <div style={{ fontSize: "0.8rem", lineHeight: 1.6 }}>
                            <div>{u.walletBalance?.usdt || "0"} <span style={{ color: "#8FA69D" }}>USDT</span></div>
                            <div>{u.walletBalance?.eth || "0"} <span style={{ color: "#8FA69D" }}>ETH</span></div>
                          </div>
                        </td>
                        <td style={S.td}>${fmt(u.stakedAmount)}</td>
                        <td style={{ ...S.td, color: "#2EE6A8" }}>${fmt(u.totalEarned)}</td>
                        <td style={{ ...S.td, color: "#14B8A6" }}>${fmt(u.claimableRewards)}</td>
                        <td style={S.td}>
                          <span style={{ ...S.vipBadge, background: u.vipLevel > 0 ? "rgba(246, 133, 27, 0.15)" : "rgba(255,255,255,0.05)", color: u.vipLevel > 0 ? "#f6851b" : "#8FA69D" }}>
                            VIP {u.vipLevel}
                          </span>
                        </td>
                        <td style={S.td}>
                          <span style={{ ...S.statusBadge, ...(u.status === "active" ? { background: "rgba(46,230,168,0.12)", color: "#2EE6A8" } : u.status === "pending" ? { background: "rgba(246,133,27,0.12)", color: "#f6851b" } : { background: "rgba(255,107,107,0.12)", color: "#ff6b6b" }) }}>
                            {u.status}
                          </span>
                        </td>
                        <td style={S.td}>{u.joinDate ? timeAgo(u.joinDate) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── WITHDRAWALS ── */}
        {tab === "withdrawals" && (
          <div style={S.content}>
            {withdrawals.length === 0 ? (
              <div style={S.emptyState}>
                <span style={{ fontSize: "3rem" }}>✓</span>
                <p>No pending withdrawals</p>
              </div>
            ) : (
              <div style={S.tableWrap}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>ID</th>
                      <th style={S.th}>Wallet</th>
                      <th style={S.th}>Amount</th>
                      <th style={S.th}>Fee</th>
                      <th style={S.th}>Net Amount</th>
                      <th style={S.th}>Type</th>
                      <th style={S.th}>Requested</th>
                      <th style={S.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map((w) => (
                      <tr key={w.id} style={S.tr}>
                        <td style={S.td}>#{w.id}</td>
                        <td style={S.tdMono}>{shortAddr(w.walletAddress)}</td>
                        <td style={S.td}>${fmt(w.amount)}</td>
                        <td style={{ ...S.td, color: "#ff6b6b" }}>${fmt(w.fee)}</td>
                        <td style={{ ...S.td, color: "#2EE6A8", fontWeight: 600 }}>${fmt(w.netAmount)}</td>
                        <td style={S.td}><span style={S.networkBadge}>{w.withdrawalType}</span></td>
                        <td style={S.td}>{timeAgo(w.requestedAt)}</td>
                        <td style={S.td}>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button style={S.btnSmGreen} onClick={() => handleApproveWithdrawal(w)}>Approve</button>
                            <button style={S.btnSmRed} onClick={() => handleRejectWithdrawal(w)}>Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── SETTINGS ── */}
        {tab === "settings" && (
          <div style={S.content}>
            <div style={S.settingsGrid}>
              {Object.entries(editSettings).map(([key, val]) => (
                <div key={key} style={S.settingItem}>
                  <label style={S.label}>{key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}</label>
                  <input
                    style={S.input}
                    value={val}
                    onChange={(e) => setEditSettings((p) => ({ ...p, [key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            {Object.keys(editSettings).length > 0 && (
              <button style={{ ...S.btnPrimary, marginTop: "1.5rem", opacity: savingSettings ? 0.6 : 1 }} onClick={handleSaveSettings} disabled={savingSettings}>
                {savingSettings ? "Saving..." : "Save Settings"}
              </button>
            )}
            {Object.keys(editSettings).length === 0 && (
              <div style={S.emptyState}>
                <span style={{ fontSize: "3rem" }}>⚙️</span>
                <p>No settings configured yet</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// ── Styles ──
const S: Record<string, React.CSSProperties> = {
  // Layout
  layout: { display: "flex", minHeight: "100vh", background: "#0A0F0D" },
  sidebar: { width: 260, background: "#0D1310", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", position: "fixed" as const, top: 0, left: 0, bottom: 0, zIndex: 50, transition: "transform 0.2s" },
  sidebarHeader: { display: "flex", alignItems: "center", gap: "0.75rem", padding: "1.25rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  closeSidebar: { display: "none", marginLeft: "auto", background: "none", border: "none", color: "#8FA69D", fontSize: "1.2rem", cursor: "pointer" },
  nav: { flex: 1, padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" },
  navItem: { display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.7rem 0.85rem", borderRadius: 8, background: "none", border: "none", color: "#8FA69D", fontSize: "0.9rem", cursor: "pointer", transition: "all 0.15s", textAlign: "left" as const, width: "100%" },
  navItemActive: { background: "rgba(46, 230, 168, 0.08)", color: "#2EE6A8" },
  badge: { marginLeft: "auto", background: "rgba(246, 133, 27, 0.2)", color: "#f6851b", fontSize: "0.75rem", padding: "0.15rem 0.5rem", borderRadius: 10, fontWeight: 600 },
  sidebarFooter: { padding: "1rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.06)" },
  logoutBtn: { width: "100%", padding: "0.6rem", background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: 8, color: "#ff6b6b", cursor: "pointer", fontSize: "0.85rem" },
  overlay: { position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 40, display: "none" },

  // Main
  main: { flex: 1, marginLeft: 260, minHeight: "100vh" },
  topBar: { display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0D1310" },
  menuBtn: { display: "none", background: "none", border: "none", color: "#E9F2ED", fontSize: "1.5rem", cursor: "pointer" },
  pageTitle: { fontSize: "1.25rem", fontWeight: 600, color: "#E9F2ED", margin: 0 },
  topRight: { marginLeft: "auto", display: "flex", alignItems: "center", gap: "1rem" },
  refreshBtn: { padding: "0.5rem 1rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, color: "#8FA69D", cursor: "pointer", fontSize: "0.85rem" },
  statusDot: { width: 10, height: 10, borderRadius: "50%", background: "#2EE6A8", boxShadow: "0 0 8px rgba(46,230,168,0.4)" },
  content: { padding: "2rem" },

  // Stats
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" },
  statCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "1.25rem" },
  section: { marginBottom: "2rem" },
  sectionTitle: { fontSize: "1rem", fontWeight: 600, color: "#E9F2ED", marginBottom: "1rem" },

  // Tables
  tableWrap: { overflowX: "auto" as const, borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" },
  table: { width: "100%", borderCollapse: "collapse" as const, fontSize: "0.875rem" },
  th: { textAlign: "left" as const, padding: "0.85rem 1rem", color: "#8FA69D", fontWeight: 500, fontSize: "0.8rem", textTransform: "uppercase" as const, letterSpacing: "0.5px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  tr: { borderBottom: "1px solid rgba(255,255,255,0.04)" },
  td: { padding: "0.85rem 1rem", color: "#E9F2ED" },
  tdMono: { padding: "0.85rem 1rem", color: "#E9F2ED", fontFamily: "ui-monospace, Menlo, monospace", fontSize: "0.8rem" },

  // Badges
  networkBadge: { background: "rgba(46, 230, 168, 0.1)", color: "#2EE6A8", padding: "0.2rem 0.6rem", borderRadius: 6, fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase" as const },
  vipBadge: { padding: "0.2rem 0.6rem", borderRadius: 6, fontSize: "0.75rem", fontWeight: 600 },
  statusBadge: { padding: "0.2rem 0.6rem", borderRadius: 6, fontSize: "0.75rem", fontWeight: 500, textTransform: "capitalize" as const },
  miniStat: { display: "flex", flexDirection: "column" as const, gap: "0.25rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "0.75rem 1.25rem", fontSize: "0.85rem" },

  // Buttons
  btnPrimary: { padding: "0.7rem 1.5rem", background: "#2EE6A8", border: "none", borderRadius: 8, color: "#0A0F0D", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" },
  btnSmGreen: { padding: "0.35rem 0.75rem", background: "rgba(46,230,168,0.12)", border: "1px solid rgba(46,230,168,0.3)", borderRadius: 6, color: "#2EE6A8", cursor: "pointer", fontSize: "0.8rem", fontWeight: 500 },
  btnSmRed: { padding: "0.35rem 0.75rem", background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: 6, color: "#ff6b6b", cursor: "pointer", fontSize: "0.8rem", fontWeight: 500 },
  actionBtn: { padding: "0.65rem 1.25rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#E9F2ED", cursor: "pointer", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" },
  actionBadge: { background: "rgba(246,133,27,0.2)", color: "#f6851b", fontSize: "0.7rem", padding: "0.1rem 0.45rem", borderRadius: 8, fontWeight: 600 },

  // Inputs
  input: { width: "100%", padding: "0.7rem 0.85rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#E9F2ED", fontSize: "0.9rem", outline: "none" },
  label: { display: "block", color: "#8FA69D", fontSize: "0.8rem", marginBottom: "0.4rem", fontWeight: 500 },

  // Empty / Loading
  emptyState: { display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", padding: "4rem 2rem", color: "#8FA69D", gap: "0.75rem" },
  spinner: { width: 32, height: 32, border: "3px solid rgba(255,255,255,0.1)", borderTop: "3px solid #2EE6A8", borderRadius: "50%", animation: "spin 0.8s linear infinite" },

  // Login
  loginWrap: { display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0A0F0D", padding: "2rem" },
  loginCard: { width: "100%", maxWidth: 400, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "2.5rem" },
  loginLogo: { display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem", color: "#E9F2ED" },
  logoIcon: { width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #2EE6A8, #14B8A6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#0A0F0D", fontSize: "1.2rem" },
  errorBox: { background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: 8, padding: "0.7rem 1rem", color: "#ff6b6b", fontSize: "0.85rem", marginBottom: "1rem" },

  // Toast
  toast: { margin: "1rem 2rem 0", padding: "0.75rem 1rem", borderRadius: 8, border: "1px solid", fontSize: "0.85rem", fontWeight: 500 },

  // Settings
  settingsGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.25rem" },
  settingItem: {},
};

// Add responsive CSS via a style tag
const responsiveCSS = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @media (max-width: 768px) {
    [style*="marginLeft: 260"] { margin-left: 0 !important; }
    [style*="width: 260"] { transform: translateX(-100%); }
    [style*="display: none"][style*="1.5rem"] { display: block !important; }
    [style*="display: none"][style*="closeSidebar"] { display: block !important; }
    [style*="repeat(3"] { grid-template-columns: repeat(2, 1fr) !important; }
    [style*="repeat(2, 1fr)"] { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 480px) {
    [style*="repeat(2"] { grid-template-columns: 1fr !important; }
  }
`;

// Inject responsive styles
if (typeof document !== "undefined") {
  const id = "admin-responsive";
  if (!document.getElementById(id)) {
    const s = document.createElement("style");
    s.id = id;
    s.textContent = responsiveCSS;
    document.head.appendChild(s);
  }
}
