// hooks/useGridColumns.ts
import { useEffect, useState } from "react";

export function useGridColumns(ref: React.RefObject<HTMLElement | null>, itemWidth: number, overrideGapPx?: number) {
    const [cols, setCols] = useState(1);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const compute = () => {
            const cs = getComputedStyle(el);
            // nếu bạn đã set gap-5 ở grid, columnGap sẽ ra đúng px
            const gap = overrideGapPx ?? (Number.parseFloat(cs.columnGap || "0") || 0);

            // clientWidth đã trừ scrollbar; trừ padding để ra vùng thực sự đặt cột
            const paddingLeft = Number.parseFloat(cs.paddingLeft || "0");
            const paddingRight = Number.parseFloat(cs.paddingRight || "0");
            const width = el.clientWidth - paddingLeft - paddingRight;

            const c = Math.max(1, Math.floor((width + gap) / (itemWidth + gap)));
            setCols(c);
        };

        compute();
        const ro = new ResizeObserver(compute);
        ro.observe(el);
        return () => ro.disconnect();
    }, [ref, itemWidth, overrideGapPx]);

    return cols;
}
