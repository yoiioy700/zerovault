"use client";

import { useState, useEffect, useRef } from "react";
import { useConnect, useDisconnect, useAccount } from "@starknet-react/core";
import { Wallet, LogOut, ChevronDown, ExternalLink } from "lucide-react";

export function ConnectButton() {
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const { address, status } = useAccount();
    const [mounted, setMounted] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => { setMounted(true); }, []);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShowMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!mounted) return null;

    // ── Connected ──────────────────────────────────────────────────────────────
    if (status === "connected" && address) {
        const short = `${address.slice(0, 6)}...${address.slice(-4)}`;
        return (
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition"
                    style={{ borderColor: "#7C3AED50", background: "#7C3AED15", color: "#A78BFA" }}
                >
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    {short}
                    <ChevronDown className="w-3 h-3" style={{ transform: showMenu ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
                </button>
                {showMenu && (
                    <div
                        className="absolute right-0 top-12 rounded-xl border text-sm overflow-hidden z-50"
                        style={{ borderColor: "#222", background: "#0A0A0A", minWidth: "180px", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
                    >
                        <div className="px-4 py-3 border-b" style={{ borderColor: "#1A1A1A" }}>
                            <p className="text-xs" style={{ color: "#555" }}>Connected</p>
                            <p className="font-mono text-xs mt-0.5" style={{ color: "#A78BFA" }}>{short}</p>
                        </div>
                        <button
                            onClick={() => { disconnect(); setShowMenu(false); }}
                            className="flex items-center gap-2 px-4 py-3 w-full hover:bg-white/5 transition"
                            style={{ color: "#EF4444" }}
                        >
                            <LogOut className="w-4 h-4" />
                            Disconnect
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // ── No wallets detected ────────────────────────────────────────────────────
    if (connectors.length === 0) {
        return (
            <a
                href="https://www.argent.xyz/argent-x/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition"
                style={{ background: "#7C3AED20", color: "#A78BFA", border: "1px solid #7C3AED50" }}
            >
                <Wallet className="w-4 h-4" />
                Install a Wallet
                <ExternalLink className="w-3 h-3" />
            </a>
        );
    }

    // ── Single connector: connect directly ────────────────────────────────────
    if (connectors.length === 1) {
        return (
            <button
                onClick={() => connect({ connector: connectors[0] })}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}
            >
                <Wallet className="w-4 h-4" />
                Connect {connectors[0].name}
            </button>
        );
    }

    // ── Multiple wallets: show picker dropdown ─────────────────────────────────
    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}
            >
                <Wallet className="w-4 h-4" />
                Connect Wallet
                <ChevronDown className="w-3 h-3" style={{ transform: showMenu ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
            </button>

            {showMenu && (
                <div
                    className="absolute right-0 top-12 rounded-xl border overflow-hidden z-50"
                    style={{ borderColor: "#222", background: "#0A0A0A", minWidth: "220px", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}
                >
                    <div className="px-4 py-3 border-b" style={{ borderColor: "#1A1A1A" }}>
                        <p className="text-xs font-semibold" style={{ color: "#555", letterSpacing: 1 }}>
                            SELECT WALLET
                        </p>
                    </div>
                    {connectors.map((connector) => (
                        <button
                            key={connector.id}
                            onClick={() => { connect({ connector }); setShowMenu(false); }}
                            className="flex items-center gap-3 px-4 py-3 w-full text-sm hover:bg-white/5 transition"
                            style={{ color: "var(--foreground)" }}
                        >
                            {/* Wallet icon if available */}
                            {connector.icon ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={typeof connector.icon === "string" ? connector.icon : connector.icon.dark ?? connector.icon.light ?? ""}
                                    alt={connector.name}
                                    className="w-6 h-6 rounded-md"
                                />
                            ) : (
                                <div
                                    className="w-6 h-6 rounded-md flex items-center justify-center"
                                    style={{ background: "#1A1A1A" }}
                                >
                                    <Wallet className="w-3.5 h-3.5" style={{ color: "#A78BFA" }} />
                                </div>
                            )}
                            <span>{connector.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
