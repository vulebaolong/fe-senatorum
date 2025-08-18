import { useEffect, useState } from "react";
import { useDebouncedCallback } from "@mantine/hooks";
import { useArticleUnVote, useArticleVote } from "@/api/tantask/article-vote.tanstack";
import ButtonIcon from "@/components/custom/button-custom/button-icon";
import IconArrowDown from "@/components/icon/icon-arrow-down";
import IconArrowUp from "@/components/icon/icon-arrow-up";
import AnimatedScore from "@/components/animated-score/AnimatedScore";

type VoteValue = -1 | 0 | 1;

interface ArticleVoteProps {
    articleId: string;
    /** Điểm hiện tại (tổng up - down) lấy từ server */
    initialScore?: number;
    /** Vote hiện tại của user: 1 (up), -1 (down), 0/null (chưa vote) */
    initialMyVote?: VoteValue | null;
    /** Disable toàn bộ nút (ví dụ user chưa đăng nhập) */
    disabled?: boolean;
    /** Callback khi client cập nhật (sau optimistic) */
    onChange?: (state: { score: number; myVote: VoteValue }) => void;
    /** Thời gian debounce API (ms) */
    debounceMs?: number;
}

export default function ArticleVote({
    articleId,
    initialScore = 0,
    initialMyVote = 0,
    disabled = false,
    onChange,
    debounceMs = 300,
}: ArticleVoteProps) {
    const articleVote = useArticleVote();
    const articleUnVote = useArticleUnVote();

    // Local state (optimistic)
    const [score, setScore] = useState<number>(initialScore);
    const [myVote, setMyVote] = useState<VoteValue>((initialMyVote ?? 0) as VoteValue);

    // Sync khi props thay đổi (refetch từ parent)
    useEffect(() => setScore(initialScore), [initialScore]);
    useEffect(() => setMyVote((initialMyVote ?? 0) as VoteValue), [initialMyVote]);

    // Debounce API: chỉ gửi trạng thái CUỐI CÙNG sau khi user dừng click
    const sendVoteDebounced = useDebouncedCallback(
        async (intent: VoteValue) => {
            try {
                if (intent === 0) {
                    await articleUnVote.mutateAsync({ articleId });
                } else {
                    await articleVote.mutateAsync({ articleId, value: intent as 1 | -1 });
                }
                // Nếu bạn dùng TanStack Query để fetch score/myVote ở parent,
                // có thể invalidate tại đây để đồng bộ chắc chắn.
            } catch (e) {
                console.error("Vote API error:", e);
                // Không revert UI để giữ trải nghiệm mượt. Tuỳ nhu cầu có thể hiện toast.
            }
        },
        {
            delay: debounceMs,
            leading: false,
            flushOnUnmount: true,
        }
    );

    // Cập nhật optimistic ngay khi click
    const applyOptimistic = (nextVote: VoteValue) => {
        const prevVote = myVote;
        const delta = nextVote - prevVote; // ví dụ -1→1 = +2, 1→0 = -1, 0→-1 = -1
        setMyVote(nextVote);
        setScore((prev) => {
            const nextScore = prev + delta;
            onChange?.({ score: nextScore, myVote: nextVote });
            return nextScore;
        });
        // lên lịch gửi API theo ý định cuối
        sendVoteDebounced(nextVote);
    };

    const handleUpvote = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (disabled) return; // chỉ tắt khi bạn chủ động disable (VD: chưa đăng nhập)
        const nextVote: VoteValue = myVote === 1 ? 0 : 1; // toggle
        applyOptimistic(nextVote);
    };

    const handleDownvote = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (disabled) return;
        const nextVote: VoteValue = myVote === -1 ? 0 : -1; // toggle
        applyOptimistic(nextVote);
    };

    // Helper class
    const cx = (...args: Array<string | false | null | undefined>) => args.filter(Boolean).join(" ");

    const upActive = myVote === 1;
    const downActive = myVote === -1;

    return (
        <div
            className={cx(
                "flex items-center w-min gap-1 p-0.5 rounded-lg border border-border-subtlest-tertiary",
                disabled && "opacity-50 pointer-events-none"
            )}
            aria-label="Article vote"
            role="group"
        >
            <ButtonIcon
                variant="ghost"
                size="icon"
                className={cx("size-6 transition-colors", "hover:text-emerald-600")}
                aria-pressed={upActive}
                aria-label={upActive ? "Bỏ upvote" : "Upvote"}
                onClick={handleUpvote}
                disabled={disabled}
            >
                <IconArrowUp className={cx("w-6 h-6 pointer-events-none", upActive && "text-emerald-600")} isUp={upActive} />
            </ButtonIcon>

            {/* <p className="text-sm font-semibold min-w-[2ch] text-center tabular-nums">{score}</p> */}
            <AnimatedScore value={score} className="text-sm font-semibold min-w-[2ch] text-center tabular-nums" />

            <ButtonIcon
                variant="ghost"
                size="icon"
                className={cx("size-6 transition-colors", "hover:text-rose-600")}
                aria-pressed={downActive}
                aria-label={downActive ? "Bỏ downvote" : "Downvote"}
                onClick={handleDownvote}
                disabled={disabled}
            >
                <IconArrowDown className={cx("w-6 h-6 pointer-events-none", downActive && "text-rose-600")} isDown={downActive} />
            </ButtonIcon>
        </div>
    );
}
