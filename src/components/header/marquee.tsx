"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const MESSAGE = "Người dùng mới đăng bài";
const DISPLAY_DURATION = 3000; // thời gian hiển thị sau khi hoàn tất gõ, đơn vị ms

export default function Marquee() {
    const [key, setKey] = useState(0);

    // Cứ sau mỗi chu kỳ sẽ reset lại để chạy lại animation
    useEffect(() => {
        const totalTime = MESSAGE.length * 100 + DISPLAY_DURATION;
        const timer = setTimeout(() => {
            setKey((prev) => prev + 1); // đổi key để reset AnimatePresence
        }, totalTime);
        return () => clearTimeout(timer);
    }, [key]);

    return (
        <div className="flex items-center text-muted-foreground text-xs w-full h-5 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.p key={key} className="inline-block" initial="hidden" animate="visible" exit="exit" variants={container}>
                    {MESSAGE.split("").map((char, index) => (
                        <motion.span key={index} variants={charFade} style={{lineHeight: 1}}>
                            {char}
                        </motion.span>
                    ))}
                </motion.p>
            </AnimatePresence>
        </div>
    );
}

const container = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.05,
        },
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.5 },
    },
};

const charFade = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};
