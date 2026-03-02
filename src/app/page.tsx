"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, Lock, ShieldCheck, CheckCircle2, User, Globe, Database, CheckCircle } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ConnectButton } from "@/components/ConnectButton";
import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #1A1A1A" }}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-5 text-left transition hover:opacity-80"
      >
        <span style={{ fontSize: 14, fontWeight: 500, color: "#CCCCCC" }}>{q}</span>
        <ChevronDown
          className="w-4 h-4 shrink-0 ml-4 transition-transform duration-300"
          style={{ color: "#555", transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>
      {open && <p className="pb-5" style={{ fontSize: 13, lineHeight: 1.7, color: "#666" }}>{a}</p>}
    </div>
  );
}

function RevealDiv({
  children,
  className = "",
  style = {},
  delay = 0,
  direction = "up" as "up" | "down" | "left" | "right" | "fade",
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
}) {
  const ref = useScrollReveal<HTMLDivElement>({ delay, direction });
  return <div ref={ref} className={className} style={style}>{children}</div>;
}

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "#000" }}>

      {/* ──── HERO ──── */}
      <section className="relative overflow-hidden" style={{ minHeight: "100vh" }}>

        {/* Mesh gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Purple orb top-right */}
          <div className="absolute" style={{
            top: "-10%", right: "-5%", width: 600, height: 600,
            background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
          }} />
          {/* Cyan orb center-left */}
          <div className="absolute" style={{
            top: "30%", left: "-10%", width: 500, height: 500,
            background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)",
          }} />
          {/* Subtle grid */}
          <div className="absolute inset-0" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-20">
          {/* Nav */}
          <nav className="flex items-center justify-between py-6">
            <div className="flex items-center gap-2.5">
              <Logo size={32} />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 700, letterSpacing: "-0.5px" }}>ZeroVault</span>
            </div>
            <div className="flex items-center gap-4 sm:gap-8">
              {["How it works", "Architecture", "Use cases", "FAQ"].map(l => (
                <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                  style={{ fontSize: 13, fontWeight: 500, color: "#888", transition: "color .15s" }}
                  className="hidden md:block hover:!text-white">{l}</a>
              ))}
              <ConnectButton />
            </div>
          </nav>

          {/* Hero content */}
          <div
            className="flex flex-col items-center text-center pt-28 pb-20 gap-8 animate-hero"
          >
            {/* Animated badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ border: "1px solid #2A2A2A", background: "rgba(10,10,10,0.8)", backdropFilter: "blur(8px)" }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#22D3EE" }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#22D3EE" }} />
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500, color: "#888" }}>
                Privacy Track · Re{"{define}"} Hackathon 2026
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h1 style={{
                fontFamily: "var(--font-sans)", fontSize: "clamp(48px,8vw,84px)", fontWeight: 800,
                letterSpacing: "-3px", lineHeight: 1, color: "#FFF",
              }}>
                Prove credentials
              </h1>
              <h1 className="text-gradient-white" style={{
                fontFamily: "var(--font-sans)", fontSize: "clamp(48px,8vw,84px)", fontWeight: 800,
                letterSpacing: "-3px", lineHeight: 1,
              }}>
                without revealing data
              </h1>
            </div>

            <p style={{ fontSize: "clamp(14px,2vw,17px)", lineHeight: 1.7, color: "#666", maxWidth: 520, fontWeight: 400 }}>
              ZeroVault stores credential commitments on Starknet.
              Generate ZK proofs. Verify on-chain. Your data never leaves the browser.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/vault"
                className="flex items-center gap-2 px-7 py-3.5 rounded-full transition hover:scale-105 hover:shadow-lg"
                style={{ background: "#FFF", color: "#000", fontSize: 14, fontWeight: 600, transition: "all .2s" }}>
                Open Vault <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a href="#how-it-works"
                className="flex items-center gap-2 px-7 py-3.5 rounded-full transition"
                style={{ border: "1px solid #2A2A2A", color: "#AAA", fontSize: 14, fontWeight: 500, transition: "border-color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#555")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#2A2A2A")}
              >
                How it works
              </a>
            </div>

            {/* Terminal block */}
            <RevealDiv delay={200} direction="up"
              className="rounded-xl overflow-hidden mt-2 w-full"
              style={{
                border: "1px solid #1E1E1E", background: "#050505", maxWidth: 540,
                boxShadow: "0 0 40px rgba(34,211,238,0.05), 0 20px 60px rgba(0,0,0,0.5)",
              }}>
              {/* Terminal chrome */}
              <div className="flex items-center justify-between px-4 py-2.5" style={{ background: "#0C0C0C", borderBottom: "1px solid #1A1A1A" }}>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F56" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#FFBD2E" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#27C93F" }} />
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#444" }}>zerovault-prover</span>
                <div style={{ width: 48 }} />
              </div>
              <div className="px-5 py-5 space-y-2" style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                <p style={{ color: "#555" }}>$ zerovault commit --credential diploma.json</p>
                <p style={{ color: "#22D3EE" }}>&nbsp; ✓&nbsp; Pedersen hash generated</p>
                <p style={{ color: "#22D3EE" }}>&nbsp; ✓&nbsp; Commitment stored on Starknet Sepolia</p>
                <p style={{ color: "#10B981" }}>&nbsp; ✓&nbsp; Proof ID: 0x7c3a...ed42</p>
                <p style={{ color: "#FFF" }}>&nbsp; →&nbsp; Shareable verify link ready<span className="cursor" /></p>
              </div>
            </RevealDiv>
          </div>
        </div>
      </section>

      {/* ──── METRICS STRIP ──── */}
      <section style={{ borderTop: "1px solid #111", borderBottom: "1px solid #111", background: "#030303" }}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-20 py-12 grid grid-cols-2 md:grid-cols-4 text-center gap-8 md:gap-0">
          {[
            { value: "0", label: "Data leaks" },
            { value: "100%", label: "Client-side" },
            { value: "STARK", label: "Proof system" },
            { value: "ZK", label: "Verified", accent: true },
          ].map((m, i) => (
            <RevealDiv key={m.label} delay={i * 80} direction="up">
              <p style={{
                fontFamily: "var(--font-sans)", fontSize: "clamp(32px,5vw,52px)", fontWeight: 800,
                letterSpacing: "-2px",
                color: m.accent ? "#22D3EE" : "#FFF",
              }}>{m.value}</p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500, color: "#444", letterSpacing: 2, marginTop: 6 }}>{m.label}</p>
            </RevealDiv>
          ))}
        </div>
      </section>

      {/* ──── HOW IT WORKS ──── */}
      <section id="how-it-works" className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-20 py-24">
        <RevealDiv className="text-center mb-14" direction="up">
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: 3, marginBottom: 16 }}>HOW IT WORKS</p>
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, letterSpacing: "-2px" }}>Three steps to provable privacy</h2>
        </RevealDiv>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { num: "01", title: "Store", icon: <Lock size={32} color="#7C3AED" />, desc: "Add credentials locally. Pedersen hash commitment stored on Starknet. Raw data stays in your browser.", accent: "#7C3AED" },
            { num: "02", title: "Prove", icon: <ShieldCheck size={32} color="#22D3EE" />, desc: "Generate a zero-knowledge STARK proof. Cryptographic receipt proves ownership without revealing underlying data.", accent: "#22D3EE" },
            { num: "03", title: "Verify", icon: <CheckCircle2 size={32} color="#10B981" />, desc: "Share a one-click link. Anyone can verify your proof on-chain, instantly. No personal data exposed. Ever.", accent: "#10B981" },
          ].map((s, i) => (
            <RevealDiv key={s.num} delay={i * 120} direction="up"
              className="card-hover flex flex-col justify-between rounded-2xl p-8"
              style={{ background: "#080808", border: "1px solid #1A1A1A", minHeight: 300 }}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>{s.icon}</div>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 64, fontWeight: 800, color: "#0D0D0D", letterSpacing: "-3px", lineHeight: 1 }}>{s.num}</span>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, color: s.accent }}>{s.title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: "#666" }}>{s.desc}</p>
              </div>
            </RevealDiv>
          ))}
        </div>
      </section>

      {/* ──── ARCHITECTURE FLOW ──── */}
      <section id="architecture" style={{ background: "#030303", borderTop: "1px solid #111", borderBottom: "1px solid #111" }}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-20 py-24">
          <RevealDiv className="text-center mb-14" direction="up">
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, color: "#22D3EE", letterSpacing: 3, marginBottom: 16 }}>ARCHITECTURE</p>
            <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, letterSpacing: "-2px" }}>Your data never touches the chain</h2>
            <p style={{ fontSize: 15, color: "#555", marginTop: 12 }}>Only cryptographic commitments and proofs are stored on-chain.</p>
          </RevealDiv>
          <div className="flex flex-wrap items-center justify-center gap-2 my-8">
            {[
              { label: "User", desc: "Adds credential\nlocally", icon: <User size={24} color="#FFF" />, bg: "#0A0A0A", border: "#222", textCol: "#888" },
              { label: "Browser", desc: "Hash + encrypt\nclient-side", icon: <Globe size={24} color="#22D3EE" />, bg: "#0A0A0A", border: "#1A3A3E", textCol: "#22D3EE" },
              { label: "Starknet", desc: "Stores commitment\non-chain", icon: <Database size={24} color="#22D3EE" />, bg: "#22D3EE20", border: "#22D3EE40", textCol: "#22D3EE" },
              { label: "Verifier", desc: "Checks proof,\nsees zero data", icon: <CheckCircle size={24} color="#10B981" />, bg: "#10B98115", border: "#10B98140", textCol: "#10B981" },
            ].map((node, i) => (
              <RevealDiv key={node.label} delay={i * 100} direction="up" className="flex items-center">
                <div className="flex flex-col items-center gap-3" style={{ width: 130 }}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: node.bg, border: `1px solid ${node.border}` }}>
                    {node.icon}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: node.textCol }}>{node.label}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.5 }}>{node.desc}</span>
                </div>
                {i < 3 && (
                  <div className="flex items-center mx-1">
                    <div style={{ width: 24, height: 1, background: "linear-gradient(90deg, #333, #22D3EE44)" }} />
                    <span style={{ color: "#22D3EE", fontSize: 14, opacity: 0.5 }}>›</span>
                    <div style={{ width: 24, height: 1, background: "linear-gradient(90deg, #22D3EE44, #333)" }} />
                  </div>
                )}
              </RevealDiv>
            ))}
          </div>

          {/* Tech stack pills */}
          <RevealDiv className="flex flex-wrap justify-center gap-2 mt-10" direction="up" delay={200}>
            {["Cairo 2.8 · Starknet", "Pedersen Hash", "STARK Proofs", "Next.js 16", "starknet.js", "LocalStorage encrypted"].map(tech => (
              <span key={tech} className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: "#0A0A0A", border: "1px solid #1E1E1E", color: "#666", fontFamily: "var(--font-mono)" }}>
                {tech}
              </span>
            ))}
          </RevealDiv>
        </div>
      </section>

      {/* ──── USE CASES ──── */}
      <section id="use-cases" className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-20 py-24">
        <RevealDiv className="text-center mb-14" direction="up">
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: 3, marginBottom: 16 }}>USE CASES</p>
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, letterSpacing: "-2px" }}>Real privacy. Real utility.</h2>
        </RevealDiv>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { emoji: "🎓", title: "Academic Credentials", desc: "Prove you hold a degree without sharing your institution, GPA, or graduation date.", color: "#7C3AED" },
            { emoji: "🔞", title: "Age Verification", desc: "Prove you're over 18 on any platform without a government ID leaving your hands.", color: "#22D3EE" },
            { emoji: "💼", title: "Employment Status", desc: "Verify employment or income without sharing your employer or salary details.", color: "#10B981" },
            { emoji: "🌍", title: "DAO Membership", desc: "Prove you're a member of a DAO or whitelist without doxing your wallet history.", color: "#F59E0B" },
          ].map((uc, i) => (
            <RevealDiv key={uc.title} delay={i * 80} direction="up"
              className="card-hover flex gap-5 p-7 rounded-2xl"
              style={{ background: "#080808", border: "1px solid #1A1A1A" }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${uc.color}15`, border: `1px solid ${uc.color}30` }}>
                <span style={{ fontSize: 22 }}>{uc.emoji}</span>
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{uc.title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: "#555" }}>{uc.desc}</p>
              </div>
            </RevealDiv>
          ))}
        </div>
      </section>

      {/* ──── FAQ ──── */}
      <section id="faq" className="max-w-[640px] mx-auto px-4 sm:px-8 py-24">
        <RevealDiv className="text-center mb-12" direction="up">
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: 3, marginBottom: 16 }}>FAQ</p>
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(24px,4vw,40px)", fontWeight: 800, letterSpacing: "-1.5px" }}>Frequently Asked Questions</h2>
        </RevealDiv>
        <RevealDiv direction="up" delay={100}>
          <FAQItem q="Do you store my raw data on-chain?" a="Never. Only a cryptographic hash (Pedersen commitment) of your credential + a secret salt goes on-chain. Your actual data stays in your browser's local storage and is never transmitted anywhere." />
          <FAQItem q="What happens if I lose my device?" a="Your on-chain commitments remain on Starknet forever. However, you'd need to re-add the credential data locally and re-generate proofs. We plan to support encrypted cloud backups in a future version." />
          <FAQItem q="Which wallets are supported?" a="ZeroVault supports all Starknet-compatible wallets including ArgentX, Braavos, OKX Wallet, and any other wallet that implements the Starknet wallet standard. Simply install any supported wallet and it will be detected automatically." />
          <FAQItem q="Can a verifier see my personal data?" a="No. Verifiers only see a green checkmark confirming the proof is valid. They learn nothing about the underlying data — that's the entire point of zero-knowledge proofs." />
        </RevealDiv>
      </section>

      {/* ──── CTA ──── */}
      <section style={{ borderTop: "1px solid #111", background: "#030303" }}>
        <RevealDiv
          className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-20 py-28 flex flex-col items-center text-center gap-8"
          direction="up"
        >
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(32px,5vw,56px)", fontWeight: 800, letterSpacing: "-2px" }}>
            Start proving,{" "}
            <span className="text-gradient">not sharing.</span>
          </h2>
          <p style={{ fontSize: 16, color: "#555", maxWidth: 400 }}>
            Connect your Starknet wallet. Store credentials. Generate proofs. Verify on-chain.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/vault"
              className="flex items-center gap-2 px-8 py-4 rounded-full transition hover:opacity-90 hover:scale-105"
              style={{ background: "#FFF", color: "#000", fontSize: 15, fontWeight: 600, transition: "all .2s" }}>
              Launch App <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 rounded-full transition"
              style={{ border: "1px solid #2A2A2A", color: "#AAA", fontSize: 15, fontWeight: 500 }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#555")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#2A2A2A")}
            >
              GitHub
            </a>
          </div>
        </RevealDiv>
      </section>

      {/* ──── FOOTER ──── */}
      <footer className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 lg:px-20 py-8 gap-4 sm:gap-0" style={{ borderTop: "1px solid #111" }}>
        <div className="flex items-center gap-2">
          <Logo size={20} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#888" }}>ZeroVault</span>
          <span style={{ color: "#2A2A2A", margin: "0 4px" }}>·</span>
          <span style={{ fontSize: 12, color: "#444" }}>Re{"{define}"} Hackathon 2026</span>
        </div>
        <div className="flex gap-5">
          {["Privacy Track", "Starknet", "Cairo 2.8"].map(t => (
            <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500, color: "#444" }}>{t}</span>
          ))}
        </div>
      </footer>

    </div>
  );
}
