"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

const StarknetProvider = dynamic(
    () => import("@/components/StarknetProvider").then(m => m.StarknetProvider),
    { ssr: false }
);

export function Providers({ children }: { children: ReactNode }) {
    return <StarknetProvider>{children}</StarknetProvider>;
}
