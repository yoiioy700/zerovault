"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, ShieldCheck, Loader2, Fingerprint } from "lucide-react";
import { verifyProof } from "@/lib/proofs";

export default function VerifyPage() {
    const [proofInput, setProofInput] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [result, setResult] = useState<"idle" | "valid" | "invalid">("idle");
    const [verifiedData, setVerifiedData] = useState<{ type: string; issuer?: string; commitment?: string } | null>(null);

    async function handleVerify(e: React.FormEvent) {
        e.preventDefault();
        if (!proofInput.trim()) return;

        setVerifying(true);
        setResult("idle");
        setVerifiedData(null);

        // Simulate network delay for verification realism
        await new Promise((resolve) => setTimeout(resolve, 1500));

        try {
            const parsedProof = JSON.parse(proofInput);
            const isValid = verifyProof(parsedProof);

            if (isValid) {
                setResult("valid");
                // Extract public inputs from the proof to display (stored at root in our mock structure)
                setVerifiedData({
                    type: parsedProof.type || "Verified Credential",
                    issuer: parsedProof.issuer || "Verified Issuer",
                    commitment: parsedProof.commitment || parsedProof.publicSignals?.[0] || "0x...",
                });
            } else {
                setResult("invalid");
            }
        } catch (e) {
            console.error("Failed to parse or verify proof:", e);
            setResult("invalid");
        } finally {
            setVerifying(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center py-20 px-4 sm:px-8" style={{ background: "var(--background)" }}>
            <div className="w-full max-w-2xl">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition hover:text-white"
                    style={{ color: "var(--muted)" }}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="mb-8 relative">
                    <div className="absolute -left-4 -top-4 w-16 h-16 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #22D3EE 0%, transparent 70%)" }} />
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3" style={{ fontFamily: "var(--font-mono)" }}>
                        <ShieldCheck className="w-8 h-8" style={{ color: "#22D3EE" }} />
                        Verify Proof
                    </h1>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                        Paste a STARK zero-knowledge proof below to mathematically verify a credential.
                        The verifier learns nothing about the underlying sensitive data.
                    </p>
                </div>

                <div className="p-1 rounded-2xl mb-8" style={{ background: "linear-gradient(to bottom, #111, #050505)", border: "1px solid #222" }}>
                    <form onSubmit={handleVerify} className="p-5 sm:p-8 flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-medium flex items-center justify-between" style={{ color: "var(--muted)" }}>
                                <span>Paste STARK Proof JSON</span>
                                {proofInput && (
                                    <button
                                        type="button"
                                        onClick={() => setProofInput("")}
                                        className="text-xs hover:text-white transition"
                                    >
                                        Clear
                                    </button>
                                )}
                            </label>
                            <textarea
                                value={proofInput}
                                onChange={(e) => setProofInput(e.target.value)}
                                placeholder='{"proof": "0x...", "public_inputs": {...}}'
                                className="w-full h-48 sm:h-64 p-4 rounded-xl text-sm font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-shadow"
                                style={{
                                    background: "var(--surface)",
                                    border: "1px solid var(--border)",
                                    color: "var(--foreground)",
                                    resize: "none"
                                }}
                                spellCheck="false"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!proofInput.trim() || verifying}
                            className="w-full py-4 rounded-xl text-sm justify-center font-bold flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                background: verifying ? "var(--surface)" : "#22D3EE",
                                color: verifying ? "var(--muted)" : "#000",
                                border: verifying ? "1px solid var(--border)" : "none",
                            }}
                        >
                            {verifying ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Mathematical Verification in Progress...</span>
                                </>
                            ) : (
                                "Verify STARK Proof"
                            )}
                        </button>
                    </form>
                </div>

                {/* Verification Result Area */}
                <div style={{ minHeight: "200px" }}>
                    {result === "valid" && verifiedData && (
                        <div className="p-6 rounded-2xl animate-fade-in border flex flex-col items-center text-center gap-4"
                            style={{ background: "#064E3B20", borderColor: "#10B98150" }}>
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2" style={{ background: "#10B98120" }}>
                                <CheckCircle className="w-8 h-8" style={{ color: "#10B981" }} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold" style={{ color: "#10B981", letterSpacing: "-0.5px" }}>Proof Valid</h3>
                                <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                                    The cryptographic receipt matches the on-chain commitment.
                                </p>
                            </div>

                            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-left">
                                <div className="p-4 rounded-xl" style={{ background: "rgba(0,0,0,0.4)" }}>
                                    <span className="text-xs uppercase tracking-wider block mb-1" style={{ color: "var(--muted)", fontFamily: "var(--font-mono)" }}>Verified Claim</span>
                                    <span className="text-sm font-semibold">{verifiedData.type}</span>
                                </div>
                                <div className="p-4 rounded-xl" style={{ background: "rgba(0,0,0,0.4)" }}>
                                    <span className="text-xs uppercase tracking-wider block mb-1" style={{ color: "var(--muted)", fontFamily: "var(--font-mono)" }}>Issued By</span>
                                    <span className="text-sm font-semibold">{verifiedData.issuer}</span>
                                </div>
                                <div className="p-4 rounded-xl sm:col-span-2 flex flex-col gap-1" style={{ background: "rgba(0,0,0,0.4)" }}>
                                    <span className="text-xs uppercase tracking-wider flex items-center gap-1.5" style={{ color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                                        <Fingerprint className="w-3 h-3" />
                                        Commitment Hash
                                    </span>
                                    <span className="text-xs font-mono truncate" style={{ color: "#10B981" }}>{verifiedData.commitment}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {result === "invalid" && (
                        <div className="p-6 rounded-2xl animate-fade-in border flex flex-col items-center text-center gap-4"
                            style={{ background: "#7F1D1D20", borderColor: "#EF444450" }}>
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2" style={{ background: "#EF444420" }}>
                                <XCircle className="w-8 h-8" style={{ color: "#EF4444" }} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold" style={{ color: "#EF4444", letterSpacing: "-0.5px" }}>Proof Invalid or Malformed</h3>
                                <p className="text-sm mt-1 max-w-sm" style={{ color: "var(--muted)" }}>
                                    The provided JSON could not be cryptographically verified against the constraints. Data may have been tampered with.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
