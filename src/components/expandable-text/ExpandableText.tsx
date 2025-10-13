"use client";

import { useCollapseTransition } from "@/hooks/use-collapse-transition";
import { cn } from "@/lib/utils";
import * as React from "react";

type ToggleRenderer = (options: { onClick: () => void }) => React.ReactNode;

type ExpandableTextProperties = {
    text: string;
    maxLines?: 3 | 4 | 5 | 6;
    className?: string;
    defaultExpanded?: boolean;
    placement?: "below" | "inline";
    moreLabel?: string;
    lessLabel?: string;
    renderMore?: ToggleRenderer;
    renderLess?: ToggleRenderer;
    fadeFromClass?: string;
    inlineButtonBgClass?: string;
    fadeHeightClass?: string;
    onTransitionEnd?: (expanded: boolean) => void;
};

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
    onTransitionEnd,
}: ExpandableTextProperties) {
    const textBlockReference = React.useRef<HTMLDivElement>(null);
    const [isTrulyClamped, setIsTrulyClamped] = React.useState(false);

    // NEW: tạm tắt clamp đúng lúc expand để hook đo chiều cao thật
    const [disableClampForExpand, setDisableClampForExpand] = React.useState(false);

    const getCollapsedHeightFromLines = React.useCallback(
        (containerElement: HTMLElement) => {
            const textElement = textBlockReference.current;
            if (!textElement) return 0;
            const computedStyle = window.getComputedStyle(textElement);
            const lineHeightString = computedStyle.lineHeight;
            const lineHeightPixel = lineHeightString === "normal" ? (parseFloat(computedStyle.fontSize) || 16) * 1.5 : parseFloat(lineHeightString);
            return Math.max(0, lineHeightPixel * maxLines);
        },
        [maxLines]
    );

    const collapse = useCollapseTransition({
        initialExpanded: defaultExpanded,
        getCollapsedHeight: getCollapsedHeightFromLines,
        animationDurationMs: 280,
        animationEasing: "ease",
        capCollapsedAtContentHeight: true,
        recomputeWhen: [text, maxLines],
    });

    React.useEffect(() => {
        const container = collapse.containerReference.current;
        if (!container) return;

        const handleTransitionEnd = (event: TransitionEvent) => {
            // đảm bảo đúng target (tránh bubble từ con)
            if (event.target !== container) return;
            onTransitionEnd?.(collapse.isExpanded);
        };

        container.addEventListener("transitionend", handleTransitionEnd);
        return () => container.removeEventListener("transitionend", handleTransitionEnd);
    }, [collapse.containerReference, collapse.isExpanded, onTransitionEnd]);

    // Đo đúng: so tổng số dòng với maxLines
    React.useLayoutEffect(() => {
        const element = textBlockReference.current;
        if (!element) return;

        const measure = () => {
            if (collapse.isExpanded) {
                setIsTrulyClamped(false);
                return;
            }
            const computed = window.getComputedStyle(element);
            const lineHeightString = computed.lineHeight;
            const lineHeightPixel = lineHeightString === "normal" ? (parseFloat(computed.fontSize) || 16) * 1.5 : parseFloat(lineHeightString);
            const totalLineCount = Math.round(element.scrollHeight / lineHeightPixel);
            setIsTrulyClamped(totalLineCount > maxLines);
        };

        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [text, maxLines, collapse.isExpanded]);

    // Nút mặc định
    const handleClickExpand = () => {
        // TẮT CLAMP ngay frame hiện tại để hook đo scrollHeight thật
        setDisableClampForExpand(true);
        requestAnimationFrame(() => {
            collapse.setExpanded(true);
            // khi đã expand, không cần bật lại (đang mở thì không dùng clamp)
        });
    };
    const handleClickCollapse = () => {
        // Bật lại clamp khi đóng
        setDisableClampForExpand(false);
        collapse.setExpanded(false);
    };

    const DefaultMore = (
        <span
            className="px-0 h-auto text-sm font-bold hover:underline cursor-pointer text-blue-400"
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleClickExpand();
            }}
        >
            {moreLabel}
        </span>
    );
    const DefaultLess = (
        <span
            className="px-0 h-auto text-sm font-bold hover:underline cursor-pointer text-blue-400"
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleClickCollapse();
            }}
        >
            {lessLabel}
        </span>
    );

    const MoreButton = renderMore ? renderMore({ onClick: handleClickExpand }) : DefaultMore;
    const LessButton = renderLess ? renderLess({ onClick: handleClickCollapse }) : DefaultLess;

    // Áp dụng clamp CHỈ khi đang đóng VÀ không ở trạng thái “tắt clamp để expand”
    const shouldApplyClamp = !collapse.isExpanded && !disableClampForExpand;
    const clampClassName = shouldApplyClamp
        ? ({ 3: "line-clamp-3", 4: "line-clamp-4", 5: "line-clamp-5", 6: "line-clamp-6" } as const)[maxLines]
        : "line-clamp-none";

    return (
        <div>
            <div ref={collapse.containerReference} className="et-collapse overflow-hidden" data-expanded={collapse.isExpanded ? "true" : "false"}>
                <div
                    ref={textBlockReference}
                    className={cn("relative text-sm leading-6 text-foreground/90 break-words", clampClassName, className)}
                    aria-expanded={collapse.isExpanded}
                >
                    <p className="whitespace-pre-wrap m-0">{text}</p>

                    {isTrulyClamped && !collapse.isExpanded && placement === "inline" && (
                        <>
                            {/* <div
                                className={cn(
                                    "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t rounded-b-[inherit] to-transparent",
                                    fadeHeightClass,
                                    fadeFromClass
                                )}
                            /> */}
                            <div className={cn("absolute bottom-0 right-0 pl-2", inlineButtonBgClass)}>{MoreButton}</div>
                        </>
                    )}
                </div>
            </div>

            { (placement === "below" || collapse.isExpanded) && (
                <div className="mt-1">{collapse.isExpanded ? LessButton : MoreButton}</div>
            )}
        </div>
    );
}
