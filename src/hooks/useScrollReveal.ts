"use client";

import { useEffect, useRef, RefObject } from "react";

type ScrollRevealOptions = {
    threshold?: number;
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "fade";
};

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
    options: ScrollRevealOptions = {}
): RefObject<T> {
    const { threshold = 0.15, delay = 0, direction = "up" } = options;
    const ref = useRef<T>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Initial hidden state
        const startTransform: Record<string, string> = {
            up: "translateY(32px)",
            down: "translateY(-32px)",
            left: "translateX(-32px)",
            right: "translateX(32px)",
            fade: "translateY(0px)",
        };

        el.style.opacity = "0";
        el.style.transform = startTransform[direction];
        el.style.transition = `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.style.opacity = "1";
                    el.style.transform = "translateY(0) translateX(0)";
                    observer.unobserve(el);
                }
            },
            { threshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, delay, direction]);

    return ref;
}
