// VoteCounter.tsx
import { useMemo } from "react";
import Counter from "./counter";

type VoteCounterProps = {
    score: number;
    /** số chữ số tối đa để khóa bề rộng (vd: 0..999 -> 3) */
    maxDigits?: number;
    /** cỡ chữ px cho đồng bộ với text-sm (14px) */
    fontPx?: number;
};

function placesFromDigits(digits: number) {
    // digits=3 -> [100,10,1]
    return Array.from({ length: digits }, (_, i) => Math.pow(10, digits - i - 1));
}

export default function VoteCounter({ score, maxDigits = 3, fontPx = 14 }: VoteCounterProps) {
    const negative = score < 0;
    const abs = Math.abs(score);

    // Khoá bề rộng và tránh leading zero: fix số place theo maxDigits
    const places = useMemo(() => placesFromDigits(maxDigits), [maxDigits]);

    return (
        <div
            className="flex items-center justify-center"
            style={{ width: `${maxDigits}ch` }} // bề rộng ổn định
            aria-live="polite" // SR sẽ đọc khi số thay đổi
        >
            {/* nếu cho phép điểm âm */}
            {negative && <span style={{ width: "1ch", textAlign: "center" }}>-</span>}

            <Counter
                value={abs}
                places={places}
                fontSize={fontPx}
                textColor="currentColor" // kế thừa màu chữ
                gap={0}
                horizontalPadding={0}
                borderRadius={0}
                gradientHeight={0} // tắt fade
                counterStyle={{ alignItems: "center", lineHeight: 1 }}
                digitStyle={{ width: "1ch", fontWeight: 600 }} // tương đương font-semibold
            />
        </div>
    );
}
