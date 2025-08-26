import { useGetAllNotification, useReadNotification } from "@/api/tantask/notification.tanstack";
import { formatLocalTime } from "@/helpers/function.helper";
import { useFillSkeletons } from "@/hooks/fill-skeleton-article";
import { NotificationType } from "@/types/enum/notification.enum";
import { TNotification } from "@/types/notification.type";
import { useQueryClient } from "@tanstack/react-query";
import { motion, Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AppendLoading } from "../data-state/append-state/AppendState";
import NodataOverlay from "../no-data/NodataOverlay";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Tabs } from "../ui/tabs";
import { cn } from "@/lib/utils";

const rowV = { rest: {}, hover: {} };

const dotV: Variants = {
    rest: { opacity: 1, scale: 1 },
    hover: { opacity: 0, scale: 0.6, transition: { type: "spring", stiffness: 380, damping: 28 } },
};

const btnV: Variants = {
    rest: {
        opacity: 0,
        x: 8,
        filter: "blur(1px)",
        // transitionEnd: { pointerEvents: "none" }, // áp sau khi về rest
    },
    hover: {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        // tách transition theo từng prop
        transition: {
            x: { type: "spring", stiffness: 380, damping: 28 }, // spring cho chuyển động
            opacity: { duration: 0.2, ease: "easeOut" }, // tween, không overshoot
            filter: { duration: 0.2, ease: "easeOut" }, // tween, KHÔNG spring
        },
        // transitionEnd: { pointerEvents: "auto" }, // bật pointer sau khi hiện
    },
};

export default function Notification() {
    const [page, setPage] = useState(1);
    const [notifications, setNotifications] = useState<TNotification[]>([]);
    const pageSize = 3;
    const totalPageRef = useRef(0);
    const containerRef = useRef(null);
    const bottomTriggerRef = useRef(null);
    const [type, setType] = useState<"all" | "unread">("all");
    const queryClient = useQueryClient();

    const getAllNotification = useGetAllNotification({
        pagination: { pageIndex: page, pageSize },
        filters: {
            isRead: type === "unread" ? false : undefined,
        },
        sort: { sortBy: `createdAt`, isDesc: true },
    });
    const readNotification = useReadNotification();

    useEffect(() => {
        if (!getAllNotification.data?.items) return;

        const newArticles = getAllNotification.data.items;
        setNotifications((prev) => {
            if (page === 1) return newArticles;
            return [...prev, ...newArticles];
        });
    }, [getAllNotification.data?.items]);

    useEffect(() => {
        if (getAllNotification.data?.totalPage) totalPageRef.current = getAllNotification.data.totalPage;
    }, [getAllNotification.data?.totalPage]);

    const itemWidth = 300;
    const gap = 20;
    const skeletonCount = useFillSkeletons(containerRef, itemWidth, notifications.length, gap);

    const handleEndReached = () => {
        if (getAllNotification.isFetching || getAllNotification.isLoading || page >= totalPageRef.current) return;
        setPage((prev) => prev + 1);
    };

    const onRead = (id: string) => {
        readNotification.mutate(id, {
            onSuccess: () => {
                getAllNotification.refetch();
                queryClient.invalidateQueries({ queryKey: [`count-unread-notification`] });
            },
        });
    };

    return (
        <div>
            <Tabs defaultValue="account" className="w-full gap-0">
                <div className="flex flex-col gap-5 bg-background rounded-t-xl shadow-xs border-b p-3">
                    <div className="flex items-baseline justify-between">
                        <h3 className="text-lg font-semibold leading-[1]">Notifications</h3>
                        {/* <p className="text-sm text-muted-foreground leading-[1]">Mark all as read</p> */}
                    </div>

                    <div className="flex items-center justify-start gap-1">
                        <Button onClick={() => setType("all")} variant={type === "all" ? "outline" : "ghost"} size="sm">
                            All
                        </Button>
                        <Button onClick={() => setType("unread")} variant={type === "unread" ? "outline" : "ghost"} size="sm">
                            Unread
                        </Button>
                    </div>
                </div>
                <div ref={containerRef} className="relative h-[200px] overflow-y-auto rounded-xl">
                    <div className={`relative flex flex-col min-h-[calc(100%-4px)]`}>
                        <AppendLoading
                            // debug
                            isLoading={getAllNotification.isLoading}
                            isEmpty={notifications.length === 0}
                            isError={getAllNotification.isError}
                            onBottom={handleEndReached}
                            containerRef={containerRef}
                            footerLoadingComponent={Array.from({ length: skeletonCount }).map((_, i) => (
                                <Skeleton key={i} className="min-h-[50px] h-full w-full rounded-xl" />
                            ))}
                            initialLoadingComponent={Array.from({ length: skeletonCount }).map((_, i) => (
                                <Skeleton key={i} className="h-[50px] w-full rounded-xl" />
                            ))}
                            noDataComponent={<NodataOverlay visible />}
                        >
                            {notifications.map((notification) => {
                                return (
                                    <motion.div
                                        key={notification.id}
                                        className={cn("group relative flex items-start gap-3 p-3", notification.isRead ? "bg-transparent" : "bg-muted")}
                                        variants={rowV}
                                        initial="rest"
                                        animate="rest"
                                        whileHover="hover"
                                        tabIndex={0}
                                        onFocus={(e) => ((e.currentTarget as any).dataset.fm = "hover")}
                                        onBlur={(e) => ((e.currentTarget as any).dataset.fm = "rest")}
                                    >
                                        <Avatar className="h-8 w-8 rounded-full">
                                            <AvatarImage src={notification.Users_Notifications_actorIdToUsers.avatar} alt="avatar" />
                                            <AvatarFallback className="rounded-lg">{"vulebaolong".slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate text-md font-bold">
                                                {notification.type === NotificationType.FOLLOW ? "New follower" : "New Article"}
                                            </span>
                                            <span className="truncate text-sm font-medium">
                                                {notification.Users_Notifications_actorIdToUsers.name}{" "}
                                                {notification.type === NotificationType.FOLLOW ? "followed you" : "posted a new article"}
                                            </span>
                                            <span className="truncate text-xs text-muted-foreground">
                                                {formatLocalTime(notification.createdAt, "ago")}
                                            </span>
                                        </div>
                                        {!notification.isRead && (
                                            <div className="ml-auto relative w-16 h-8">
                                                {/* Dot */}
                                                <motion.div
                                                    className="absolute right-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-blue-500"
                                                    variants={dotV}
                                                />
                                                {/* Button */}
                                                <motion.div className="absolute right-0 top-1/2 -translate-y-1/2" variants={btnV}>
                                                    <Button variant="secondary" size="sm" onClick={() => onRead(notification.id)}>
                                                        Read
                                                    </Button>
                                                </motion.div>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AppendLoading>
                    </div>
                    <div ref={bottomTriggerRef} className="w-full h-1"></div>
                </div>
            </Tabs>
        </div>
    );
}
