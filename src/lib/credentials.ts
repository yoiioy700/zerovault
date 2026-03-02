// src/lib/credentials.ts
// Client-side credential storage using localStorage + simulated Pedersen hash

export type CredentialType = "Academic" | "Identity" | "Professional" | "Membership";

export interface Credential {
    id: string;
    title: string;
    type: CredentialType;
    issuer: string;
    issuedAt: string;
    description: string;
    commitment: string; // simulated Pedersen hash as hex
    salt: string;       // secret random salt (never leaves browser)
    verified: boolean;
    createdAt: string;
}

const STORAGE_KEY = "zerovault_credentials";

// ─── Simulated Pedersen Hash ─────────────────────────────────────────────────
// In production: use garaga / starknet.js Pedersen hash natively.
// For the demo/hackathon: use a SHA-256 based commitment (same security model).
async function sha256Hex(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const buffer = await crypto.subtle.digest("SHA-256", encoder.encode(data));
    return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

export async function generateCommitment(credential: {
    title: string;
    issuer: string;
    issuedAt: string;
    description: string;
}, salt: string): Promise<string> {
    const input = JSON.stringify({ ...credential, salt });
    const hash = await sha256Hex(input);
    return "0x" + hash.slice(0, 62); // truncate to look like a Starknet felt
}

export function generateSalt(): string {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ─── Storage ─────────────────────────────────────────────────────────────────
export function loadCredentials(): Credential[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function saveCredential(cred: Credential): void {
    const existing = loadCredentials();
    const existingIndex = existing.findIndex((c) => c.id === cred.id);
    let updated;
    if (existingIndex >= 0) {
        updated = [...existing];
        updated[existingIndex] = cred;
    } else {
        updated = [cred, ...existing];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deleteCredential(id: string): void {
    const existing = loadCredentials();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.filter((c) => c.id !== id)));
}
