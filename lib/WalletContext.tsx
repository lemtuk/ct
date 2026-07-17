"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { connectWallet as doConnect, isConnected, saveConnection, clearConnection, shortenAddress, type NetworkId } from "./wallet";
import { requestApproval, checkApproval } from "./api";

type WalletState = {
  address: string | null;
  network: NetworkId;
  short: string;
  status: "disconnected" | "connecting" | "pending" | "approved" | "rejected";
  connect: (walletId: string, network: NetworkId) => Promise<void>;
  disconnect: () => void;
};

const WalletContext = createContext<WalletState>({
  address: null,
  network: "ETH",
  short: "",
  status: "disconnected",
  connect: async () => {},
  disconnect: () => {},
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<NetworkId>("ETH");
  const [status, setStatus] = useState<WalletState["status"]>("disconnected");

  // Restore saved session on mount
  useEffect(() => {
    const saved = isConnected();
    if (saved) {
      setAddress(saved.address);
      setNetwork(saved.network);
      // Check approval status
      checkApproval(saved.address).then((res) => {
        if (res.approved) setStatus("approved");
        else if (res.status === "rejected") setStatus("rejected");
        else if (res.found) setStatus("pending");
        else setStatus("disconnected");
      }).catch(() => setStatus("disconnected"));
    }
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const eth = (window as unknown as { ethereum?: { on?: (e: string, cb: (a: string[]) => void) => void; removeListener?: (e: string, cb: (a: string[]) => void) => void } }).ethereum;
    if (!eth) return;
    const handleChange = (accounts: string[]) => {
      if (!accounts.length) {
        setAddress(null);
        setStatus("disconnected");
        clearConnection();
      }
    };
    eth.on?.("accountsChanged", handleChange);
    return () => { eth.removeListener?.("accountsChanged", handleChange); };
  }, []);

  const connect = useCallback(async (walletId: string, net: NetworkId) => {
    setStatus("connecting");
    try {
      const addr = await doConnect(walletId, net);
      setAddress(addr);
      setNetwork(net);
      saveConnection(addr, net);

      // Register with backend
      const result = await requestApproval(addr, net);
      if (result.approved) {
        setStatus("approved");
      } else if (result.rejected) {
        setStatus("rejected");
      } else {
        setStatus("pending");
      }
    } catch (e) {
      setStatus("disconnected");
      throw e;
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setStatus("disconnected");
    clearConnection();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        network,
        short: address ? shortenAddress(address) : "",
        status,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
