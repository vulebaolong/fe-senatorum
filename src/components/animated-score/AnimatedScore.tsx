// AnimatedScore.tsx
import { formatCompactIntl } from "@/helpers/function.helper";
import { AnimatePresence, motion, Transition, useReducedMotion } from "framer-motion";
import { useRef } from "react";

const springTransition: Transition = {
    type: "spring",
    stiffness: 700,
    damping: 40,
    mass: 0.6,
};

const instantTransition: Transition = {
    // để “tắt” animation khi reduce motion: dùng tween với duration=0
    type: "tween",
    duration: 0,
};

type Props = {
    value: number;
    className?: string;
};

export default function AnimatedScore({ value, className }: Props) {
    const shouldReduce = useReducedMotion();
    // prev value để biết hướng trượt
    const prevRef = useRef<number | null>(null);
    const prev = prevRef.current ?? value;
    const direction = value > prev ? 1 : value < prev ? -1 : 0; // 1: tăng, -1: giảm, 0: không đổi
    prevRef.current = value;

    // cấu hình motion theo hướng
    const enterY = direction >= 0 ? 12 : -12; // tăng: từ dưới lên, giảm: từ trên xuống
    const exitY = direction >= 0 ? -12 : 12;

    const transition: Transition = shouldReduce
        ? { duration: 0 } // tôn trọng reduced motion
        : { type: "spring", stiffness: 700, damping: 40, mass: 0.6 };

    return (
        <span
            className={[
                "relative inline-flex items-center justify-center",
                "leading-none tabular-nums select-none",
                // giữ kích thước ổn định
                "min-w-[2ch] h-[1em] overflow-hidden align-middle",
                className ?? "",
            ].join(" ")}
            aria-live="polite"
            role="status"
        >
            <AnimatePresence /* mặc định chạy song song: old exit + new enter cùng lúc */>
                <motion.span
                    key={value}
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{ willChange: "transform" }}
                    initial={{ y: direction === 0 ? 0 : enterY }}
                    animate={{ y: 0 }}
                    exit={{ y: direction === 0 ? 0 : exitY }}
                    transition={springTransition}
                >
                    {formatCompactIntl(value)}
                </motion.span>
            </AnimatePresence>

            {/* Flash nhẹ khi tăng điểm (optional, bỏ nếu không thích) */}
            {!shouldReduce && direction > 0 && (
                <motion.span
                    key={`flash-${value}`}
                    className="absolute inset-0 -z-10 rounded"
                    initial={{ scale: 0.8, opacity: 0.25 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    style={{ background: "rgba(16,185,129,0.2)" }} // emerald-500/20
                    aria-hidden
                />
            )}
        </span>
    );
}
