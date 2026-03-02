"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle, Copy, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ConnectButton } from "@/components/ConnectButton";
import {
    generateCommitment,
    generateSalt,
    saveCredential,
    type CredentialType,
} from "@/lib/credentials";

// ── Types ────────────────────────────────────────────────────────────────────
type Step = "form" | "hashing" | "success";

const CREDENTIAL_TYPES: CredentialType[] = [
    "Academic",
    "Identity",
    "Professional",
    "Membership",
];

const TYPE_ICONS: Record<CredentialType, string> = {
    Academic: "🎓",
    Identity: "🪪",
    Professional: "💼",
    Membership: "🌍",
};

const TYPE_COLORS: Record<CredentialType, string> = {
    Academic: "#7C3AED",
    Identity: "#06B6D4",
    Professional: "#10B981",
    Membership: "#F59E0B",
};

// ── Reusable input style ─────────────────────────────────────────────────────
const inputBase: React.CSSProperties = {
    width: "100%",
    background: "#0A0A0A",
    border: "1px solid #222",
    borderRadius: 10,
    padding: "12px 16px",
    color: "#FFF",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s",
};

// ── Component ────────────────────────────────────────────────────────────────
export default function AddCredentialPage() {
    const router = useRouter();

    const [step, setStep] = useState<Step>("form");
    const [form, setForm] = useState({
        title: "",
        type: "Academic" as CredentialType,
        issuer: "",
        issuedAt: "",
        description: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [commitment, setCommitment] = useState("");
    const [credId, setCredId] = useState("");
    const [copied, setCopied] = useState(false);

    // ── Validation ─────────────────────────────────────────────────────────────
    function validate() {
        const e: Record<string, string> = {};
        if (!form.title.trim()) e.title = "Credential title is required";
        if (!form.issuer.trim()) e.issuer = "Issuer is required";
        if (!form.issuedAt) e.issuedAt = "Issue date is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    // ── Submit ─────────────────────────────────────────────────────────────────
    async function handleSubmit() {
        if (!validate()) return;

        setStep("hashing");

        // Simulate processing time for UX
        await new Promise((r) => setTimeout(r, 800));
        const salt = generateSalt();
        const hash = await generateCommitment(form, salt);
        await new Promise((r) => setTimeout(r, 600));

        const id = crypto.randomUUID();
        const cred = {
            id,
            ...form,
            commitment: hash,
            salt,
            verified: false,
            createdAt: new Date().toISOString(),
        };

        saveCredential(cred);
        setCommitment(hash);
        setCredId(id);
        setStep("success");
    }

    // ── Copy commitment ────────────────────────────────────────────────────────
    function copyCommitment() {
        navigator.clipboard.writeText(commitment);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    // ── Render ─────────────────────────────────────────────────────────────────
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
                        <span>Vault</span>
                        <span style={{ color: "#333" }}>/</span>
                        <span style={{ color: "#FFF" }}>Add Credential</span>
                    </div>
                </div>
                <ConnectButton />
            </header>

            <main className="flex-1 flex items-start justify-center px-4 py-12">
                <div className="w-full max-w-xl">

                    {/* ── STEP INDICATOR ── */}
                    {step !== "success" && (
                        <div className="flex items-center gap-2 mb-10">
                            {(["form", "hashing"] as Step[]).map((s, i) => (
                                <div key={s} className="flex items-center gap-2">
                                    <div
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                                        style={{
                                            background: step === s || (s === "form" && step === "hashing") ? "#7C3AED" : "#111",
                                            color: step === s || (s === "form" && step === "hashing") ? "#FFF" : "#444",
                                            border: "1px solid",
                                            borderColor: step === s ? "#7C3AED" : "#222",
                                        }}
                                    >
                                        {s === "form" && step === "hashing" ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                                    </div>
                                    <span className="text-xs" style={{ color: step === s ? "#FFF" : "#444" }}>
                                        {s === "form" ? "Details" : "Generating Hash"}
                                    </span>
                                    {i < 1 && <div style={{ width: 32, height: 1, background: "#222", marginLeft: 4, marginRight: 4 }} />}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ═══════════════════════════════════════════════════════════
              STEP 1 — FORM
          ════════════════════════════════════════════════════════════ */}
                    {step === "form" && (
                        <div>
                            <div className="mb-8">
                                <Link href="/vault" className="flex items-center gap-1.5 mb-6 text-sm" style={{ color: "#555" }}>
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    Back to Vault
                                </Link>
                                <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px" }}>Add Credential</h1>
                                <p style={{ fontSize: 14, color: "#555", marginTop: 8 }}>
                                    Your raw data never leaves this browser. Only a cryptographic commitment will be stored on-chain.
                                </p>
                            </div>

                            <div className="space-y-5">
                                {/* Credential Type */}
                                <div>
                                    <label className="block text-xs font-medium mb-2" style={{ color: "#888", letterSpacing: 1 }}>CREDENTIAL TYPE</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {CREDENTIAL_TYPES.map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setForm((f) => ({ ...f, type: t }))}
                                                className="flex items-center gap-3 p-3 rounded-xl text-left transition"
                                                style={{
                                                    background: form.type === t ? `${TYPE_COLORS[t]}15` : "#0A0A0A",
                                                    border: `1px solid ${form.type === t ? TYPE_COLORS[t] + "80" : "#1A1A1A"}`,
                                                    color: form.type === t ? "#FFF" : "#555",
                                                }}
                                            >
                                                <span style={{ fontSize: 18 }}>{TYPE_ICONS[t]}</span>
                                                <span style={{ fontSize: 13, fontWeight: 600 }}>{t}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-xs font-medium mb-2" style={{ color: "#888", letterSpacing: 1 }}>CREDENTIAL TITLE</label>
                                    <input
                                        style={{
                                            ...inputBase,
                                            borderColor: errors.title ? "#EF4444" : form.title ? "#333" : "#1A1A1A",
                                        }}
                                        placeholder="e.g. Bachelor of Computer Science"
                                        value={form.title}
                                        onChange={(e) => {
                                            setForm((f) => ({ ...f, title: e.target.value }));
                                            if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
                                        }}
                                        onFocus={(e) => (e.target.style.borderColor = "#7C3AED")}
                                        onBlur={(e) => (e.target.style.borderColor = form.title ? "#333" : "#1A1A1A")}
                                    />
                                    {errors.title && <p className="text-xs mt-1.5" style={{ color: "#EF4444" }}>{errors.title}</p>}
                                </div>

                                {/* Issuer */}
                                <div>
                                    <label className="block text-xs font-medium mb-2" style={{ color: "#888", letterSpacing: 1 }}>ISSUER</label>
                                    <input
                                        style={{
                                            ...inputBase,
                                            borderColor: errors.issuer ? "#EF4444" : form.issuer ? "#333" : "#1A1A1A",
                                        }}
                                        placeholder="e.g. University of Technology"
                                        value={form.issuer}
                                        onChange={(e) => {
                                            setForm((f) => ({ ...f, issuer: e.target.value }));
                                            if (errors.issuer) setErrors((prev) => ({ ...prev, issuer: "" }));
                                        }}
                                        onFocus={(e) => (e.target.style.borderColor = "#7C3AED")}
                                        onBlur={(e) => (e.target.style.borderColor = form.issuer ? "#333" : "#1A1A1A")}
                                    />
                                    {errors.issuer && <p className="text-xs mt-1.5" style={{ color: "#EF4444" }}>{errors.issuer}</p>}
                                </div>

                                {/* Issue Date */}
                                <div>
                                    <label className="block text-xs font-medium mb-2" style={{ color: "#888", letterSpacing: 1 }}>ISSUE DATE</label>
                                    <input
                                        type="date"
                                        style={{
                                            ...inputBase,
                                            colorScheme: "dark",
                                            borderColor: errors.issuedAt ? "#EF4444" : form.issuedAt ? "#333" : "#1A1A1A",
                                        }}
                                        value={form.issuedAt}
                                        onChange={(e) => {
                                            setForm((f) => ({ ...f, issuedAt: e.target.value }));
                                            if (errors.issuedAt) setErrors((prev) => ({ ...prev, issuedAt: "" }));
                                        }}
                                        onFocus={(e) => (e.target.style.borderColor = "#7C3AED")}
                                        onBlur={(e) => (e.target.style.borderColor = form.issuedAt ? "#333" : "#1A1A1A")}
                                    />
                                    {errors.issuedAt && <p className="text-xs mt-1.5" style={{ color: "#EF4444" }}>{errors.issuedAt}</p>}
                                </div>

                                {/* Description (optional) */}
                                <div>
                                    <label className="block text-xs font-medium mb-2" style={{ color: "#888", letterSpacing: 1 }}>
                                        DESCRIPTION <span style={{ color: "#444", fontWeight: 400 }}>(optional)</span>
                                    </label>
                                    <textarea
                                        rows={3}
                                        style={{ ...inputBase, resize: "none", lineHeight: 1.6 }}
                                        placeholder="Any extra detail you want to encode into the commitment..."
                                        value={form.description}
                                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                        onFocus={(e) => (e.target.style.borderColor = "#7C3AED")}
                                        onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                                    />
                                </div>

                                {/* Privacy notice */}
                                <div
                                    className="flex items-start gap-3 p-4 rounded-xl"
                                    style={{ background: "#0A0A0A", border: "1px solid #1A1A1A" }}
                                >
                                    <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#22D3EE" }} />
                                    <p style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>
                                        This data is processed entirely in your browser. A Pedersen hash commitment will be derived and stored on Starknet. The raw values above are never transmitted.
                                    </p>
                                </div>

                                {/* Submit */}
                                <button
                                    onClick={handleSubmit}
                                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition hover:opacity-90"
                                    style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", fontSize: 15, color: "#FFF" }}
                                >
                                    Generate Commitment <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ═══════════════════════════════════════════════════════════
              STEP 2 — HASHING (loading)
          ════════════════════════════════════════════════════════════ */}
                    {step === "hashing" && (
                        <div className="flex flex-col items-center text-center gap-8 py-20">
                            {/* Animated ring */}
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
                                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Generating Commitment</h2>
                                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>Deriving Pedersen hash from your credential data...<br />Your raw data never leaves this device.</p>
                            </div>
                            <div
                                className="w-full p-4 rounded-xl space-y-2"
                                style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", fontFamily: "var(--font-mono)", fontSize: 11 }}
                            >
                                {[
                                    { label: "Serialising credential fields", delay: 0 },
                                    { label: "Adding random salt", delay: 400 },
                                    { label: "Computing Pedersen hash", delay: 900 },
                                ].map((line) => (
                                    <HashLine key={line.label} text={line.label} delay={line.delay} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ═══════════════════════════════════════════════════════════
              STEP 3 — SUCCESS
          ════════════════════════════════════════════════════════════ */}
                    {step === "success" && (
                        <div className="flex flex-col items-center text-center gap-8">
                            {/* Icon */}
                            <div
                                className="w-20 h-20 rounded-full flex items-center justify-center"
                                style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}
                            >
                                <CheckCircle className="w-9 h-9" style={{ color: "#10B981" }} />
                            </div>

                            <div>
                                <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px", marginBottom: 8 }}>Credential Stored!</h1>
                                <p style={{ fontSize: 14, color: "#555" }}>
                                    Your commitment has been derived and saved locally.<br />It&apos;s ready to be anchored on Starknet.
                                </p>
                            </div>

                            {/* Commitment hash */}
                            <div className="w-full rounded-2xl overflow-hidden" style={{ border: "1px solid #1A1A1A" }}>
                                <div className="px-4 py-3" style={{ background: "#0A0A0A", borderBottom: "1px solid #1A1A1A" }}>
                                    <p style={{ fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: 2 }}>PEDERSEN COMMITMENT</p>
                                </div>
                                <div className="px-4 py-4 flex items-center justify-between gap-3">
                                    <p
                                        className="font-mono text-sm truncate"
                                        style={{ color: "#22D3EE" }}
                                    >
                                        {commitment}
                                    </p>
                                    <button
                                        onClick={copyCommitment}
                                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                                        style={{
                                            background: copied ? "#10B98120" : "#1A1A1A",
                                            color: copied ? "#10B981" : "#888",
                                            border: "1px solid",
                                            borderColor: copied ? "#10B98140" : "#333",
                                        }}
                                    >
                                        <Copy className="w-3 h-3" />
                                        {copied ? "Copied!" : "Copy"}
                                    </button>
                                </div>
                            </div>

                            {/* What happens next */}
                            <div
                                className="w-full p-5 rounded-2xl text-left space-y-3"
                                style={{ background: "#0A0A0A", border: "1px solid #1A1A1A" }}
                            >
                                <p style={{ fontSize: 12, fontWeight: 600, color: "#555", letterSpacing: 1 }}>NEXT STEPS</p>
                                {[
                                    { icon: "⛓️", label: "Anchor on-chain", desc: "Store this commitment on Starknet Sepolia (coming soon)" },
                                    { icon: "🔒", label: "Generate a ZK proof", desc: "Prove ownership without revealing the raw data" },
                                    { icon: "🔗", label: "Share a verify link", desc: "Let anyone verify your credential with one click" },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-start gap-3">
                                        <span style={{ fontSize: 16 }}>{item.icon}</span>
                                        <div>
                                            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{item.label}</p>
                                            <p style={{ fontSize: 12, color: "#555" }}>{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 w-full">
                                <Link
                                    href="/vault"
                                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition hover:opacity-90"
                                    style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", fontSize: 14, color: "#FFF" }}
                                >
                                    View My Vault
                                </Link>
                                <button
                                    onClick={() => {
                                        setStep("form");
                                        setForm({ title: "", type: "Academic", issuer: "", issuedAt: "", description: "" });
                                        setErrors({});
                                    }}
                                    className="flex-1 py-3.5 rounded-xl font-medium transition hover:border-white/30"
                                    style={{ border: "1px solid #333", color: "#AAA", fontSize: 14 }}
                                >
                                    Add Another
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// ── Animated terminal line for hashing step ─────────────────────────────────
function HashLine({ text, delay }: { text: string; delay: number }) {
    const [visible, setVisible] = useState(false);
    if (typeof window !== "undefined") {
        setTimeout(() => setVisible(true), delay);
    }
    return (
        <div
            className="flex items-center gap-2 transition-opacity duration-300"
            style={{ opacity: visible ? 1 : 0, color: visible ? "#22D3EE" : "transparent" }}
        >
            <Loader2 className="w-3 h-3 animate-spin shrink-0" style={{ color: "#22D3EE" }} />
            <span style={{ color: "#22D3EE" }}>&nbsp; ✓&nbsp;</span>
            <span style={{ color: "#666" }}>{text}</span>
        </div>
    );
}
