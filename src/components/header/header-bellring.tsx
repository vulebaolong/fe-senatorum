"use client";

import { useCountUnreadNotification } from "@/api/tantask/notification.tanstack";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSocket } from "@/hooks/socket.hook";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { BellRing } from "lucide-react";
import { useEffect } from "react";
import ButtonIcon from "../custom/button-custom/button-icon";
import Notification from "../notification/notification";

type TSocketRes<T> = { data: T; message: string };

export default function HeaderBellring() {
    const { socket } = useSocket();
    const queryClient = useQueryClient();
    const countUnreadNotification = useCountUnreadNotification();
    const unread = countUnreadNotification.data ?? 0;

    const prefersReduced = useReducedMotion();
    const bellCtrls = useAnimationControls();
    const badgeCtrls = useAnimationControls();

    // Rung chuông khi có sự kiện mới
    useEffect(() => {
        if (!socket) return;

        const onIncoming = (_: TSocketRes<any>) => {
            // refresh số chưa đọc
            queryClient.invalidateQueries({ queryKey: ["count-unread-notification"] });

            if (prefersReduced) return;
            // rung chuông: keyframes xoay nhẹ
            bellCtrls.start({
                rotate: [0, -15, 10, -6, 0],
                transition: { duration: 0.8, ease: "easeInOut" },
            });
        };

        socket.on("follow", onIncoming);
        socket.on("new-article", onIncoming);
        return () => {
            // ❗ cleanup đúng: off, không phải on
            socket.off("follow", onIncoming);
            socket.off("new-article", onIncoming);
        };
    }, [socket, queryClient, bellCtrls, prefersReduced]);

    // Pop badge khi số đổi
    useEffect(() => {
        if (prefersReduced) return;
        if (unread > 0) {
            badgeCtrls.start({
                scale: [1, 1.5, 1],
                transition: { duration: 0.5, times: [0, 0.45, 1], ease: ["easeOut", "easeIn"] },
            });
        }
    }, [unread, badgeCtrls, prefersReduced]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <ButtonIcon variant="secondary" size="icon" className="relative mr-2 size-8">
                    {/* Chuông có animation rung */}
                    <motion.span style={{ originX: 0.5, originY: 0 }} animate={bellCtrls}>
                        <BellRing className="size-5" />
                    </motion.span>

                    {/* Badge đỏ có mount/unmount mượt + halo pulse */}
                    <AnimatePresence>
                        {unread > 0 && (
                            <motion.span
                                key="badge"
                                initial={{ scale: 0, opacity: 0, y: -2, x: 2 }}
                                animate={{ scale: 1, opacity: 1, y: 0, x: 0 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 550, damping: 30 }}
                                className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4"
                            >
                                {/* halo pulse (tắt nếu user prefers-reduced-motion) */}
                                {!prefersReduced && (
                                    <motion.span
                                        className="absolute inset-0 rounded-sm bg-red-500/30"
                                        style={{ filter: "blur(2px)" }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: [0.3, 0.6, 0], scale: [1, 1.6, 1.9] }}
                                        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.2 }}
                                    />
                                )}

                                <motion.span
                                    animate={badgeCtrls}
                                    className="relative z-10 flex h-4 w-4 items-center justify-center rounded-sm bg-red-500 text-[10px] font-semibold leading-none text-white shadow"
                                >
                                    {unread > 99 ? "99+" : unread}
                                </motion.span>
                            </motion.span>
                        )}
                    </AnimatePresence>
                </ButtonIcon>
            </PopoverTrigger>

            <PopoverContent className="w-95 rounded-xl p-0" align="end" sideOffset={5}>
                <Notification />
            </PopoverContent>
        </Popover>
    );
}
