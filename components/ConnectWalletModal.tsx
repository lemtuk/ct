"use client";

import { useEffect, useState } from "react";
import FaIcon from "@/components/FaIcon";
import { useWallet } from "@/lib/WalletContext";
import type { NetworkId } from "@/lib/wallet";

const NETWORKS: NetworkId[] = ["BSC", "ETH"];

const WALLETS = [
  {
    id: "metamask",
    name: "MetaMask",
    description: "Connect using MetaMask wallet",
    icon: "wallet",
    brand: false,
    color: "#f6851b",
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    description: "Connect with Coinbase",
    icon: "circle-dollar-to-slot",
    brand: false,
    color: "#0052ff",
  },
  {
    id: "trust",
    name: "Trust Wallet",
    description: "Connect using Trust Wallet",
    icon: "shield-halved",
    brand: false,
    color: "#3375bb",
  },
] as const;

type ConnectWalletModalProps = {
  open: boolean;
  onClose: () => void;
};

const CLOSE_MS = 340;

export default function ConnectWalletModal({ open, onClose }: ConnectWalletModalProps) {
  const [network, setNetwork] = useState<NetworkId>("ETH");
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [error, setError] = useState("");
  const { connect, status } = useWallet();

  const isConnecting = status === "connecting";

  useEffect(() => {
    if (open) {
      setVisible(true);
      setClosing(false);
      setError("");
      return;
    }

    if (!visible) return;

    setClosing(true);
    const timer = window.setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, CLOSE_MS);

    return () => window.clearTimeout(timer);
  }, [open, visible]);

  useEffect(() => {
    if (!visible) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [visible, onClose]);

  async function handleConnect(walletId: string) {
    setError("");
    try {
      await connect(walletId, network);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Connection failed");
    }
  }

  if (!visible) return null;

  return (
    <div
      className={`wallet-modal-backdrop ${closing ? "wallet-modal-backdrop--closing" : "wallet-modal-backdrop--open"}`}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`wallet-modal ${closing ? "wallet-modal--closing" : "wallet-modal--open"}`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-modal-title"
      >
        <div className="wallet-modal-grabber" aria-hidden="true" />

        <div className="wallet-modal-header">
          <h2 id="wallet-modal-title" className="wallet-modal-title">
            Connect Wallet
          </h2>
          <button type="button" className="wallet-modal-close" onClick={onClose} aria-label="Close">
            <FaIcon icon="xmark" />
          </button>
        </div>

        <div className="wallet-modal-networks">
          <span className="wallet-modal-network-label">Network:</span>
          <div className="wallet-network-pills">
            {NETWORKS.map((item) => (
              <button
                key={item}
                type="button"
                className={`wallet-network-pill ${network === item ? "wallet-network-pill--active" : ""}`}
                onClick={() => setNetwork(item)}
                disabled={isConnecting}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <p className="wallet-modal-subtitle">
          Choose your preferred wallet to connect to <strong>BestBuy</strong>
        </p>

        {error && (
          <div style={{ color: "#ff6b6b", fontSize: "0.85rem", padding: "0.5rem 1rem", textAlign: "center" }}>
            {error}
          </div>
        )}

        <div className="wallet-options">
          {WALLETS.map((wallet) => (
            <button
              key={wallet.id}
              type="button"
              className="wallet-option"
              onClick={() => handleConnect(wallet.id)}
              disabled={isConnecting}
              style={isConnecting ? { opacity: 0.6, cursor: "wait" } : undefined}
            >
              <span className="wallet-option-icon" style={{ background: `${wallet.color}22`, color: wallet.color }}>
                <FaIcon icon={wallet.icon} />
              </span>
              <span className="wallet-option-copy">
                <span className="wallet-option-name">{wallet.name}</span>
                <span className="wallet-option-desc">
                  {isConnecting ? "Connecting..." : wallet.description}
                </span>
              </span>
              <FaIcon icon="chevron-right" className="wallet-option-arrow" />
            </button>
          ))}
        </div>

        <p className="wallet-modal-footer">
          New to Ethereum wallets?{" "}
          <a href="#footer" onClick={onClose}>
            Learn more
          </a>
        </p>
      </div>
    </div>
  );
}
