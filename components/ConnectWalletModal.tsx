"use client";

import { useEffect, useState } from "react";
import FaIcon from "@/components/FaIcon";

type Network = "BSC" | "ETH" | "TRX" | "BTC";

const NETWORKS: Network[] = ["BSC", "ETH", "TRX", "BTC"];

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
  const [network, setNetwork] = useState<Network>("ETH");
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setClosing(false);
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
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <p className="wallet-modal-subtitle">
          Choose your preferred wallet to connect to <strong>BestBuy</strong>
        </p>

        <div className="wallet-options">
          {WALLETS.map((wallet) => (
            <button key={wallet.id} type="button" className="wallet-option">
              <span className="wallet-option-icon" style={{ background: `${wallet.color}22`, color: wallet.color }}>
                <FaIcon icon={wallet.icon} />
              </span>
              <span className="wallet-option-copy">
                <span className="wallet-option-name">{wallet.name}</span>
                <span className="wallet-option-desc">{wallet.description}</span>
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
