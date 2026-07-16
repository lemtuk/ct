import { ethers } from "ethers";

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

export async function connectWallet(walletId: string, network: NetworkId): Promise<string> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No wallet detected. Please install MetaMask or another Web3 wallet.");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);

  // Request account access
  const accounts = await provider.send("eth_requestAccounts", []);
  if (!accounts.length) throw new Error("No accounts found");

  // Switch to the correct network if EVM
  const chainConfig = CHAIN_CONFIG[network];
  if (chainConfig) {
    try {
      await provider.send("wallet_switchEthereumChain", [{ chainId: chainConfig.chainId }]);
    } catch (switchError: unknown) {
      const err = switchError as { code: number };
      if (err.code === 4902) {
        await provider.send("wallet_addEthereumChain", [chainConfig]);
      }
    }
  }

  return accounts[0] as string;
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
