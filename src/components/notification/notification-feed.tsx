import { useGetAllNotification, useReadNotification } from "@/api/tantask/notification.tanstack";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTER_CLIENT } from "@/constant/router.constant";
import { formatLocalTime } from "@/helpers/function.helper";
import { useFillSkeletons } from "@/hooks/fill-skeleton-article";
import { cn } from "@/lib/utils";
import { NotificationType } from "@/types/enum/notification.enum";
import { TNotification } from "@/types/notification.type";
import { useQueryClient } from "@tanstack/react-query";
import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { FileText, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import AvatartImageCustom from "../custom/avatar-custom/avatart-custom";
import { AppendLoading } from "../data-state/append-state/AppendState";
import NodataOverlay from "../no-data/NodataOverlay";

// ----- Types -----
type FeedMode = "all" | "unread";

// ----- Motion variants (đơn giản, tránh filter để đỡ lỗi TS) -----
const rowVariants: Variants = { rest: {}, hover: {} };
const dotVariants: Variants = {
    rest: { opacity: 1, scale: 1 },
    hover: { opacity: 0, scale: 0.6, transition: { type: "spring", stiffness: 380, damping: 28 } },
};
const buttonVariants: Variants = {
    rest: { opacity: 0, x: 8 },
    hover: {
        opacity: 1,
        x: 0,
        transition: {
            x: { type: "spring", stiffness: 380, damping: 28 },
            opacity: { duration: 0.2, ease: "easeOut" },
        },
    },
};

// Gõ props trước để giảm suy luận union “quá phức tạp”
const dotMotionProps: HTMLMotionProps<"div"> = {
    className: "absolute right-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-blue-500",
    variants: dotVariants,
};
const buttonMotionProps: HTMLMotionProps<"div"> = {
    className: "absolute right-0 top-1/2 -translate-y-1/2",
    variants: buttonVariants,
};

// ----- Helpers -----
function parseUnreadCount(extend?: string | null): number {
    try {
        if (!extend || !extend.trim()) return 0;
        const obj = JSON.parse(extend);
        const val = Number(obj?.countUnread);
        return Number.isFinite(val) ? val : 0;
    } catch {
        return 0;
    }
}

function getBorderClassByType(type: NotificationType): string {
    switch (type) {
        case NotificationType.NEW_COMMENT:
            return "border-l-2 border-blue-500";
        case NotificationType.NEW_ARTICLE:
            return "border-l-2 border-amber-500";
        case NotificationType.FOLLOW:
        default:
            return "border-l-2 border-emerald-500";
    }
}

function navigateByType(router: ReturnType<typeof useRouter>, notification: TNotification) {
    switch (notification.type) {
        case NotificationType.FOLLOW: {
            const username = notification.Users_Notifications_actorIdToUsers?.username;
            if (username) router.push(`/${username}`);
            break;
        }
        case NotificationType.NEW_ARTICLE: {
            const slug = notification.Articles?.slug;
            if (slug) router.push(`${ROUTER_CLIENT.ARTICLE}/${slug}`);
            break;
        }
        case NotificationType.NEW_COMMENT: {
            const slug = notification.Articles?.slug;
            if (slug) router.push(`${ROUTER_CLIENT.ARTICLE}/${slug}#comments`);
            break;
        }
        default:
            break;
    }
}

// ----- Leading visuals theo type -----
function LeadingVisual({ notification }: { notification: TNotification }) {
    if (notification.type === NotificationType.NEW_COMMENT) {
        return (
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10">
                <MessageSquare className="h-4 w-4" />
            </div>
        );
    }
    if (notification.type === NotificationType.NEW_ARTICLE) {
        return (
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-500/10">
                <FileText className="h-4 w-4" />
            </div>
        );
    }
    // FOLLOW
    return (
        <AvatartImageCustom
            className="h-8 w-8 rounded-full"
            name={notification.Users_Notifications_actorIdToUsers?.name}
            src={notification.Users_Notifications_actorIdToUsers?.avatar}
        />
    );
}

// ----- Content theo type (không dùng 3 ngôi) -----
function TitleByType({ type }: { type: NotificationType }) {
    switch (type) {
        case NotificationType.FOLLOW:
            return <span className="truncate text-sm font-semibold">New follower</span>;
        case NotificationType.NEW_ARTICLE:
            return <span className="truncate text-sm font-semibold">New article</span>;
        case NotificationType.NEW_COMMENT:
            return <span className="truncate text-sm font-semibold">New comments</span>;
        default:
            return <span className="truncate text-sm font-semibold">Notification</span>;
    }
}

type TBodyFollowProps = { notification: TNotification; onClickUser: (e: React.MouseEvent<HTMLButtonElement>) => void };
function BodyFollow({ notification, onClickUser }: TBodyFollowProps) {
    return (
        <span className="truncate text-sm">
            <button onClick={onClickUser} className="text-muted-foreground hover:underline">
                {notification.Users_Notifications_actorIdToUsers?.name}
            </button>{" "}
            followed you
        </span>
    );
}

type TBodyNewArticleProps = { notification: TNotification; onClickUser: (e: React.MouseEvent<HTMLButtonElement>) => void };
function BodyNewArticle({ notification, onClickUser }: TBodyNewArticleProps) {
    return (
        <span className="truncate text-sm">
            <button onClick={onClickUser} className="text-muted-foreground hover:underline">
                {notification.Users_Notifications_actorIdToUsers?.name}
            </button>{" "}
            posted a new article
        </span>
    );
}

type TBodyNewCommentProps = { title?: string | null; unreadCount: number };
function BodyNewComment({ title, unreadCount }: TBodyNewCommentProps) {
    const prefix = unreadCount > 0 ? `${unreadCount} new ${unreadCount > 1 ? "comments" : "comment"} on` : "Comments on";
    return (
        <span className="truncate text-sm">
            <span className="text-muted-foreground">{prefix}</span> <span className="font-medium">{title ?? "your article"}</span>
        </span>
    );
}

// ----- Actions (badge + nút Read) -----
type TNotificationActionsProps = { isUnread: boolean; unreadCount: number; onRead: () => void };
function NotificationActions({ isUnread, unreadCount, onRead }: TNotificationActionsProps) {
    if (!isUnread) return null;

    return (
        <div className="ml-auto relative w-20 h-8">
            {unreadCount > 0 && (
                <div className="absolute right-14 top-1/2 -translate-y-1/2">
                    <span className="inline-flex items-center justify-center rounded-md bg-blue-600 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                </div>
            )}

            <motion.div {...dotMotionProps} />
            <motion.div {...buttonMotionProps}>
                <Button variant="secondary" size="sm" onClick={onRead}>
                    Read
                </Button>
            </motion.div>
        </div>
    );
}

// ----- Card hiển thị từng thông báo -----
type TNotificationCardProps = { notification: TNotification; onRead: (id: string) => void; onNavigate: (notification: TNotification) => void };
function NotificationCard({ notification, onRead, onNavigate }: TNotificationCardProps) {
    // const borderClass = getBorderClassByType(notification.type);
    const unreadCount = notification.type === NotificationType.NEW_COMMENT ? parseUnreadCount(notification.extend) : 0;
    const isUnread = notification.type === NotificationType.NEW_COMMENT ? unreadCount > 0 : !notification.isRead;

    const handleClickUser = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const username = notification.Users_Notifications_actorIdToUsers?.username;
        if (username) {
            window.location.assign(`/${username}`);
        }
    };

    return (
        <motion.div
            key={notification.id}
            className={cn(
                "group relative flex items-start gap-3 p-3 cursor-pointer",
                // borderClass,
                isUnread ? "bg-muted/70 hover:bg-muted" : "bg-transparent hover:bg-muted/50"
            )}
            variants={rowVariants}
            initial="rest"
            animate="rest"
            whileHover="hover"
            tabIndex={0}
            onClick={() => onNavigate(notification)}
        >
            <div className="mt-0.5">
                <LeadingVisual notification={notification} />
            </div>

            <div className="grid flex-1 text-left leading-tight">
                <TitleByType type={notification.type} />

                {notification.type === NotificationType.FOLLOW && <BodyFollow notification={notification} onClickUser={handleClickUser} />}

                {notification.type === NotificationType.NEW_ARTICLE && <BodyNewArticle notification={notification} onClickUser={handleClickUser} />}

                {notification.type === NotificationType.NEW_COMMENT && (
                    <BodyNewComment title={notification.Articles?.title} unreadCount={unreadCount} />
                )}

                <span className="truncate text-xs text-muted-foreground">{formatLocalTime(notification.createdAt, "ago")}</span>
            </div>

            <NotificationActions
                isUnread={isUnread}
                unreadCount={unreadCount}
                onRead={(e?: any) => {
                    // chặn bubble nếu bấm “Read”
                    if (e?.stopPropagation) e.stopPropagation();
                    onRead(notification.id);
                }}
            />
        </motion.div>
    );
}

