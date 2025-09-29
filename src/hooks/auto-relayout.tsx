import { RefObject, useEffect, useRef } from "react";
import type { MasonryInfiniteGrid } from "@egjs/react-infinitegrid";

export function useAutoRelayout(gridRef: RefObject<MasonryInfiniteGrid | null>, itemRef: React.RefObject<HTMLElement | null>, debounceMs = 50) {
    const last = useRef(0);

    useEffect(() => {
        if (!itemRef.current) return;
        const obs = new ResizeObserver(() => {
            const now = performance.now();
            if (now - last.current < debounceMs) return;
            last.current = now;

            const ig = gridRef.current;
            if (!ig) return;

            ig.updateItems(ig.getItems(), { useOrgResize: true });
            ig.renderItems();
        });

        obs.observe(itemRef.current);
        return () => obs.disconnect();
    }, [gridRef, itemRef, debounceMs]);
}
