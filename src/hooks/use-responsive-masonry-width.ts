// hooks/use-responsive-masonry-width.ts
import { RefObject, useEffect, useMemo, useState } from "react";

type Options = {
    minItemWidth: number; // min chiều rộng 1 thẻ (vd 260)
    maxItemWidth: number; // max chiều rộng 1 thẻ (vd 340)
    gapPx: number; // khoảng cách cột (khớp với MasonryInfiniteGrid.gap)
    maxColumns?: number; // an toàn, tránh quá nhiều cột
};

function computeColumnsAndWidth(containerWidth: number, { minItemWidth, maxItemWidth, gapPx, maxColumns = 12 }: Options) {
    if (containerWidth <= 0) return { columns: 1, itemWidth: minItemWidth };

    // Bắt đầu từ số cột “nhiều nhất” sao cho mỗi cột >= min width
    let columns = Math.max(1, Math.min(Math.floor((containerWidth + gapPx) / (minItemWidth + gapPx)), maxColumns));

    // Tính width cho cấu hình cột đó
    let itemWidth = (containerWidth - gapPx * (columns - 1)) / columns;

    // Nếu còn > maxItemWidth, tăng thêm cột để thu hẹp thẻ cho đến khi ≤ max
    while (itemWidth > maxItemWidth && columns < maxColumns) {
        columns += 1;
        itemWidth = (containerWidth - gapPx * (columns - 1)) / columns;
    }

    // Chốt trong [min, max]
    itemWidth = Math.max(minItemWidth, Math.min(itemWidth, maxItemWidth));

    return { columns, itemWidth };
}

export function useResponsiveMasonryWidth(scrollContainerRef: RefObject<HTMLElement | null>, options: Options) {
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;

        const measure = () => {
            // trừ padding nếu cần; ở đây đọc thẳng clientWidth (đã trừ scrollbar)
            setContainerWidth(el.clientWidth);
        };

        measure();

        const ro = new ResizeObserver(measure);
        ro.observe(el);
        window.addEventListener("resize", measure);

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, [scrollContainerRef]);

    const result = useMemo(() => computeColumnsAndWidth(containerWidth, options), [containerWidth, options]);

    return result; // { columns, itemWidth }
}
