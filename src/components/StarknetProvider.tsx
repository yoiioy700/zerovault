"use client";

import { ReactNode } from "react";
import { sepolia, mainnet } from "@starknet-react/chains";
import {
    StarknetConfig,
    argent,
    braavos,
    useInjectedConnectors,
    jsonRpcProvider,
} from "@starknet-react/core";

const provider = jsonRpcProvider({
    rpc: (chain) => ({
        nodeUrl:
            chain.id === sepolia.id
                ? "https://starknet-sepolia.public.blastapi.io/rpc/v0_7"
                : "https://starknet-mainnet.public.blastapi.io/rpc/v0_7",
    }),
});

// Inner component needed because useInjectedConnectors is a hook
function StarknetConfigWithConnectors({ children }: { children: ReactNode }) {
    const { connectors } = useInjectedConnectors({
        // Recommended: show these wallets first even if not installed
        recommended: [argent(), braavos()],
        // Discover ALL other injected wallets (OKX, Keplr-Starknet, etc.)
        includeRecommended: "onlyIfNoConnectors",
        order: "random",
    });

    return (
        <StarknetConfig
            chains={[sepolia, mainnet]}
            provider={provider}
            connectors={connectors}
        >
            {children}
        </StarknetConfig>
    );
}

export function StarknetProvider({ children }: { children: ReactNode }) {
    return (
        <StarknetConfigWithConnectors>
            {children}
        </StarknetConfigWithConnectors>
    );
}
