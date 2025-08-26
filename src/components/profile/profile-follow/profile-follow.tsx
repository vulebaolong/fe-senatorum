import { useFollow, useUnfollow } from "@/api/tantask/follow.action";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux/hooks";
import { TUser } from "@/types/user.type";
import { useDebouncedCallback } from "@mantine/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { UserCheck, UserPlus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type TProps = {
    user: TUser | null;
    debounceMs?: number; // mặc định 300ms
};

export default function ProfileFollow({ user, debounceMs = 300 }: TProps) {
    const info = useAppSelector((state) => state.user.info);

    // initial theo data hiện có
    const initial = (user?.Follows_Follows_followingIdToUsers || []).length > 0;

    // UI state (optimistic)
    const [isFollow, setIsFollow] = useState<boolean>(initial);

    // Nếu User thay đổi (sang trang khác), sync lại initial & reset seq
    const seqRef = useRef(0);
    useEffect(() => {
        const nextInitial = (user?.Follows_Follows_followingIdToUsers || []).length > 0;
        setIsFollow(nextInitial);
        desiredRef.current = nextInitial;
        seqRef.current = 0;
    }, [user?.id]);

    const follow = useFollow();
    const unfollow = useUnfollow();

    // Giữ "ý định cuối" của user (tránh stale khi debounce)
    const desiredRef = useRef<boolean>(initial);
    useEffect(() => {
        desiredRef.current = isFollow;
    }, [isFollow]);

    // Debounce commit + chống race (chỉ chấp nhận kết quả mới nhất)
    const commit = useDebouncedCallback(
        async () => {
            if (!user?.id) return;

            const desired = desiredRef.current;
            const seq = ++seqRef.current;

            try {
                if (desired) {
                    await follow.mutateAsync({ followingId: user.id });
                } else {
                    await unfollow.mutateAsync({ followingId: user.id });
                }

                // Nếu đã có commit mới hơn thì bỏ qua kết quả cũ
                if (seq !== seqRef.current) return;

                // (optional) toast.success(desired ? "Following" : "Unfollowed");
            } catch (e) {
                // Nếu là commit cũ thì bỏ; còn mới nhất thì revert UI
                if (seq !== seqRef.current) return;
                setIsFollow((prev) => !prev);
                // (optional) toast.error("Update follow failed");
            }
        },
        {
            delay: debounceMs,
            leading: false,
            flushOnUnmount: true, // giống ArticleBookmark
        }
    );

    // Hủy hẹn khi unmount (ưu tiên không gửi gì khi rời trang)
    // useEffect(() => () => commit.cancel(), [commit]);

    const onClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user?.id || user.id === info?.id) return;

        // Toggle UI ngay (optimistic) + ghi ý định rồi để debounce commit
        setIsFollow((prev) => {
            const next = !prev;
            desiredRef.current = next;
            commit();
            return next;
        });
    };

    // (optional) vô hiệu hóa khi có request đang bay
    const inFlight = follow.isPending || unfollow.isPending;

    if (!user?.id || user.id === info?.id) return null;

    return (
        <Button
            onClick={onClick}
            className="gap-2 w-[120px] transition-colors duration-200 ease-out relative overflow-hidden"
            size="sm"
            variant={isFollow ? "outline" : "default"}
            aria-pressed={isFollow}
        >
            {/* đảm bảo vùng hiển thị cố định, tránh giật layout */}
            <div className="relative h-5 w-full">
                <AnimatePresence initial={false} mode="wait">
                    {isFollow ? (
                        <motion.div
                            key="following"
                            className="absolute inset-0 flex items-center justify-center gap-2"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.18 }}
                        >
                            <UserCheck className="w-4 h-4" />
                            <span>Following</span>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="follow"
                            className="absolute inset-0 flex items-center justify-center gap-2"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.18 }}
                        >
                            <UserPlus className="w-4 h-4" />
                            <span>Follow</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Button>
    );
}
