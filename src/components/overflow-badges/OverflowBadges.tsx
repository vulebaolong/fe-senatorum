"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

/** Hiển thị badges 1 hàng; khi thiếu chỗ -> hiện +N */
export function OverflowBadges({
    items,
    className,
    gapPx = 4, // tương ứng tailwind gap-1
    moreLabel = (n: number) => `+${n}`,
}: {
    items: string[];
    className?: string;
    /** Khoảng cách giữa badges (px) – khớp với class gap-* bạn dùng */
    gapPx?: number;
    /** Tùy biến text cho “+N” */
    moreLabel?: (n: number) => string;
}) {
    const hostRef = useRef<HTMLDivElement>(null);

    // container ẩn để đo width từng badge & badge +N
    const measureRef = useRef<HTMLDivElement>(null);
    const [badgeWidths, setBadgeWidths] = useState<number[]>([]);
    const [moreWidth, setMoreWidth] = useState<number>(0);
    const [containerW, setContainerW] = useState<number>(0);

    // render dữ liệu đo lường
    const measureItems = useMemo(() => items, [items]);

    // đo width container khi resize
    useLayoutEffect(() => {
        if (!hostRef.current) return;
        const el = hostRef.current;
        const ro = new ResizeObserver(() => setContainerW(el.clientWidth));
        ro.observe(el);
        setContainerW(el.clientWidth);
        return () => ro.disconnect();
    }, []);

    // đo width từng badge & badge "+N" (dựa trên DOM ẩn)
    useEffect(() => {
        const root = measureRef.current;
        if (!root) return;

        const nodes = Array.from(root.querySelectorAll<HTMLDivElement>('[data-kind="badge"]'));
        setBadgeWidths(nodes.map((n) => Math.ceil(n.offsetWidth)));

        const more = root.querySelector<HTMLDivElement>('[data-kind="more"]');
        setMoreWidth(more ? Math.ceil(more.offsetWidth) : 0);
    }, [measureItems]);

    // tính số badge hiển thị được
    const { visibleCount, hiddenCount } = useMemo(() => {
        if (!containerW || badgeWidths.length === 0) return { visibleCount: items.length, hiddenCount: 0 };

        let used = 0;
        let visible = 0;

        for (let i = 0; i < badgeWidths.length; i++) {
            const remain = badgeWidths.length - (i + 1);
            const needMore = remain > 0 ? moreWidth + gapPx : 0; // chừa chỗ cho +N nếu còn ẩn
            const nextUsed = (visible === 0 ? 0 : used + gapPx) + badgeWidths[i] + needMore;

            if (nextUsed <= containerW) {
                used = visible === 0 ? badgeWidths[i] : used + gapPx + badgeWidths[i];
                visible++;
            } else break;
        }

        return { visibleCount: visible, hiddenCount: items.length - visible };
    }, [containerW, badgeWidths, moreWidth, gapPx, items.length]);

    return (
        <>
            {/* container hiển thị */}
            <div ref={hostRef} className={cn("flex items-center gap-1 overflow-hidden", className)} title={items.join(", ")}>
                {items.slice(0, visibleCount).map((name, i) => (
                    <Badge key={i} variant="outline">
                        #{name}
                    </Badge>
                ))}
                {hiddenCount > 0 && <Badge variant="secondary">{moreLabel(hiddenCount)}</Badge>}
            </div>

            {/* container ẩn để đo – offscreen, không ảnh hưởng layout */}
            <div className="absolute -left-[9999px] -top-[9999px] opacity-0 pointer-events-none">
                <div ref={measureRef} className="flex items-center" style={{ gap: `${gapPx}px` }}>
                    {measureItems.map((name, i) => (
                        <div key={i} data-kind="badge" className="inline-block">
                            <Badge variant="outline">#{name}</Badge>
                        </div>
                    ))}
                    {/* đo badge +N với N thực tế */}
                    <div data-kind="more" className="inline-block">
                        <Badge variant="secondary">{moreLabel(Math.max(1, items.length - 1))}</Badge>
                    </div>
                </div>
            </div>
        </>
    );
}
