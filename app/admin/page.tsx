"use client";

import { useEffect, useState, useCallback } from "react";
import BestBuyLogo from "@/components/BestBuyLogo";
import FaIcon from "@/components/FaIcon";
import {
  adminLogin, adminVerify, adminLogout,
  getStats, getUsers, getWallets, approveWallet, rejectWallet,
  getPendingWithdrawals, approveWithdrawal, rejectWithdrawal,
} from "@/lib/adminApi";

type Stats = { totalUsers: number; activeUsers: number; totalStaked: number; totalEarned: number; pendingWithdrawals: number; pendingWallets: number };
type User = { id: number; walletAddress: string; stakedAmount: number; totalEarned: number; claimableRewards: number; vipLevel: number; status: string; joinDate: string };
type PendingWallet = { id: number; walletAddress: string; network: string; timestamp: string; ipAddress: string };
type Withdrawal = { id: number; walletAddress: string; amount: number; netAmount: number; fee: number; status: string; withdrawalType: string; requestedAt: string };

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [tab, setTab] = useState<"stats" | "users" | "wallets" | "withdrawals">("stats");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [wallets, setWallets] = useState<{ pending: PendingWallet[]; approved: string[]; rejected: string[] }>({ pending: [], approved: [], rejected: [] });
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [msg, setMsg] = useState({ text: "", ok: false });

  useEffect(() => {
    adminVerify().then(() => setAuthed(true)).catch(() => {}).finally(() => setChecking(false));
  }, []);

  const load = useCallback(async () => {
    if (!authed) return;
    try {
      const [s, u, w, wd] = await Promise.all([getStats(), getUsers(), getWallets(), getPendingWithdrawals()]);
      setStats(s);
      setUsers(u);
      setWallets(w);
      setWithdrawals(wd);
    } catch { /* ignore */ }
  }, [authed]);

  useEffect(() => { load(); }, [load]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginErr("");
    try {
      await adminLogin(username, password);
      setAuthed(true);
    } catch (err) {
      setLoginErr(err instanceof Error ? err.message : "Login failed");
    }
  }

  async function handleApproveWallet(addr: string) {
    try { await approveWallet(addr); setMsg({ text: `Approved ${addr.slice(0, 8)}...`, ok: true }); load(); }
    catch (e) { setMsg({ text: e instanceof Error ? e.message : "Failed", ok: false }); }
  }
  async function handleRejectWallet(addr: string) {
    try { await rejectWallet(addr); setMsg({ text: `Rejected ${addr.slice(0, 8)}...`, ok: true }); load(); }
    catch (e) { setMsg({ text: e instanceof Error ? e.message : "Failed", ok: false }); }
  }
  async function handleApproveWithdrawal(w: Withdrawal) {
    try { await approveWithdrawal(w.id, w.walletAddress); setMsg({ text: `Withdrawal #${w.id} approved`, ok: true }); load(); }
    catch (e) { setMsg({ text: e instanceof Error ? e.message : "Failed", ok: false }); }
  }
  async function handleRejectWithdrawal(w: Withdrawal) {
    try { await rejectWithdrawal(w.id, w.walletAddress); setMsg({ text: `Withdrawal #${w.id} rejected`, ok: true }); load(); }
    catch (e) { setMsg({ text: e instanceof Error ? e.message : "Failed", ok: false }); }
  }

  if (checking) return <div className="dash-wrap"><div className="dash-loading">Checking session...</div></div>;

  if (!authed) {
    return (
      <div className="dash-wrap">
        <div className="admin-login">
          <div className="admin-login-card">
            <BestBuyLogo />
            <h2>Admin Login</h2>
            {loginErr && <div className="dash-msg dash-msg--err">{loginErr}</div>}
            <form onSubmit={handleLogin}>
              <input className="dash-input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
              <input className="dash-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
              <button className="btn-green-sm" type="submit" style={{ width: "100%", padding: "0.75rem", fontSize: "1rem" }}>Login</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-wrap">
      <header className="dash-header">
        <a href="/" className="dash-brand"><BestBuyLogo /><span>Admin Panel</span></a>
        <button className="btn-ghost-sm" onClick={() => { adminLogout(); setAuthed(false); }}>
          <FaIcon icon="right-from-bracket" /> Logout
        </button>
      </header>

      <nav className="dash-tabs">
        {(["stats", "wallets", "users", "withdrawals"] as const).map((t) => (
          <button key={t} className={`dash-tab ${tab === t ? "dash-tab--active" : ""}`}
            onClick={() => { setTab(t); setMsg({ text: "", ok: false }); }}>
            {t === "stats" ? "Dashboard" : t === "wallets" ? `Wallets (${wallets.pending.length})` : t === "users" ? `Users (${users.length})` : `Withdrawals (${withdrawals.length})`}
          </button>
        ))}
      </nav>

      {msg.text && <div className={`dash-msg ${msg.ok ? "dash-msg--ok" : "dash-msg--err"}`}>{msg.text}</div>}

      {/* Stats */}
      {tab === "stats" && stats && (
        <div className="dash-grid">
          <div className="dash-card"><div className="dash-card-label">Total Users</div><div className="dash-card-value">{stats.totalUsers}</div></div>
          <div className="dash-card"><div className="dash-card-label">Active Users</div><div className="dash-card-value">{stats.activeUsers}</div></div>
          <div className="dash-card"><div className="dash-card-label">Total Staked</div><div className="dash-card-value dash-green">${stats.totalStaked.toLocaleString()}</div></div>
          <div className="dash-card"><div className="dash-card-label">Total Earned</div><div className="dash-card-value dash-green">${stats.totalEarned.toLocaleString()}</div></div>
          <div className="dash-card"><div className="dash-card-label">Pending Wallets</div><div className="dash-card-value" style={{ color: stats.pendingWallets > 0 ? "#f6851b" : undefined }}>{stats.pendingWallets}</div></div>
          <div className="dash-card"><div className="dash-card-label">Pending Withdrawals</div><div className="dash-card-value" style={{ color: stats.pendingWithdrawals > 0 ? "#f6851b" : undefined }}>{stats.pendingWithdrawals}</div></div>
        </div>
      )}

      {/* Wallets */}
      {tab === "wallets" && (
        <div className="dash-txns">
          <h3 style={{ marginBottom: "1rem" }}>Pending Approval ({wallets.pending.length})</h3>
          {wallets.pending.length === 0 ? (
            <div className="dash-empty">No pending wallet requests</div>
          ) : (
            <table className="dash-table">
              <thead><tr><th>Address</th><th>Network</th><th>IP</th><th>Time</th><th>Actions</th></tr></thead>
              <tbody>
                {wallets.pending.map((w) => (
                  <tr key={w.id}>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{w.walletAddress}</td>
                    <td>{w.network}</td>
                    <td>{w.ipAddress}</td>
                    <td>{new Date(w.timestamp).toLocaleString()}</td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className="btn-green-sm" onClick={() => handleApproveWallet(w.walletAddress)}>Approve</button>
                        <button className="btn-ghost-sm" style={{ color: "#ff6b6b" }} onClick={() => handleRejectWallet(w.walletAddress)}>Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div style={{ marginTop: "2rem" }}>
            <h3>Approved: {wallets.approved.length} | Rejected: {wallets.rejected.length}</h3>
          </div>
        </div>
      )}

      {/* Users */}
      {tab === "users" && (
        <div className="dash-txns">
          {users.length === 0 ? (
            <div className="dash-empty">No users yet</div>
          ) : (
            <table className="dash-table">
              <thead><tr><th>ID</th><th>Wallet</th><th>Staked</th><th>Earned</th><th>Rewards</th><th>VIP</th><th>Status</th></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{u.walletAddress.slice(0, 8)}...{u.walletAddress.slice(-4)}</td>
                    <td>${u.stakedAmount.toLocaleString()}</td>
                    <td className="dash-green">${u.totalEarned.toLocaleString()}</td>
                    <td>${u.claimableRewards.toLocaleString()}</td>
                    <td>{u.vipLevel}</td>
                    <td><span className={`dash-status dash-status--${u.status === "active" ? "completed" : u.status}`}>{u.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Withdrawals */}
      {tab === "withdrawals" && (
        <div className="dash-txns">
          {withdrawals.length === 0 ? (
            <div className="dash-empty">No pending withdrawals</div>
          ) : (
            <table className="dash-table">
              <thead><tr><th>ID</th><th>Wallet</th><th>Amount</th><th>Fee</th><th>Net</th><th>Type</th><th>Requested</th><th>Actions</th></tr></thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w.id}>
                    <td>{w.id}</td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{w.walletAddress.slice(0, 8)}...{w.walletAddress.slice(-4)}</td>
                    <td>${w.amount.toLocaleString()}</td>
                    <td>${w.fee.toLocaleString()}</td>
                    <td className="dash-green">${w.netAmount.toLocaleString()}</td>
                    <td>{w.withdrawalType}</td>
                    <td>{new Date(w.requestedAt).toLocaleString()}</td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className="btn-green-sm" onClick={() => handleApproveWithdrawal(w)}>Approve</button>
                        <button className="btn-ghost-sm" style={{ color: "#ff6b6b" }} onClick={() => handleRejectWithdrawal(w)}>Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
