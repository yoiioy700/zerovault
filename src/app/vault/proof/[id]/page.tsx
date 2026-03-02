"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Shield, Copy, CheckCircle, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ConnectButton } from "@/components/ConnectButton";
import { loadCredentials, type Credential } from "@/lib/credentials";
import { generateMockProof, getProofForCredential, type ZKProof } from "@/lib/proofs";

type Stage = "idle" | "proving" | "done" | "error";

const STAGES = [
    { label: "Initialising STARK prover", duration: 500 },
    { label: "Loading public parameters", duration: 700 },
    { label: "Deriving witness from commitment", duration: 900 },
    { label: "Computing Pedersen constraint system", duration: 1100 },
    { label: "Generating STARK proof trace", duration: 800 },
    { label: "Verifying proof locally", duration: 600 },
];

export default function ProofPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [credential, setCredential] = useState<Credential | null>(null);
    const [existingProof, setExistingProof] = useState<ZKProof | null>(null);
    const [stage, setStage] = useState<Stage>("idle");
    const [stageIndex, setStageIndex] = useState(-1);
    const [proof, setProof] = useState<ZKProof | null>(null);
    const [copied, setCopied] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const creds = loadCredentials();
        const cred = creds.find((c) => c.id === id);
        if (cred) {
            setCredential(cred);
            const existing = getProofForCredential(id);
            if (existing) setExistingProof(existing);
        }
    }, [id]);

    if (!mounted) return null;

    if (!credential) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#000" }}>
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: "#EF4444" }} />
                    <h2 className="text-xl font-bold mb-2">Credential not found</h2>
                    <Link href="/vault" className="text-sm" style={{ color: "#7C3AED" }}>Back to vault</Link>
                </div>
            </div>
        );
    }

    async function handleGenerate() {
        if (!credential) return;
        setStage("proving");
        setStageIndex(0);

        // Feed stages progressively
        let idx = 0;
        const interval = setInterval(() => {
            idx++;
            setStageIndex(idx);
            if (idx >= STAGES.length - 1) clearInterval(interval);
        }, 700);

        try {
            const generated = await generateMockProof(credential.id, credential.commitment);
            clearInterval(interval);
            setStageIndex(STAGES.length);
            setProof(generated);
            setStage("done");
        } catch {
            clearInterval(interval);
            setStage("error");
        }
    }

    const verifyLink = typeof window !== "undefined"
        ? `${window.location.origin}/vault/verify/${(proof ?? existingProof)?.id ?? ""}`
        : "";

    function copy(text: string) {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const displayProof = proof ?? existingProof;

    return (
        <div className="min-h-screen flex flex-col" style={{ background: "#000" }}>
            {/* Header */}
            <header
                className="flex items-center justify-between px-4 sm:px-8 py-5 border-b sticky top-0 z-10"
                style={{ borderColor: "#1A1A1A", background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)" }}
            >
                <div className="flex items-center gap-6">
                    <Link href="/vault" className="flex items-center gap-2">
                        <Logo size={32} />
                        <span className="text-base font-bold" style={{ fontFamily: "var(--font-mono)" }}>ZeroVault</span>
                    </Link>
                    <div className="hidden sm:flex items-center gap-2 text-sm" style={{ color: "#555" }}>
                        <Link href="/vault" style={{ color: "#555" }}>Vault</Link>
                        <span style={{ color: "#333" }}>/</span>
                        <span style={{ color: "#FFF" }}>Generate Proof</span>
                    </div>
                </div>
                <ConnectButton />
            </header>

            <main className="flex-1 flex items-start justify-center px-4 py-12">
                <div className="w-full max-w-xl space-y-6">
                    <Link href="/vault" className="flex items-center gap-1.5 text-sm" style={{ color: "#555" }}>
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Vault
                    </Link>

                    {/* Credential Card */}
                    <div className="p-5 rounded-2xl" style={{ background: "#0A0A0A", border: "1px solid #1A1A1A" }}>
                        <p className="text-xs mb-3" style={{ color: "#555", letterSpacing: 1 }}>CREDENTIAL</p>
                        <h2 className="font-bold text-lg mb-1">{credential.title}</h2>
                        <p className="text-sm mb-3" style={{ color: "#666" }}>Issued by {credential.issuer}</p>
                        <div className="flex items-center gap-2 font-mono text-xs truncate" style={{ color: "#22D3EE" }}>
                            <Shield className="w-3.5 h-3.5 shrink-0" />
                            {credential.commitment}
                        </div>
                    </div>

                    {/* === IDLE STATE === */}
                    {stage === "idle" && !displayProof && (
                        <div className="text-center space-y-6 py-6">
                            <div>
                                <h1 className="text-2xl font-bold mb-2" style={{ letterSpacing: "-0.5px" }}>Generate ZK Proof</h1>
                                <p className="text-sm" style={{ color: "#555", lineHeight: 1.6 }}>
                                    Create a zero-knowledge proof that cryptographically attests to this credential without revealing any underlying data.
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-3 text-center">
                                {[
                                    { icon: "🔏", label: "Zero data revealed" },
                                    { icon: "⛓️", label: "On-chain verifiable" },
                                    { icon: "🔗", label: "Shareable link" },
                                ].map((f) => (
                                    <div key={f.label} className="p-4 rounded-xl" style={{ background: "#0A0A0A", border: "1px solid #1A1A1A" }}>
                                        <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
                                        <p style={{ fontSize: 11, color: "#666" }}>{f.label}</p>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleGenerate}
                                className="w-full py-4 rounded-xl font-semibold transition hover:opacity-90"
                                style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", fontSize: 15, color: "#FFF" }}
                            >
                                Generate Proof
                            </button>
                        </div>
                    )}

                    {/* === EXISTING PROOF STATE === */}
                    {stage === "idle" && displayProof && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" style={{ color: "#10B981" }} />
                                <h2 className="font-semibold">Proof already generated</h2>
                            </div>
                            {renderProofResult(displayProof, verifyLink, copy, copied, handleGenerate)}
                        </div>
                    )}

                    {/* === PROVING STATE === */}
                    {stage === "proving" && (
                        <div className="space-y-6 py-4">
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative">
                                    <div
                                        className="w-20 h-20 rounded-full border-2 border-t-transparent animate-spin"
                                        style={{ borderColor: "#7C3AED40", borderTopColor: "#22D3EE" }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Logo size={32} />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <h2 className="font-bold text-lg">Generating STARK Proof</h2>
                                    <p className="text-sm mt-1" style={{ color: "#555" }}>This may take a few seconds...</p>
                                </div>
                            </div>

                            {/* Terminal log */}
                            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #1A1A1A", background: "#050505" }}>
                                <div className="flex items-center gap-2 px-4 py-2" style={{ background: "#0A0A0A", borderBottom: "1px solid #1A1A1A" }}>
                                    <div className="w-2 h-2 rounded-full" style={{ background: "#333" }} />
                                    <div className="w-2 h-2 rounded-full" style={{ background: "#333" }} />
                                    <div className="w-2 h-2 rounded-full" style={{ background: "#333" }} />
                                    <p className="text-xs ml-2" style={{ color: "#555", fontFamily: "var(--font-mono)" }}>zerovault-prover</p>
                                </div>
                                <div className="px-4 py-4 space-y-2" style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>
                                    {STAGES.map((s, i) => (
                                        <div
                                            key={s.label}
                                            className="flex items-center gap-2 transition-opacity duration-300"
                                            style={{ opacity: i <= stageIndex ? 1 : 0.2 }}
                                        >
                                            {i < stageIndex ? (
                                                <CheckCircle className="w-3 h-3 shrink-0" style={{ color: "#10B981" }} />
                                            ) : i === stageIndex ? (
                                                <Loader2 className="w-3 h-3 shrink-0 animate-spin" style={{ color: "#22D3EE" }} />
                                            ) : (
                                                <div className="w-3 h-3 shrink-0 rounded-full" style={{ background: "#222" }} />
                                            )}
                                            <span style={{ color: i < stageIndex ? "#10B981" : i === stageIndex ? "#22D3EE" : "#444" }}>
                                                {i < stageIndex ? "✓ " : ""}{s.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* === DONE STATE === */}
                    {stage === "done" && proof && renderProofResult(proof, verifyLink, copy, copied, handleGenerate)}

                    {/* === ERROR === */}
                    {stage === "error" && (
                        <div className="text-center py-8 space-y-4">
                            <AlertCircle className="w-12 h-12 mx-auto" style={{ color: "#EF4444" }} />
                            <p style={{ color: "#EF4444" }}>Proof generation failed. Please try again.</p>
                            <button onClick={() => setStage("idle")} style={{ color: "#888", fontSize: 14 }}>↩ Go back</button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// ── Shared result renderer ────────────────────────────────────────────────────
function renderProofResult(
    proof: ZKProof,
    verifyLink: string,
    copy: (t: string) => void,
    copied: boolean,
    regenerate: () => void
) {
    return (
        <div className="space-y-4">
            {/* Success banner */}
            <div
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}
            >
                <CheckCircle className="w-5 h-5 shrink-0" style={{ color: "#10B981" }} />
                <div>
                    <p className="text-sm font-semibold" style={{ color: "#10B981" }}>Proof Generated Successfully</p>
                    <p className="text-xs mt-0.5" style={{ color: "#555" }}>
                        Expires {new Date(proof.expiresAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Proof ID */}
            <div className="p-4 rounded-xl" style={{ background: "#0A0A0A", border: "1px solid #1A1A1A" }}>
                <p className="text-xs mb-2" style={{ color: "#555", letterSpacing: 1 }}>PROOF ID</p>
                <p className="font-mono text-xs truncate" style={{ color: "#A78BFA" }}>{proof.id}</p>
            </div>

            {/* Proof components (truncated) */}
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #1A1A1A" }}>
                <div className="px-4 py-3 flex items-center justify-between" style={{ background: "#0A0A0A", borderBottom: "1px solid #1A1A1A" }}>
                    <p className="text-xs font-semibold" style={{ color: "#555", letterSpacing: 1 }}>STARK PROOF COMPONENTS</p>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#10B98120", color: "#10B981" }}>VALID</span>
                </div>
                <div className="p-4 space-y-2 font-mono text-xs" style={{ color: "#666" }}>
                    <div><span style={{ color: "#7C3AED" }}>proof.a</span> → [{proof.proof.a[0].slice(0, 18)}...]</div>
                    <div><span style={{ color: "#7C3AED" }}>proof.b</span> → [[{proof.proof.b[0][0].slice(0, 14)}...], [...]]</div>
                    <div><span style={{ color: "#7C3AED" }}>proof.c</span> → [{proof.proof.c[0].slice(0, 18)}...]</div>
                    <div className="pt-1 border-t" style={{ borderColor: "#1A1A1A" }}>
                        <span style={{ color: "#22D3EE" }}>publicSignals</span> → [{proof.publicSignals[0].slice(0, 14)}..., {proof.publicSignals[1].slice(0, 10)}...]
                    </div>
                </div>
            </div>

            {/* Raw JSON Proof */}
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #1A1A1A" }}>
                <div className="px-4 py-3 flex items-center justify-between" style={{ background: "#0A0A0A", borderBottom: "1px solid #1A1A1A" }}>
                    <p className="text-xs font-semibold" style={{ color: "#22D3EE", letterSpacing: 1 }}>RAW STARK PROOF JSON</p>
                    <button
                        onClick={() => copy(JSON.stringify(proof, null, 2))}
                        className="text-xs font-medium transition hover:text-white"
                        style={{ color: "#888" }}
                    >
                        {copied ? "Copied!" : "Copy JSON"}
                    </button>
                </div>
                <div className="p-4" style={{ background: "#050505" }}>
                    <textarea
                        readOnly
                        value={JSON.stringify(proof, null, 2)}
                        className="w-full h-32 text-xs font-mono focus:outline-none"
                        style={{ background: "transparent", color: "#A78BFA", resize: "none" }}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
                <Link
                    href="/vault/verify"
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", fontSize: 14, color: "#FFF" }}
                >
                    <ExternalLink className="w-4 h-4" />
                    Open Verifier
                </Link>
                <button
                    onClick={regenerate}
                    className="px-4 py-3.5 rounded-xl font-medium transition hover:border-white/20"
                    style={{ border: "1px solid #333", color: "#666", fontSize: 14 }}
                >
                    Regenerate
                </button>
            </div>
        </div>
    );
}
