"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "@starknet-react/core";
import { ConnectButton } from "@/components/ConnectButton";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Lock, Eye, CheckCircle, Clock, Fingerprint, Trash2 } from "lucide-react";
import { loadCredentials, deleteCredential, type Credential } from "@/lib/credentials";
import { AnchorButton } from "@/components/AnchorButton";
import { getProofForCredential } from "@/lib/proofs";

const typeColors: Record<string, string> = {
    Academic: "#7C3AED",
    Identity: "#06B6D4",
    Professional: "#10B981",
    Membership: "#F59E0B",
};

const typeIcons: Record<string, string> = {
    Academic: "🎓",
    Identity: "🪪",
    Professional: "💼",
    Membership: "🌍",
};

export default function VaultPage() {
    const { address, status } = useAccount();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [credentials, setCredentials] = useState<Credential[]>([]);
    const [proofCount, setProofCount] = useState(0);

    const refreshCredentials = useCallback(() => {
        const creds = loadCredentials();
        setCredentials(creds);
        setProofCount(creds.filter(c => !!getProofForCredential(c.id)).length);
    }, []);

    useEffect(() => {
        setMounted(true);
        refreshCredentials();
    }, [refreshCredentials]);

    if (!mounted) return null;

    function handleDelete(id: string) {
        deleteCredential(id);
        refreshCredentials();
    }

    return (
        <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
            {/* Header */}
            <header
                className="flex items-center justify-between px-4 sm:px-8 py-5 border-b sticky top-0 z-10"
                style={{ borderColor: "var(--border)", background: "rgba(4,4,8,0.9)", backdropFilter: "blur(12px)" }}
            >
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2">
                        <Logo size={32} />
                        <span className="text-base font-bold" style={{ fontFamily: "var(--font-mono)" }}>ZeroVault</span>
                    </Link>
                    <nav className="hidden sm:flex items-center gap-6 text-sm" style={{ color: "var(--muted)" }}>
                        <span className="font-medium" style={{ color: "var(--foreground)" }}>My Credentials</span>
                        <Link href="/vault/verify" className="hover:text-white transition">Verify</Link>
                    </nav>
                </div>
                <ConnectButton />
            </header>

            <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto w-full">
                {status !== "connected" ? (
                    /* Not connected */
                    <div className="flex flex-col items-center justify-center py-40 gap-6 text-center">
                        <div
                            className="w-20 h-20 rounded-full flex items-center justify-center"
                            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                        >
                            <Lock className="w-8 h-8" style={{ color: "#7C3AED" }} />
                        </div>
                        <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-mono)" }}>Connect Your Wallet</h2>
                        <p className="text-sm max-w-sm" style={{ color: "var(--muted)" }}>
                            Connect your ArgentX or Braavos wallet to access your private credential vault.
                        </p>
                        <ConnectButton />
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Page header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-mono)" }}>My Vault</h1>
                                <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                                    {address?.slice(0, 8)}...{address?.slice(-6)} · Starknet Sepolia
                                </p>
                            </div>
                            <Link
                                href="/vault/add"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition hover:opacity-90"
                                style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}
                            >
                                <Plus className="w-4 h-4" />
                                Add Credential
                            </Link>
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: "Total Credentials", value: credentials.length, icon: <Fingerprint className="w-5 h-5" /> },
                                { label: "On-Chain Verified", value: credentials.filter((c) => c.verified).length, icon: <CheckCircle className="w-5 h-5" /> },
                                { label: "Proofs Generated", value: proofCount, icon: <Eye className="w-5 h-5" /> },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="card-hover p-5 rounded-xl border"
                                    style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg" style={{ background: "#7C3AED15", color: "#A78BFA", border: "1px solid #7C3AED30" }}>
                                            {stat.icon}
                                        </div>
                                        <span className="text-xs tracking-wider" style={{ color: "var(--muted)", fontFamily: "var(--font-mono)" }}>{stat.label.toUpperCase()}</span>
                                    </div>
                                    <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-mono)", color: "#FFF", letterSpacing: "-1px" }}>{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Credentials Grid */}
                        <div>
                            <h2 className="text-sm font-medium mb-4" style={{ color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                                YOUR CREDENTIALS
                            </h2>

                            {credentials.length === 0 ? (
                                /* Empty state */
                                <div
                                    className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed gap-4 text-center"
                                    style={{ borderColor: "#222" }}
                                >
                                    <span style={{ fontSize: 40 }}>🔐</span>
                                    <div>
                                        <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No credentials yet</p>
                                        <p style={{ fontSize: 13, color: "#555" }}>Add your first credential to get started</p>
                                    </div>
                                    <Link
                                        href="/vault/add"
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition hover:opacity-90"
                                        style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", color: "#FFF" }}
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add First Credential
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {credentials.map((cred) => (
                                        <div
                                            key={cred.id}
                                            className="card-hover p-5 rounded-xl border flex flex-col"
                                            style={{
                                                borderColor: "var(--border)",
                                                background: "var(--surface)",
                                            }}
                                        >
                                            {/* Type + status row */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <span style={{ fontSize: 18 }}>{typeIcons[cred.type] ?? "📄"}</span>
                                                    <span
                                                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                                                        style={{
                                                            background: `${typeColors[cred.type] ?? "#888"}20`,
                                                            color: typeColors[cred.type] ?? "#888",
                                                        }}
                                                    >
                                                        {cred.type}
                                                    </span>
                                                </div>
                                                {cred.verified ? (
                                                    <div className="flex items-center gap-1 text-xs" style={{ color: "#10B981" }}>
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                        On-Chain
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}>
                                                        <Clock className="w-3.5 h-3.5" />
                                                        Local
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <h3 className="font-semibold mb-1 text-sm">{cred.title}</h3>
                                            <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>Issued by {cred.issuer}</p>
                                            {cred.issuedAt && (
                                                <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
                                                    {new Date(cred.issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                                </p>
                                            )}

                                            {/* Commitment */}
                                            <div className="border-t pt-3 mt-auto" style={{ borderColor: "var(--border)" }}>
                                                <p className="text-xs truncate" style={{ color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                                                    {cred.commitment}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col gap-2 mt-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => router.push(`/vault/proof/${cred.id}`)}
                                                        className="flex-1 py-2 rounded-lg text-xs font-medium border transition hover:border-purple-500 hover:text-purple-400"
                                                        style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                                                    >
                                                        Generate Proof →
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(cred.id)}
                                                        className="p-2 rounded-lg border transition hover:border-red-800 hover:text-red-400"
                                                        style={{ borderColor: "var(--border)", color: "#555" }}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <AnchorButton
                                                    credentialId={cred.id}
                                                    commitment={cred.commitment}
                                                    isAnchored={cred.verified}
                                                    onAnchored={refreshCredentials}
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add new card */}
                                    <Link
                                        href="/vault/add"
                                        className="flex flex-col items-center justify-center p-5 rounded-xl border border-dashed text-center gap-3 transition hover:border-purple-800"
                                        style={{ borderColor: "var(--border)", minHeight: 200 }}
                                    >
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center"
                                            style={{ background: "var(--surface-2)" }}
                                        >
                                            <Plus className="w-5 h-5" style={{ color: "#A78BFA" }} />
                                        </div>
                                        <p className="text-sm" style={{ color: "var(--muted)" }}>Add Credential</p>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
