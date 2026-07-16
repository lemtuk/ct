const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://bestcrypto-backend-production.up.railway.app";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data as T;
}

export async function requestApproval(walletAddress: string, network: string) {
  return request<{ success: boolean; approved: boolean; message: string; rejected?: boolean }>(
    "/api/request-approval",
    {
      method: "POST",
      body: JSON.stringify({
        walletAddress,
        network,
        ipAddress: "web-client",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      }),
    }
  );
}

export async function checkApproval(address: string) {
  return request<{ approved: boolean; found: boolean; status?: string }>(
    `/api/check-approval/${address}`
  );
}

export async function getUser(walletAddress: string) {
  return request<{
    userId: number | null;
    stakedAmount: number;
    totalEarned: number;
    claimableRewards: number;
    vipLevel: number;
    status: string;
    walletBalance: { eth: string; usdt: string };
    joinDate: string | null;
    stakeStartDate: string | null;
    daysUntilUnlock: number | null;
    principalLocked: boolean;
  }>(`/api/user/${walletAddress}`);
}

export async function getUserTransactions(walletAddress: string) {
  return request<Array<{
    id: number;
    type: string;
    amount: number;
    date: string;
    status: string;
    txHash?: string;
    token?: string;
  }>>(`/api/user/${walletAddress}/transactions`);
}

export async function getSettings() {
  return request<{
    baseAPY: number;
    minStake: number;
    maxStake: number;
    withdrawalFee: number;
    platformWallet: string;
    platformWalletETH: string;
    platformWalletBSC: string;
    platformWalletBTC: string;
  }>("/api/settings");
}

export async function submitStake(walletAddress: string, amount: number, txHash: string, network: string, token: string) {
  return request<{ success: boolean; message: string }>(
    "/api/stake/manual",
    {
      method: "POST",
      body: JSON.stringify({ walletAddress, amount, txHash, network, token }),
    }
  );
}

export async function claimRewards(walletAddress: string) {
  return request<{ success: boolean; claimed: number }>("/api/claim", {
    method: "POST",
    body: JSON.stringify({ walletAddress }),
  });
}

export async function requestWithdrawal(walletAddress: string, amount: number, type: string = "earnings") {
  const endpoint = type === "earnings" ? "/api/withdraw/earnings" : "/api/withdraw/request";
  return request<{ success: boolean; message: string }>(endpoint, {
    method: "POST",
    body: JSON.stringify({ walletAddress, amount }),
  });
}

export async function getWalletBalance(address: string) {
  return request<{
    totalUsd: number;
    tokens: Array<{ symbol: string; balance: string; usdValue: number }>;
  }>(`/api/wallet-balance/${address}`);
}

export async function getUserNotifications(address: string) {
  return request<Array<{ id: number; type: string; message: string; dismissed: boolean; createdAt: string }>>(
    `/api/user/${address}/notifications`
  );
}

export async function reportBalance(walletAddress: string, eth: string, usdt: string) {
  return request<{ success: boolean }>("/api/report-balance", {
    method: "POST",
    body: JSON.stringify({ walletAddress, eth, usdt }),
  });
}
