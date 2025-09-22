"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

type ToggleRender = (opts: { onClick: () => void }) => React.ReactNode;

type ExpandableTextProps = {
    text: string;
    /** Maximum number of lines when collapsed (requires @tailwindcss/line-clamp) */
    maxLines?: 3 | 4 | 5 | 6;
    /** Extra classes applied to the text container */
    className?: string;
    /** Initial expanded state */
    defaultExpanded?: boolean;

    /**
     * Position of the toggle button when the text is COLLAPSED.
     * - "below": show the toggle under the paragraph (default)
     * - "inline": show the toggle at the end of the last visible line (with a fade overlay)
     */
    placement?: "below" | "inline";

    /** Override default labels when NOT providing renderers */
    moreLabel?: string;
    lessLabel?: string;

    /**
     * Custom renderers for toggle buttons.
     * If provided, these override `moreLabel` / `lessLabel`.
     * Receive a single prop: `{ onClick }`.
     */
    renderMore?: ToggleRender;
    renderLess?: ToggleRender;

    /**
     * Tailwind class(es) for the starting color of the fade gradient
     * used in "inline" placement. You can include dark mode variants.
     * Example: 'from-[#F0F2F5] dark:from-[#333334]'.
     * Default: "from-background"
     */
    fadeFromClass?: string;

    /**
     * Tailwind background class(es) painted UNDER the inline button
     * to mask text behind it (so the button looks attached to the text).
     * Example: 'bg-[#F0F2F5] dark:bg-[#333334]'.
     * Default: "bg-background"
     */
    inlineButtonBgClass?: string;

    /** Height of the fade strip (e.g. "h-6"). Default: "h-6" */
    fadeHeightClass?: string;
};

/**
 * ExpandableText — truncates long text to a fixed number of lines and provides a toggle to expand/collapse.
 *
 * Features:
 * - Line clamping (3–6 lines) in collapsed state.
 * - Two toggle placements:
 *    • "below" — toggle appears under the paragraph.
 *    • "inline" — toggle sits at the end of the last visible line with a subtle fade overlay.
 * - Customizable labels or fully custom toggle renderers.
 * - Configurable fade color and height to match any background.
 *
 * @example Basic
 * ```tsx
 * <ExpandableText text={content} />
 * ```
 *
 * @example Inline like Facebook
 * ```tsx
 * <ExpandableText text={content} placement="inline" maxLines={3} />
 * ```
 *
 * @example Custom buttons
 * ```tsx
 * <ExpandableText
 *   text={content}
 *   placement="inline"
 *   renderMore={({ onClick }) => (
 *     <Button variant="secondary" size="xs" className="h-6" onClick={onClick}>
 *       Read more →
 *     </Button>
 *   )}
 *   renderLess={({ onClick }) => (
 *     <Button variant="ghost" size="xs" className="h-6" onClick={onClick}>
 *       Collapse
 *     </Button>
 *   )}
 * />
 * ```
 */
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
}: ExpandableTextProps) {
    const [expanded, setExpanded] = React.useState(defaultExpanded);
    const textRef = React.useRef<HTMLDivElement>(null);
    const [isClamped, setIsClamped] = React.useState(false);

    // Map numeric `maxLines` to Tailwind's clamp classes.
    const clampClass = expanded ? "" : ({ 3: "line-clamp-3", 4: "line-clamp-4", 5: "line-clamp-5", 6: "line-clamp-6" } as const)[maxLines];

    // Đo xem có thật sự bị clamp không
    React.useLayoutEffect(() => {
        const el = textRef.current;
        if (!el) return;

        const measure = () => {
            if (expanded) return setIsClamped(false);
            // nếu bị cắt, scrollHeight sẽ > clientHeight
            setIsClamped(el.scrollHeight > el.clientHeight + 1);
        };

        measure();
        // re-measure khi resize hoặc text đổi
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [text, expanded, maxLines]);

    // Default toggle buttons (spans to keep output minimal and style-neutral).
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
        <div>
            <div
                className="et-collapse"
                data-expanded={expanded ? "true" : "false"}
                data-clamped={isClamped ? "true" : "false"}
                style={{ ["--et-lines" as any]: maxLines, ["--et-lh" as any]: "1.5rem" }}
            >
                {/* Text block (clamped when not expanded) */}
                <div
                    ref={textRef}
                    className={cn("relative text-sm leading-6 text-foreground/90 break-words", clampClass, className)}
                    aria-expanded={expanded}
                >
                    <p className="whitespace-pre-wrap">{text}</p>

                    {/* Inline placement: fade overlay + floating toggle at bottom-right while COLLAPSED */}
                    {isClamped && !expanded && placement === "inline" && (
                        <>
                            {/* Fade overlay to soften the end of the last visible line */}
                            <div
                                className={cn(
                                    "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t rounded-b-[inherit] to-transparent",
                                    fadeHeightClass,
                                    fadeFromClass
                                )}
                            />
                            {/* Background patch under the toggle button to mask underlying text */}
                            <div className={cn("absolute bottom-0 right-0 pl-2", inlineButtonBgClass)}>{More}</div>
                        </>
                    )}
                </div>
            </div>

            {/* "Below" placement OR when EXPANDED (show the appropriate toggle) */}
            {isClamped && (placement === "below" || expanded) && <div>{expanded ? Less : More}</div>}
        </div>
    );
}
