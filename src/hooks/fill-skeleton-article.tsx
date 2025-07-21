import { useEffect, useState } from "react";

export function useFillSkeletons(containerRef: React.RefObject<HTMLElement | null>, itemWidth: number, itemCount: number, gap: number = 20) {
    const [skeletonCount, setSkeletonCount] = useState(0);

    useEffect(() => {
        const calculate = () => {
            const container = containerRef.current;
            if (!container) return;

            const containerWidth = container.offsetWidth;
            let itemsPerRow = Math.floor((containerWidth + gap) / (itemWidth + gap));
            if (itemsPerRow < 1) itemsPerRow = 1;

            let fillCount = 0;

            if (itemCount === 0) {
                // Nếu không có item nào thì hiển thị đủ 1 hàng skeleton
                fillCount = itemsPerRow;
            } else {
                const remainder = itemCount % itemsPerRow;
                if (remainder !== 0) {
                    fillCount = itemsPerRow - remainder;
                }
            }

            setSkeletonCount(fillCount);
        };

        calculate();
        window.addEventListener("resize", calculate);
        return () => window.removeEventListener("resize", calculate);
    }, [containerRef, itemWidth, itemCount, gap]);

    return skeletonCount;
}
