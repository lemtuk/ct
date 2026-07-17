const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://bestcrypto-backend-production.up.railway.app";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("bb_admin_token");
}

async function adminRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  const data = await res.json();
  if (res.status === 401) {
    localStorage.removeItem("bb_admin_token");
    throw new Error("Session expired");
  }
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data as T;
}

export async function adminLogin(username: string, password: string) {
  const res = await adminRequest<{ success: boolean; token: string; error?: string }>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  if (res.token) localStorage.setItem("bb_admin_token", res.token);
  return res;
}

export async function adminVerify() {
  return adminRequest<{ valid: boolean }>("/api/admin/verify");
}

export async function adminLogout() {
  await adminRequest("/api/admin/logout", { method: "POST" }).catch(() => {});
  localStorage.removeItem("bb_admin_token");
}

export async function getStats() {
  return adminRequest<{
    totalUsers: number;
    activeUsers: number;
    totalStaked: number;
    totalEarned: number;
    pendingWithdrawals: number;
    pendingWallets: number;
  }>("/api/admin/stats");
}

export async function getUsers() {
  return adminRequest<Array<{
    id: number;
    walletAddress: string;
    stakedAmount: number;
    totalEarned: number;
    claimableRewards: number;
    vipLevel: number;
    status: string;
    joinDate: string;
  }>>("/api/admin/users");
}

export async function getWallets() {
  return adminRequest<{
    pending: Array<{ id: number; walletAddress: string; network: string; timestamp: string; ipAddress: string }>;
    approved: string[];
    rejected: string[];
  }>("/api/admin/wallets");
}

export async function approveWallet(walletAddress: string) {
  return adminRequest<{ success: boolean }>("/api/admin/approve", {
    method: "POST",
    body: JSON.stringify({ walletAddress }),
  });
}

export async function rejectWallet(walletAddress: string) {
  return adminRequest<{ success: boolean }>("/api/admin/reject", {
    method: "POST",
    body: JSON.stringify({ walletAddress }),
  });
}

export async function getPendingWithdrawals() {
  return adminRequest<Array<{
    id: number;
    walletAddress: string;
    amount: number;
    netAmount: number;
    fee: number;
    status: string;
    withdrawalType: string;
    requestedAt: string;
  }>>("/api/admin/withdrawals/pending");
}

export async function approveWithdrawal(withdrawalId: number, walletAddress: string) {
  return adminRequest<{ success: boolean }>("/api/admin/withdraw/approve", {
    method: "POST",
    body: JSON.stringify({ withdrawalId, walletAddress }),
  });
}

export async function rejectWithdrawal(withdrawalId: number, walletAddress: string, reason?: string) {
  return adminRequest<{ success: boolean }>("/api/admin/withdraw/reject", {
    method: "POST",
    body: JSON.stringify({ withdrawalId, walletAddress, reason }),
  });
}

export async function addUserBalance(userId: number, amount: number, type: string = "reward") {
  return adminRequest<{ success: boolean }>(`/api/admin/users/${userId}/balance`, {
    method: "POST",
    body: JSON.stringify({ amount, type }),
  });
}

export async function getAdminSettings() {
  return adminRequest<Record<string, string>>("/api/admin/settings");
}

export async function updateSettings(settings: Record<string, string>) {
  return adminRequest<{ success: boolean }>("/api/admin/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  });
}
