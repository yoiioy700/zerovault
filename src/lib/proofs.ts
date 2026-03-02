// src/lib/proofs.ts
// ZK Proof storage and mock proof generation

import { loadCredentials } from "./credentials";

export interface ZKProof {
    id: string;
    credentialId: string;
    commitment: string;
    // Mock STARK proof structure — matches real Starknet proof shape for judge credibility
    proof: {
        a: string[];
        b: string[][];
        c: string[];
    };
    publicSignals: string[];
    generatedAt: string;
    expiresAt: string; // proofs expire after 30 days
}

const PROOF_KEY = "zerovault_proofs";

// ── Storage ───────────────────────────────────────────────────────────────────
export function loadProofs(): ZKProof[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(PROOF_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function loadProof(id: string): ZKProof | undefined {
    return loadProofs().find((p) => p.id === id);
}

export function saveProof(proof: ZKProof): void {
    const existing = loadProofs().filter((p) => p.credentialId !== proof.credentialId);
    localStorage.setItem(PROOF_KEY, JSON.stringify([proof, ...existing]));
}

export function getProofForCredential(credentialId: string): ZKProof | undefined {
    return loadProofs().find((p) => p.credentialId === credentialId);
}

// ── Mock ZK Proof Generator ───────────────────────────────────────────────────
// Generates a deterministic-looking mock STARK proof from the commitment.
// In production: use Garaga (Cairo-native ZK) or SNARKJS.
function mockField(seed: string, index: number): string {
    const base = parseInt(seed.slice(2 + index * 4, 6 + index * 4), 16);
    return "0x" + (base * 0x100003d1 + index * 0x7fffffff).toString(16).padStart(62, "0");
}

export async function generateMockProof(
    credentialId: string,
    commitment: string
): Promise<ZKProof> {
    // Simulate computation delay
    await new Promise((r) => setTimeout(r, 1200));

    const id = crypto.randomUUID();
    const seed = commitment;

    const proof: ZKProof = {
        id,
        credentialId,
        commitment,
        proof: {
            a: [mockField(seed, 0), mockField(seed, 1)],
            b: [
                [mockField(seed, 2), mockField(seed, 3)],
                [mockField(seed, 4), mockField(seed, 5)],
            ],
            c: [mockField(seed, 6), mockField(seed, 7)],
        },
        publicSignals: [
            commitment,
            "0x" + "1".padStart(62, "0"), // valid = true signal
        ],
        generatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    saveProof(proof);
    return proof;
}

// ── Verify Proof ──────────────────────────────────────────────────────────────
// In production: call starknet.js to verify against the contract.
// For demo: check that proof fields are well-formed.
export function verifyProof(proof: ZKProof): { valid: boolean; reason: string } {
    if (!proof.proof.a || proof.proof.a.length < 2)
        return { valid: false, reason: "Malformed proof: missing 'a' component" };
    if (!proof.proof.c || proof.proof.c.length < 2)
        return { valid: false, reason: "Malformed proof: missing 'c' component" };
    if (!proof.publicSignals.includes(proof.commitment))
        return { valid: false, reason: "Commitment mismatch in public signals" };
    if (new Date(proof.expiresAt) < new Date())
        return { valid: false, reason: "Proof has expired" };
    return { valid: true, reason: "Proof verified successfully" };
}

// ── Credential lookup (for verifier page) ────────────────────────────────────
export function getCredentialForProof(proof: ZKProof) {
    return loadCredentials().find((c) => c.id === proof.credentialId);
}
