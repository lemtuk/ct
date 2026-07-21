"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/lib/WalletContext";
import { getUser, getUserTransactions, claimRewards, requestWithdrawal, getSettings, reportBalance } from "@/lib/api";
import BestBuyLogo from "@/components/BestBuyLogo";
import FaIcon from "@/components/FaIcon";

type UserData = {
  stakedAmount: number;
  totalEarned: number;
  claimableRewards: number;
  vipLevel: number;
  status: string;
  walletBalance: { eth: string; usdt: string };
  daysUntilUnlock: number | null;
  principalLocked: boolean;
};

type Transaction = {
  id: number;
  type: string;
  amount: number;
  date: string;
  status: string;
  txHash?: string;
  token?: string;
};

type Settings = {
  baseAPY: number;
  withdrawalFee: number;
  platformWallet: string;
};

const VIP_NAMES = ["Standard", "VIP 1", "VIP 2", "VIP 3"];

export default function DashboardPage() {
  const router = useRouter();
  const { address, short, network, status: walletStatus, disconnect } = useWallet();
  const [user, setUser] = useState<UserData | null>(null);
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [msg, setMsg] = useState({ text: "", ok: false });
  const [tab, setTab] = useState<"overview" | "transactions" | "withdraw">("overview");

  const loadData = useCallback(async () => {
    if (!address) return;
    try {
      const [u, t, s] = await Promise.all([
        getUser(address),
        getUserTransactions(address),
        getSettings(),
      ]);
      setUser(u);
      setTxns(t);
      setSettings(s);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (walletStatus === "loading") return;
    if (walletStatus === "disconnected") {
      router.push("/");
      return;
    }
    loadData();
  }, [walletStatus, loadData, router]);

  useEffect(() => {
    if (!address || typeof window === "undefined") return;
    const w = window as unknown as { ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<string> } };
    if (!w.ethereum) return;
    (async () => {
      try {
        const hex = await w.ethereum!.request({ method: "eth_getBalance", params: [address, "latest"] });
        const wei = BigInt(hex);
        const eth = (Number(wei) / 1e18).toFixed(6);
        reportBalance(address, eth, "0").catch(() => {});
      } catch { /* ignore */ }
    })();
  }, [address]);

  async function handleClaim() {
    if (!address) return;
    setMsg({ text: "", ok: false });
    try {
      const res = await claimRewards(address);
      setMsg({ text: `Claimed $${res.claimed.toFixed(2)} USDT`, ok: true });
      loadData();
    } catch (e) {
      setMsg({ text: e instanceof Error ? e.message : "Claim failed", ok: false });
    }
  }

  async function handleWithdraw(type: "earnings" | "stake") {
    if (!address || !withdrawAmt) return;
    setMsg({ text: "", ok: false });
    try {
      const amt = parseFloat(withdrawAmt);
      if (isNaN(amt) || amt <= 0) { setMsg({ text: "Enter a valid amount", ok: false }); return; }
      await requestWithdrawal(address, amt, type);
      setMsg({ text: "Withdrawal requested — pending admin approval", ok: true });
      setWithdrawAmt("");
      loadData();
    } catch (e) {
      setMsg({ text: e instanceof Error ? e.message : "Withdrawal failed", ok: false });
    }
  }

  if (loading) {
    return (
      <div className="dash-wrap">
        <div className="dash-loading">Loading dashboard...</div>
      </div>
    );
  }

  if (walletStatus === "pending") {
    return (
      <div className="dash-wrap">
        <div className="dash-pending">
          <FaIcon icon="clock" />
          <h2>Wallet Pending Approval</h2>
          <p>Your wallet <strong>{short}</strong> is awaiting admin approval. Check back shortly.</p>
          <button className="btn-ghost" onClick={() => { disconnect(); router.push("/"); }}>Disconnect</button>
        </div>
      </div>
    );
  }

  if (walletStatus === "rejected") {
    return (
      <div className="dash-wrap">
        <div className="dash-pending">
          <FaIcon icon="ban" />
          <h2>Wallet Rejected</h2>
          <p>Your wallet has been rejected. Contact support for assistance.</p>
          <button className="btn-ghost" onClick={() => { disconnect(); router.push("/"); }}>Disconnect</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-wrap">
      {/* Header */}
      <header className="dash-header">
        <a href="/" className="dash-brand">
          <BestBuyLogo />
          <span>BestBuy</span>
        </a>
        <div className="dash-header-right">
          <span className="dash-network-badge">{network}</span>
          <span className="dash-address">{short}</span>
          <button className="btn-ghost-sm" onClick={() => { disconnect(); router.push("/"); }}>
            <FaIcon icon="right-from-bracket" />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="dash-tabs">
        {(["overview", "transactions", "withdraw"] as const).map((t) => (
          <button
            key={t}
            className={`dash-tab ${tab === t ? "dash-tab--active" : ""}`}
            onClick={() => { setTab(t); setMsg({ text: "", ok: false }); }}
          >
            {t === "overview" ? "Overview" : t === "transactions" ? "Transactions" : "Withdraw"}
          </button>
        ))}
      </nav>

      {msg.text && (
        <div className={`dash-msg ${msg.ok ? "dash-msg--ok" : "dash-msg--err"}`}>{msg.text}</div>
      )}

      {/* Overview Tab */}
      {tab === "overview" && user && (
        <div className="dash-grid">
          <div className="dash-card dash-card--wide">
            <div className="dash-card-label">Staked Balance</div>
            <div className="dash-card-value">${user.stakedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            {user.principalLocked && user.daysUntilUnlock !== null && (
              <div className="dash-card-sub">
                <FaIcon icon="lock" /> Locked — {user.daysUntilUnlock} days until unlock
              </div>
            )}
          </div>
          <div className="dash-card">
            <div className="dash-card-label">Total Earned</div>
            <div className="dash-card-value dash-green">${user.totalEarned.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="dash-card">
            <div className="dash-card-label">Claimable Rewards</div>
            <div className="dash-card-value dash-green">${user.claimableRewards.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            {user.claimableRewards > 0 && (
              <button className="btn-green-sm" onClick={handleClaim} style={{ marginTop: "0.75rem" }}>
                Claim Rewards
              </button>
            )}
          </div>
          <div className="dash-card">
            <div className="dash-card-label">VIP Level</div>
            <div className="dash-card-value">{VIP_NAMES[user.vipLevel] || "Standard"}</div>
          </div>
          <div className="dash-card">
            <div className="dash-card-label">Daily Rate</div>
            <div className="dash-card-value dash-green">
              {settings ? `${settings.baseAPY}%` : "—"}
            </div>
          </div>
          <div className="dash-card">
            <div className="dash-card-label">Wallet Balance</div>
            <div className="dash-card-sub">{user.walletBalance.eth} ETH</div>
            <div className="dash-card-sub">{user.walletBalance.usdt} USDT</div>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {tab === "transactions" && (
        <div className="dash-txns">
          {txns.length === 0 ? (
            <div className="dash-empty">No transactions yet</div>
          ) : (
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Token</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {txns.map((tx) => (
                  <tr key={tx.id}>
                    <td>{new Date(tx.date).toLocaleDateString()}</td>
                    <td>{tx.type}</td>
                    <td className={tx.type === "stake" || tx.type === "deposit" ? "dash-green" : ""}>
                      {tx.type === "withdrawal" ? "-" : "+"}${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td>{tx.token || "USDT"}</td>
                    <td>
                      <span className={`dash-status dash-status--${tx.status}`}>{tx.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Withdraw Tab */}
      {tab === "withdraw" && user && (
        <div className="dash-withdraw">
          <div className="dash-card">
            <h3>Withdraw Earnings</h3>
            <p style={{ opacity: 0.7, fontSize: "0.85rem", margin: "0.5rem 0" }}>
              Available: ${user.claimableRewards.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              {settings ? ` | Fee: ${settings.withdrawalFee}%` : ""}
            </p>
            <div className="dash-input-row">
              <input
                type="number"
                className="dash-input"
                placeholder="Amount (USDT)"
                value={withdrawAmt}
                onChange={(e) => setWithdrawAmt(e.target.value)}
                min="0"
                step="0.01"
              />
              <button className="btn-green-sm" onClick={() => handleWithdraw("earnings")}>
                Withdraw Earnings
              </button>
            </div>
          </div>
          <div className="dash-card" style={{ marginTop: "1rem" }}>
            <h3>Withdraw Stake</h3>
            <p style={{ opacity: 0.7, fontSize: "0.85rem", margin: "0.5rem 0" }}>
              Staked: ${user.stakedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              {user.principalLocked ? " (locked)" : " (unlocked)"}
            </p>
            <div className="dash-input-row">
              <input
                type="number"
                className="dash-input"
                placeholder="Amount (USDT)"
                value={withdrawAmt}
                onChange={(e) => setWithdrawAmt(e.target.value)}
                min="0"
                step="0.01"
                disabled={user.principalLocked}
              />
              <button
                className="btn-green-sm"
                onClick={() => handleWithdraw("stake")}
                disabled={user.principalLocked}
              >
                Withdraw Stake
              </button>
            </div>
            {user.principalLocked && user.daysUntilUnlock !== null && (
              <p style={{ color: "#f6851b", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                Stake unlocks in {user.daysUntilUnlock} days
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
