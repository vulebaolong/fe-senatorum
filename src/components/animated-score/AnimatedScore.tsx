// AnimatedScore.tsx — “mượt như Counter”, hỗ trợ compact + số âm
import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";
import Counter from "../counter/counter";

type Props = {
    value: number;
    className?: string;
    /** font px tương đương text-sm = 14 */
    fontPx?: number;
    /** tối đa chữ số phần nguyên (khóa bề rộng) khi chưa compact */
    maxDigits?: number; // ví dụ 3 => 000..999
    /** có dùng compact (K/M/B) như Intl không */
    compact?: boolean;
    /** số chữ số thập phân khi compact (mặc định 1) */
    compactDecimals?: number;
};

function splitCompact(value: number, compact: boolean, compactDecimals: number) {
    const abs = Math.abs(value);
    if (!compact) return { divisor: 1, suffix: "", decimals: 0 };

    if (abs >= 1e9) return { divisor: 1e9, suffix: "B", decimals: compactDecimals };
    if (abs >= 1e6) return { divisor: 1e6, suffix: "M", decimals: compactDecimals };
    if (abs >= 1e3) return { divisor: 1e3, suffix: "K", decimals: compactDecimals };
    return { divisor: 1, suffix: "", decimals: 0 };
}

function placesFromDigits(d: number) {
    // d=3 -> [100,10,1]
    return Array.from({ length: d }, (_, i) => Math.pow(10, d - i - 1));
}

export default function AnimatedScore({ value, className, fontPx = 14, maxDigits = 3, compact = true, compactDecimals = 1 }: Props) {
    const negative = value < 0;

    const { divisor, suffix, decimals } = splitCompact(value, compact, compactDecimals);
    const scaled = value / divisor;
    const absScaled = Math.abs(scaled);

    // Phần nguyên & phần thập phân (đưa phần thập phân về số nguyên để Counter lăn)
    const intPart = Math.trunc(absScaled);
    const fracFactor = Math.pow(10, decimals);
    const fracInt = decimals > 0 ? Math.trunc(Math.round(absScaled * fracFactor) % fracFactor) : 0;

    // Khóa bề rộng ổn định
    const intDigits = Math.max(String(intPart).length, maxDigits);
    const intPlaces = useMemo(() => placesFromDigits(intDigits), [intDigits]);
    const fracPlaces = useMemo(() => placesFromDigits(Math.max(decimals, 0)), [decimals]);

    return (
        <span
            className={["inline-flex items-center leading-none select-none align-middle", "tabular-nums", className ?? ""].join(" ")}
            aria-live="polite"
            role="status"
        >
            {/* dấu âm animate vào/ra */}
            <AnimatePresence initial={false} mode="popLayout">
                {negative ? (
                    <motion.span
                        key="minus"
                        initial={{ y: -6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 6, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="mr-[2px]"
                    >
                        −
                    </motion.span>
                ) : (
                    <motion.span key="space" className="mr-[2px]" />
                )}
            </AnimatePresence>

            {/* phần nguyên: dùng Counter để lăn từng digit */}
            <Counter
                value={intPart}
                places={intPlaces}
                fontSize={fontPx}
                textColor="currentColor"
                gap={0}
                horizontalPadding={0}
                borderRadius={0}
                gradientHeight={0}
                counterStyle={{ alignItems: "center", lineHeight: 1 }}
                digitStyle={{ width: "1ch", fontWeight: 600 }}
            />

            {/* phần thập phân (nếu có) */}
            {decimals > 0 && (
                <>
                    <span className="px-[1px]">.</span>
                    <Counter
                        value={fracInt}
                        places={fracPlaces}
                        fontSize={fontPx}
                        textColor="currentColor"
                        gap={0}
                        horizontalPadding={0}
                        borderRadius={0}
                        gradientHeight={0}
                        counterStyle={{ alignItems: "center", lineHeight: 1 }}
                        digitStyle={{ width: "1ch", fontWeight: 600 }}
                    />
                </>
            )}

            {/* suffix (K/M/B) fade nhẹ khi đổi */}
            <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                    key={suffix || "nosuffix"}
                    initial={{ y: -4, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 4, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className={suffix ? "ml-[2px]" : ""}
                >
                    {suffix}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}
