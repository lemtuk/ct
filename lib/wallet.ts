export type NetworkId = "ETH" | "BSC" | "TRX" | "BTC";

const CHAIN_CONFIG: Record<string, { chainId: string; chainName: string; rpcUrls: string[]; nativeCurrency: { name: string; symbol: string; decimals: number }; blockExplorerUrls: string[] }> = {
  ETH: {
    chainId: "0x1",
    chainName: "Ethereum Mainnet",
    rpcUrls: ["https://eth.llamarpc.com"],
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://etherscan.io"],
  },
  BSC: {
    chainId: "0x38",
    chainName: "BNB Smart Chain",
    rpcUrls: ["https://bsc-dataseed1.binance.org/"],
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    blockExplorerUrls: ["https://bscscan.com"],
  },
};

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  isTrust?: boolean;
};

function getProvider(): EthereumProvider | null {
  if (typeof window === "undefined") return null;
  const eth = (window as unknown as { ethereum?: EthereumProvider }).ethereum;
  return eth || null;
}

function isMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export async function connectWallet(walletId: string, network: NetworkId): Promise<string> {
  const provider = getProvider();

  if (!provider) {
    if (isMobile()) {
      const dappUrl = window.location.host + window.location.pathname;
      if (walletId === "trust") {
        window.location.href = `https://link.trustwallet.com/open_url?coin_id=60&url=https://${dappUrl}`;
      } else {
        window.location.href = `https://metamask.app.link/dapp/${dappUrl}`;
      }
      throw new Error("Redirecting to wallet app...");
    }
    throw new Error("No wallet detected. Please install MetaMask or another Web3 wallet.");
  }

  const accounts = await provider.request({ method: "eth_requestAccounts" }) as string[];
  if (!accounts.length) throw new Error("No accounts found");

  const chainConfig = CHAIN_CONFIG[network];
  if (chainConfig) {
    try {
      await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: chainConfig.chainId }] });
    } catch (switchError: unknown) {
      const err = switchError as { code: number };
      if (err.code === 4902) {
        await provider.request({ method: "wallet_addEthereumChain", params: [chainConfig] });
      }
    }
  }

  return accounts[0];
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function isConnected(): { address: string; network: NetworkId } | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem("bb_wallet");
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

export function saveConnection(address: string, network: NetworkId) {
  localStorage.setItem("bb_wallet", JSON.stringify({ address, network }));
}

export function clearConnection() {
  localStorage.removeItem("bb_wallet");
}
