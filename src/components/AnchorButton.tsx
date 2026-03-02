"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Loader2, CheckCircle } from "lucide-react";
import { useZeroVaultContract } from "@/hooks/useZeroVaultContract";
import { loadCredentials, saveCredential } from "@/lib/credentials";

interface AnchorButtonProps {
    credentialId: string;
    commitment: string;
    isAnchored: boolean;
    onAnchored?: () => void;
}

export function AnchorButton({ credentialId, commitment, isAnchored, onAnchored }: AnchorButtonProps) {
    const { anchorCommitment, anchoring, anchorTx, anchorError } = useZeroVaultContract();
    const [done, setDone] = useState(isAnchored);
    const [localTx, setLocalTx] = useState<string | null>(null);

    async function handleAnchor() {
        const txHash = await anchorCommitment(commitment);
        if (txHash) {
            // Mark credential as verified in localStorage
            const creds = loadCredentials();
            const cred = creds.find((c) => c.id === credentialId);
            if (cred) {
                saveCredential({ ...cred, verified: true });
            }
            setLocalTx(txHash);
            setDone(true);
            onAnchored?.();
        }
    }

    if (done) {
        return (
            <div className="flex flex-col gap-1">
                <span
                    className="flex items-center gap-1.5 text-xs font-medium"
                    style={{ color: "#10B981" }}
                >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Anchored on Starknet
                </span>
                {(localTx ?? anchorTx) && (
                    <a
                        href={`https://sepolia.starkscan.co/tx/${localTx ?? anchorTx}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs"
                        style={{ color: "#555" }}
                    >
                        <ExternalLink className="w-3 h-3" />
                        {(localTx ?? anchorTx)!.slice(0, 14)}...
                    </a>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1">
            <button
                onClick={handleAnchor}
                disabled={anchoring}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition"
                style={{
                    background: "#7C3AED20",
                    color: "#A78BFA",
                    border: "1px solid #7C3AED40",
                    opacity: anchoring ? 0.7 : 1,
                }}
            >
                {anchoring ? (
                    <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Anchoring...
                    </>
                ) : (
                    <>
                        ⛓️ Anchor on Starknet
                    </>
                )}
            </button>
            {anchorError && (
                <p className="text-xs" style={{ color: "#EF4444" }}>
                    {anchorError.length > 60 ? anchorError.slice(0, 60) + "..." : anchorError}
                </p>
            )}
        </div>
    );
}
