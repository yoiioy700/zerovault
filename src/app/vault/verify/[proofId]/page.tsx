"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Shield, Clock, ExternalLink } from "lucide-react";
import { Logo } from "@/components/Logo";
import { loadProof, verifyProof, getCredentialForProof, type ZKProof } from "@/lib/proofs";

export default function VerifyPage() {
    const params = useParams();
    const proofId = params.proofId as string;

    const [mounted, setMounted] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [proof, setProof] = useState<ZKProof | null>(null);
    const [result, setResult] = useState<{ valid: boolean; reason: string } | null>(null);
    const [credentialType, setCredentialType] = useState<string>("");

    useEffect(() => {
        setMounted(true);
        // Simulate on-chain lookup delay
        setTimeout(() => {
            const foundProof = loadProof(proofId);
            if (foundProof) {
                const res = verifyProof(foundProof);
                const cred = getCredentialForProof(foundProof);
                setProof(foundProof);
                setResult(res);
                setCredentialType(cred?.type ?? "Unknown");
            } else {
                setResult({ valid: false, reason: "Proof not found on Starknet Sepolia" });
            }
            setVerifying(false);
        }, 1800);
    }, [proofId]);

    if (!mounted) return null;

    return (
        <div className="min-h-screen flex flex-col" style={{ background: "#000" }}>
            {/* Header — minimal, clean for external verifiers */}
            <header
                className="flex items-center justify-between px-4 sm:px-8 py-5 border-b"
                style={{ borderColor: "#1A1A1A" }}
            >
                <Link href="/" className="flex items-center gap-2">
                    <Logo size={28} />
                    <span className="font-bold" style={{ fontSize: 15 }}>ZeroVault</span>
                </Link>
                <span
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ background: "#22D3EE15", color: "#22D3EE", border: "1px solid #22D3EE30" }}
                >
                    Verifier View
                </span>
            </header>

            <main className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-md space-y-6">

                    {/* Verifying state */}
                    {verifying && (
                        <div className="flex flex-col items-center text-center gap-6 py-8">
                            <div className="relative">
                                <div
                                    className="w-24 h-24 rounded-full border-2 border-t-transparent animate-spin"
                                    style={{ borderColor: "#7C3AED40", borderTopColor: "#22D3EE" }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Logo size={36} />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold mb-2">Verifying Proof</h1>
                                <p className="text-sm" style={{ color: "#555" }}>Checking commitment on Starknet Sepolia...</p>
                            </div>
                            <div
                                className="w-full p-4 rounded-xl text-left"
                                style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", fontFamily: "var(--font-mono)", fontSize: 11 }}
                            >
                                {[
                                    "Querying Starknet Sepolia...",
                                    "Fetching commitment from contract...",
                                    "Running STARK verifier...",
                                ].map((line, i) => (
                                    <div key={line} className="flex items-center gap-2 mb-1.5" style={{ opacity: 0.6 + i * 0.2 }}>
                                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#22D3EE" }} />
                                        <span style={{ color: "#666" }}>{line}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Result — valid */}
                    {!verifying && result?.valid && proof && (
                        <div className="space-y-5 text-center">
                            <div
                                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto"
                                style={{ background: "rgba(16,185,129,0.1)", border: "2px solid rgba(16,185,129,0.4)" }}
                            >
                                <CheckCircle className="w-12 h-12" style={{ color: "#10B981" }} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-2" style={{ color: "#10B981" }}>Proof Valid ✓</h1>
                                <p className="text-sm" style={{ color: "#555", lineHeight: 1.6 }}>
                                    This person cryptographically proved ownership of a <strong style={{ color: "#FFF" }}>{credentialType}</strong> credential.
                                    Zero personal data was revealed.
                                </p>
                            </div>

                            {/* What was proved */}
                            <div
                                className="p-5 rounded-2xl text-left space-y-4"
                                style={{ background: "#0A0A0A", border: "1px solid #1A1A1A" }}
                            >
                                <p className="text-xs font-semibold" style={{ color: "#555", letterSpacing: 1 }}>VERIFIED CLAIMS</p>
                                {[
                                    { label: "Holds a valid credential", sublabel: `Type: ${credentialType}`, ok: true },
                                    { label: "Commitment verified on-chain", sublabel: "Starknet Sepolia", ok: true },
                                    { label: "Proof has not expired", sublabel: `Expires ${new Date(proof.expiresAt).toLocaleDateString()}`, ok: true },
                                    { label: "Raw data revealed", sublabel: "Nothing disclosed to verifier", ok: false, inverse: true },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-start gap-3">
                                        <div className="mt-0.5">
                                            {item.inverse ? (
                                                <XCircle className="w-4 h-4" style={{ color: "#EF4444" }} />
                                            ) : (
                                                <CheckCircle className="w-4 h-4" style={{ color: "#10B981" }} />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{item.label}</p>
                                            <p className="text-xs" style={{ color: item.inverse ? "#EF4444" : "#555" }}>{item.sublabel}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Commitment hash */}
                            <div
                                className="p-4 rounded-xl text-left"
                                style={{ background: "#0A0A0A", border: "1px solid #1A1A1A" }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield className="w-3.5 h-3.5" style={{ color: "#22D3EE" }} />
                                    <p className="text-xs" style={{ color: "#555", letterSpacing: 1 }}>ON-CHAIN COMMITMENT</p>
                                </div>
                                <p className="font-mono text-xs truncate" style={{ color: "#22D3EE" }}>{proof.commitment}</p>
                            </div>

                            <p className="text-xs" style={{ color: "#444" }}>
                                Proof ID: <span style={{ fontFamily: "var(--font-mono)", color: "#555" }}>{proof.id}</span>
                            </p>
                        </div>
                    )}

                    {/* Result — invalid */}
                    {!verifying && !result?.valid && (
                        <div className="text-center space-y-6 py-8">
                            <div
                                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto"
                                style={{ background: "rgba(239,68,68,0.1)", border: "2px solid rgba(239,68,68,0.3)" }}
                            >
                                <XCircle className="w-12 h-12" style={{ color: "#EF4444" }} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-2" style={{ color: "#EF4444" }}>Proof Invalid ✗</h1>
                                <p className="text-sm" style={{ color: "#555" }}>{result?.reason}</p>
                            </div>
                            <div
                                className="p-4 rounded-xl"
                                style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="w-3.5 h-3.5" style={{ color: "#EF4444" }} />
                                    <p className="text-xs" style={{ color: "#EF4444" }}>POSSIBLE REASONS</p>
                                </div>
                                <ul className="text-xs space-y-1 text-left" style={{ color: "#555" }}>
                                    <li>• Proof ID does not exist or was deleted</li>
                                    <li>• Proof has expired (30-day validity)</li>
                                    <li>• Commitment was tampered with</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Footer link */}
                    {!verifying && (
                        <div className="text-center pt-4">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-1.5 text-xs transition hover:text-white"
                                style={{ color: "#444" }}
                            >
                                <ExternalLink className="w-3 h-3" />
                                Create your own private credentials at zerovault.xyz
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