// ----- Feed chính: dữ liệu tách theo mode, UI sạch -----
export default function NotificationFeed({ mode }: { mode: FeedMode }) {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [notifications, setNotifications] = useState<TNotification[]>([]);
    const pageSize = 10;
    const totalPageRef = useRef(0);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const queryClient = useQueryClient();

    const getAllNotification = useGetAllNotification({
        pagination: { page: page, pageSize },
        filters: mode === "unread" ? { isRead: false } : {},
        sort: { sortBy: "createdAt", isDesc: true },
    });

    const readNotification = useReadNotification();

    useEffect(() => {
        const items = getAllNotification.data?.items;
        if (!items) return;
        setNotifications((prev) => {
            if (page === 1) return items;
            const map = new Map(prev.map((n) => [n.id, n]));
            for (const it of items) map.set(it.id, it); // dedupe
            return Array.from(map.values());
        });
    }, [getAllNotification.data?.items, page]);

    useEffect(() => {
        if (getAllNotification.data?.totalPage) totalPageRef.current = getAllNotification.data.totalPage;
    }, [getAllNotification.data?.totalPage]);

    const itemWidth = 300;
    const gap = 20;
    const skeletonCount = useFillSkeletons(containerRef, itemWidth, notifications.length, gap);

    const handleEndReached = () => {
        if (getAllNotification.isFetching || getAllNotification.isLoading || page >= totalPageRef.current) return;
        setPage((p) => p + 1);
    };

    const handleRead = (id: string) => {
        readNotification.mutate(id, {
            onSuccess: () => {
                getAllNotification.refetch();
                queryClient.invalidateQueries({ queryKey: ["count-unread-notification"] });
            },
        });
    };

    const handleNavigate = (notification: TNotification) => {
        navigateByType(router, notification);
    };

    return (
        <div ref={containerRef} className="relative h-[300px] overflow-y-auto rounded-b-xl">
            <div className="relative flex flex-col min-h-[calc(100%-4px)]">
                <AppendLoading
                    isLoading={getAllNotification.isLoading}
                    isEmpty={notifications.length === 0}
                    isError={getAllNotification.isError}
                    onLoadMore={handleEndReached}
                    containerRef={containerRef}
                    footerLoadingComponent={Array.from({ length: skeletonCount }).map((_, i) => (
                        <Skeleton key={i} className="min-h-[54px] h-full w-full rounded-xl" />
                    ))}
                    initialLoadingComponent={Array.from({ length: skeletonCount }).map((_, i) => (
                        <Skeleton key={i} className="h-[54px] w-full rounded-xl" />
                    ))}
                    noDataComponent={<NodataOverlay visible />}
                >
                    {notifications.map((notification) => (
                        <NotificationCard key={notification.id} notification={notification} onRead={handleRead} onNavigate={handleNavigate} />
                    ))}
                </AppendLoading>
            </div>
        </div>
    );
}
