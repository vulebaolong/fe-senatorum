"use client";

import * as React from "react";

type ButtonRender = (p: { onClick: () => void }) => React.ReactNode;

export type ExpandableTextProps = {
    text: React.ReactNode;
    /** Số dòng hiển thị khi thu gọn */
    maxLines?: number;
    className?: string;
    /** Trạng thái mặc định */
    defaultExpanded?: boolean;
    /** Vị trí nút: inline (nằm trên text với fade) hoặc below (nút ở dưới) */
    placement?: "inline" | "below";
    moreLabel?: string;
    lessLabel?: string;
    /** Tuỳ biến render nút */
    renderMore?: ButtonRender;
    renderLess?: ButtonRender;
    /** Tuỳ biến lớp fade & nền nút inline (Tailwind class) */
    fadeFromClass?: string; // ví dụ: 'from-background'
    inlineButtonBgClass?: string; // ví dụ: 'bg-background'
    fadeHeightClass?: string; // ví dụ: 'h-6'
    /** Tuỳ biến animation */
    durationMs?: number; // mặc định 300
    easing?: string; // mặc định 'ease-in-out'
};

const cn = (...v: Array<string | false | null | undefined>) => v.filter(Boolean).join(" ");

export default function ExpandableText({
    text,
    maxLines = 3,
    className,
    defaultExpanded = false,
    placement = "below",
    moreLabel = "Show more",
    lessLabel = "Show less",
    renderMore,
    renderLess,
    fadeFromClass = "from-background",
    inlineButtonBgClass = "bg-background",
    fadeHeightClass = "h-6",
    durationMs = 300,
    easing = "ease-in-out",
}: ExpandableTextProps) {
    const [expanded, setExpanded] = React.useState(defaultExpanded);

    // refs
    const containerRef = React.useRef<HTMLDivElement>(null); // element có height animate
    const contentRef = React.useRef<HTMLDivElement>(null); // element đo scrollHeight
    const animRef = React.useRef(false); // có đang animate height không

    // heights
    const [collapsedH, setCollapsedH] = React.useState<number>(0);
    const [expandedH, setExpandedH] = React.useState<number>(0);

    // trạng thái clamp & animation
    const [isClamped, setIsClamped] = React.useState(false);
    const [animating, setAnimating] = React.useState(false);

    // prefers-reduced-motion
    const prefersReducedMotion = React.useMemo(() => {
        if (typeof window === "undefined" || !("matchMedia" in window)) return false;
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }, []);

    const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

    const measure = React.useCallback(() => {
        if (animRef.current) return; // tránh đo giữa animation

        const contentEl = contentRef.current;
        const containerEl = containerRef.current;
        if (!contentEl || !containerEl) return;

        // Lấy line-height px; fallback nếu không lấy được
        const lhStr = getComputedStyle(contentEl).lineHeight;
        const lineH = Number.parseFloat(lhStr) || 24;

        const collapsed = Math.max(0, Math.round(lineH * maxLines));

        // Đưa container về 'auto' tạm thời để đo full height
        const prevHeight = containerEl.style.height;
        containerEl.style.height = "auto";
        const full = contentEl.scrollHeight;
        containerEl.style.height = prevHeight;

        setCollapsedH(collapsed);
        setExpandedH(full);
        setIsClamped(full > collapsed + 1);
    }, [maxLines, text]);

    // Đo lần đầu & khi deps đổi
    React.useLayoutEffect(() => {
        measure();
    }, [measure]);
    // Re-measure khi resize
    React.useEffect(() => {
        const onResize = () => measure();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [measure]);
    // Re-measure khi nội dung biến đổi kích thước (ảnh load...)
    React.useEffect(() => {
        const el = contentRef.current;
        if (!el || typeof ResizeObserver === "undefined") return;
        const ro = new ResizeObserver(() => {
            if (!animRef.current) measure();
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, [measure]);

    const animateHeight = React.useCallback(
        async (from: number, to: number, setAutoAfter = false) => {
            const el = containerRef.current;
            if (!el) return;

            if (prefersReducedMotion) {
                // Không animate: nhảy thẳng
                el.style.transition = "";
                el.style.overflow = "";
                el.style.height = setAutoAfter ? "auto" : `${to}px`;
                return;
            }

            animRef.current = true;
            setAnimating(true);

            el.style.willChange = "height";
            el.style.overflow = "hidden";
            el.style.transitionProperty = "height";
            el.style.transitionDuration = `${durationMs}ms`;
            el.style.transitionTimingFunction = easing;

            // Set from → frame tiếp theo → set to (đảm bảo transition bắt đầu đúng)
            el.style.height = `${from}px`;
            await nextFrame();
            el.style.height = `${to}px`;

            const onEnd = (e: TransitionEvent) => {
                if (e.propertyName !== "height") return;
                el.removeEventListener("transitionend", onEnd);
                if (setAutoAfter) el.style.height = "auto";
                el.style.willChange = "";
                setAnimating(false);
                animRef.current = false;
            };
            el.addEventListener("transitionend", onEnd, { once: true });
        },
        [durationMs, easing, prefersReducedMotion]
    );

    // Đồng bộ height khi expanded thay đổi
    React.useLayoutEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        if (!isClamped) {
            el.style.height = "auto";
            return;
        }

        if (expanded) {
            // collapsed(px) -> expanded(px), xong set auto
            animateHeight(collapsedH, expandedH, true);
        } else {
            // current(px) (auto hoặc expanded px) -> collapsed(px)
            const current = Math.round(el.getBoundingClientRect().height) || expandedH;
            animateHeight(current, collapsedH, false);
        }
    }, [expanded, collapsedH, expandedH, isClamped, animateHeight]);

    // Nút mặc định
    const DefaultMore = (
        <span className="px-0 h-auto text-sm font-bold hover:underline cursor-pointer" onClick={() => setExpanded(true)}>
            {moreLabel}
        </span>
    );
    const DefaultLess = (
        <span className="px-0 h-auto text-sm font-bold hover:underline cursor-pointer" onClick={() => setExpanded(false)}>
            {lessLabel}
        </span>
    );

    const More = renderMore ? renderMore({ onClick: () => setExpanded(true) }) : DefaultMore;
    const Less = renderLess ? renderLess({ onClick: () => setExpanded(false) }) : DefaultLess;

    return (
        <div className={cn("text-sm leading-6 text-foreground/90", className)}>
            {/* Container animate height */}
            <div
                ref={containerRef}
                // Height initial để tránh jump lúc mount
                style={{
                    height: isClamped ? (expanded ? "auto" : `${collapsedH || 0}px`) : "auto",
                    overflow: isClamped ? "hidden" : undefined,
                }}
                aria-expanded={expanded}
                className="relative"
            >
                {/* Nội dung để đo scrollHeight */}
                <div ref={contentRef}>{typeof text === "string" ? <p className="whitespace-pre-wrap break-words">{text}</p> : text}</div>

                {/* Fade + inline button khi COLLAPSED */}
                {isClamped && !expanded && placement === "inline" && (
                    <>
                        <div
                            className={cn(
                                "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t rounded-b-[inherit] to-transparent",
                                fadeHeightClass,
                                fadeFromClass
                            )}
                        />
                        <div className={cn("absolute bottom-0 right-0 pl-2", inlineButtonBgClass)}>{More}</div>
                    </>
                )}
            </div>

            {/* Nút bên dưới (hoặc khi đã expanded) */}
            {isClamped && (placement === "below" || expanded) && (
                <div className={cn(animating && "pointer-events-none select-none")}>{expanded ? Less : More}</div>
            )}
        </div>
    );
}
