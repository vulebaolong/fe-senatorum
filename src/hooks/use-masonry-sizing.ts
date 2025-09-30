// hooks/use-masonry-sizing.ts
import { RefObject, useEffect, useMemo, useRef, useState } from "react";

type Options = {
    minItemWidth: number; // ví dụ 260
    maxItemWidth: number; // ví dụ 340
    gapPx: number; // phải trùng với gap của MasonryInfiniteGrid
    maxColumns?: number; // giới hạn an toàn
};

export function useMasonrySizing(scrollContainerRef: RefObject<HTMLElement | null>, options: Options) {
    const { minItemWidth, maxItemWidth, gapPx, maxColumns = 12 } = options;

    const prevW = useRef(0);
    const prevCols = useRef<number>(0);
    const [containerWidth, setContainerWidth] = useState(0);

    // đo width container
    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;

        const measure = () => setContainerWidth(el.clientWidth);
        measure();

        const ro = new ResizeObserver(measure);
        ro.observe(el);
        window.addEventListener("resize", measure);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, [scrollContainerRef]);

    const { columns, itemWidth } = useMemo(() => {
        const w = containerWidth;
        if (w <= 0) return { columns: 1, itemWidth: minItemWidth };

        // biên dưới/trên hợp lệ cho số cột theo min/max item width
        const maxColsByMin = Math.max(1, Math.min(Math.floor((w + gapPx) / (minItemWidth + gapPx)), maxColumns));
        const minColsByMax = Math.max(1, Math.min(Math.ceil((w + gapPx) / (maxItemWidth + gapPx)), maxColumns));

        const isShrinking = w < prevW.current;

        // ứng viên mặc định: số cột lớn nhất nằm trong khoảng hợp lệ
        let cols = Math.min(maxColsByMin, maxColumns);
        cols = Math.max(cols, minColsByMax);

        // HYSTERESIS: khi container THU HẸP, không được tăng số cột
        if (isShrinking && prevCols.current) {
            cols = Math.min(cols, prevCols.current);
            // Nhưng vẫn phải đảm bảo >= minColsByMax để không vượt maxItemWidth
            cols = Math.max(cols, minColsByMax);
        }

        const width = (w - gapPx * (cols - 1)) / cols;

        // lưu lại cho lần sau
        prevW.current = w;
        prevCols.current = cols;

        return { columns: cols, itemWidth: Math.max(minItemWidth, Math.min(width, maxItemWidth)) };
    }, [containerWidth, minItemWidth, maxItemWidth, gapPx, maxColumns]);

    return { containerWidth, columns, itemWidth };
}
