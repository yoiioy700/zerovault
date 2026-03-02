import React from "react";

/**
 * ZeroVault Logo
 * 
 * Design inspiration:
 *  - Image 1: Geometric modular bold style — hexagonal container, thick solid forms, rotational symmetry
 *  - Image 2: Two crossing bracket "wing" arms on deep purple bg, meeting at a center V-chevron accent
 * 
 * Result: Two angular bracket arms (white→purple gradient) that cross and 
 * converge at a cyan V-diamond in center. Hexagonal ring as subtle outer frame.
 * Deep purple background matching image 2's aesthetic exactly.
 */
export function Logo({
    className = "",
    style = {},
    size,
}: {
    className?: string;
    style?: React.CSSProperties;
    size?: number;
}) {
    const sizeProps = size ? { width: size, height: size } : {};

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className={className}
            style={style}
            fill="none"
            {...sizeProps}
        >
            <defs>
                {/* Deep purple bg — mirrors image 2 */}
                <linearGradient id="zv-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0D0820" />
                    <stop offset="100%" stopColor="#130A2E" />
                </linearGradient>

                {/* Wing arm gradient: white top → soft purple-white bottom (image 2 arms) */}
                <linearGradient id="zv-arm-l" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#F0ECFF" />
                    <stop offset="100%" stopColor="#B8A6F0" />
                </linearGradient>
                <linearGradient id="zv-arm-r" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F0ECFF" />
                    <stop offset="100%" stopColor="#B8A6F0" />
                </linearGradient>

                {/* Cyan accent */}
                <linearGradient id="zv-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#67E8F9" />
                    <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>

                {/* Purple accent for bottom base */}
                <linearGradient id="zv-base" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity="0" />
                    <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* ── Background: rounded square ── */}
            <rect width="100" height="100" rx="22" fill="url(#zv-bg)" />

            {/* ── Hexagonal outer ring (image 1 modular influence) ── */}
            <polygon
                points="50,6 92,28 92,72 50,94 8,72 8,28"
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="1.5"
            />

            {/* ── LEFT WING ARM ──
           Bracket that rises from bottom-left, 
           tapers inward toward center-top meeting point.
           Mirrors image 2's left trident/wing shape.
      ── */}
            <path
                d="M14,78 L14,62 L43,23 L53,23 L53,34 L28,78 Z"
                fill="url(#zv-arm-l)"
            />

            {/* ── RIGHT WING ARM ──
           Mirror of left arm — bracket from bottom-right 
           tapering up to center-top meeting point.
      ── */}
            <path
                d="M86,78 L86,62 L57,23 L47,23 L47,34 L72,78 Z"
                fill="url(#zv-arm-r)"
            />

            {/* ── CYAN V-DIAMOND ACCENT ──
           The critical focal point where both arms converge at top — 
           based on the red/pink diamond accent in image 2,
           replaced with our ZeroVault cyan.
      ── */}
            <path
                d="M47,23 L50,36 L53,23 Z"
                fill="url(#zv-cyan)"
            />
            {/* Small square accent rotated 45deg at the V tip */}
            <rect
                x="46.5"
                y="18.5"
                width="7"
                height="7"
                rx="1"
                transform="rotate(45 50 22)"
                fill="url(#zv-cyan)"
            />

            {/* ── BASE GLOW BAR ──
           Purple gradient line at bottom — grounds the icon,
           like the subtle platform in image 2.
      ── */}
            <rect x="14" y="76" width="72" height="4" rx="2" fill="url(#zv-base)" />
        </svg>
    );
}
