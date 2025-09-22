// hooks/use-collapse-transition.ts
"use client";

import * as React from "react";

export type CollapseTransitionOptions = {
    initialExpanded?: boolean;
    getCollapsedHeight?: (element: HTMLElement) => number; // ví dụ: N_dòng * line-height
    animationDurationMs?: number;
    animationEasing?: string;
    respectReducedMotion?: boolean;
    capCollapsedAtContentHeight?: boolean; // NEW: không bao giờ cao hơn nội dung thật, mặc định true
    recomputeWhen?: React.DependencyList;
};

export type CollapseTransitionApi = {
    containerReference: React.RefObject<HTMLDivElement | null>;
    isExpanded: boolean;
    setExpanded: (nextExpanded: boolean) => void;
    toggle: () => void;
    recomputeIfCollapsed: () => void;
};

export function useCollapseTransition(options?: CollapseTransitionOptions): CollapseTransitionApi {
    const {
        initialExpanded = false,
        getCollapsedHeight,
        animationDurationMs = 280,
        animationEasing = "ease",
        respectReducedMotion = true,
        capCollapsedAtContentHeight = true,
        recomputeWhen = [],
    } = options || {};

    const containerReference = React.useRef<HTMLDivElement>(null);
    const expandedReference = React.useRef<boolean>(initialExpanded);
    const [expandedState, setExpandedState] = React.useState<boolean>(initialExpanded);

    const prefersReducedMotion =
        typeof window !== "undefined" && respectReducedMotion && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const readBoxPixelHeight = (element: HTMLElement) => element.getBoundingClientRect().height;
    const readContentPixelHeight = (element: HTMLElement) => element.scrollHeight;

    const resolveCollapsedPixelHeight = React.useCallback(
        (element: HTMLElement): number => {
            const proposed = typeof getCollapsedHeight === "function" ? getCollapsedHeight(element) : 0;
            const collapsedPixel = Number.isFinite(proposed) ? Math.max(0, proposed) : 0;
            if (!capCollapsedAtContentHeight) return collapsedPixel;
            const contentPixel = readContentPixelHeight(element);
            return Math.min(collapsedPixel, contentPixel);
        },
        [getCollapsedHeight, capCollapsedAtContentHeight]
    );

    const animate = React.useCallback(
        (element: HTMLElement, fromPixel: number, toPixel: number, onFinished?: () => void) => {
            if (prefersReducedMotion) {
                element.style.height = toPixel === Infinity ? "auto" : `${toPixel}px`;
                onFinished?.();
                return;
            }
            element.classList.add("et-collapse--animating");
            element.style.transition = `height ${animationDurationMs}ms ${animationEasing}`;
            element.style.height = `${fromPixel}px`;

            requestAnimationFrame(() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                element.offsetHeight;
                requestAnimationFrame(() => {
                    element.style.height = toPixel === Infinity ? `${readContentPixelHeight(element)}px` : `${toPixel}px`;
                    const handleEnd = (event: TransitionEvent) => {
                        if (event.propertyName !== "height") return;
                        element.removeEventListener("transitionend", handleEnd);
                        element.style.transition = "";
                        element.classList.remove("et-collapse--animating");
                        onFinished?.();
                    };
                    element.addEventListener("transitionend", handleEnd, { once: true });
                });
            });
        },
        [animationDurationMs, animationEasing, prefersReducedMotion]
    );

    const expand = React.useCallback(() => {
        const element = containerReference.current;
        if (!element) return;
        const fromPixel = readBoxPixelHeight(element);
        element.style.height = `${fromPixel}px`;
        const toPixel = readContentPixelHeight(element);
        animate(element, fromPixel, toPixel, () => {
            element.style.height = "auto";
            element.setAttribute("data-expanded", "true");
        });
    }, [animate]);

    const collapse = React.useCallback(() => {
        const element = containerReference.current;
        if (!element) return;
        const fromPixel = readBoxPixelHeight(element);
        element.style.height = `${fromPixel}px`;
        const toPixel = resolveCollapsedPixelHeight(element);
        animate(element, fromPixel, toPixel, () => {
            element.style.height = `${toPixel}px`;
            element.setAttribute("data-expanded", "false");
        });
    }, [animate, resolveCollapsedPixelHeight]);

    const setExpanded = React.useCallback(
        (nextExpanded: boolean) => {
            if (!containerReference.current) {
                expandedReference.current = nextExpanded;
                setExpandedState(nextExpanded);
                return;
            }
            nextExpanded ? expand() : collapse();
            expandedReference.current = nextExpanded;
            setExpandedState(nextExpanded);
        },
        [expand, collapse]
    );

    const toggle = React.useCallback(() => {
        setExpanded(!expandedReference.current);
    }, [setExpanded]);

    const recomputeIfCollapsed = React.useCallback(() => {
        const element = containerReference.current;
        if (!element) return;
        if (expandedReference.current) return;
        const toPixel = resolveCollapsedPixelHeight(element);
        element.style.height = `${toPixel}px`;
    }, [resolveCollapsedPixelHeight]);

    // Khởi tạo
    React.useLayoutEffect(() => {
        const element = containerReference.current;
        if (!element) return;

        if (initialExpanded) {
            element.style.height = "auto";
            element.setAttribute("data-expanded", "true");
        } else {
            const toPixel = resolveCollapsedPixelHeight(element);
            element.style.height = `${toPixel}px`;
            element.setAttribute("data-expanded", "false");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        recomputeIfCollapsed();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, recomputeWhen);

    return {
        containerReference,
        isExpanded: expandedState,
        setExpanded,
        toggle,
        recomputeIfCollapsed,
    };
}
