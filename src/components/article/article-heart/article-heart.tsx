"use client";

import { useAddHeart, useRemoveHeart } from "@/api/tantask/article-heart.tanstack";
import AnimatedScore from "@/components/animated-score/AnimatedScore";
import { Button } from "@/components/ui/button";
import { ROUTER_CLIENT } from "@/constant/router.constant";
import { formatCompactIntl } from "@/helpers/function.helper";
import { useAppSelector } from "@/redux/store";
import { TArticle } from "@/types/article.type";
import { useDebouncedCallback } from "@mantine/hooks";
import { Bookmark, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
// optional: import toast from "@/components/ui/use-toast";

type TProps = {
    articleId: TArticle["id"];
    heartCountInit: number;
    initial?: boolean;
    debounceMs?: number;
};

export default function ArticleHeart({ articleId, heartCountInit, initial = false, debounceMs = 300 }: TProps) {
    const addHeart = useAddHeart();
    const removeHeart = useRemoveHeart();
    const info = useAppSelector((state) => state.user.info);
    const router = useRouter();
    const [heartCount, setHeartCount] = useState(heartCountInit);

    // UI state (optimistic)
    const [isHeart, setIsHeart] = useState<boolean>(initial);

    // lưu “trạng thái người dùng muốn” gần nhất
    const desiredRef = useRef<boolean>(initial);
    useEffect(() => {
        desiredRef.current = isHeart;
    }, [isHeart]);

    // chống race: chỉ nhận kết quả của lần commit mới nhất
    const seqRef = useRef(0);

    // Debounce 300ms: chỉ gọi API với trạng thái cuối cùng
    const commit = useDebouncedCallback(
        async () => {
            const desired = desiredRef.current;
            const seq = ++seqRef.current;

            try {
                if (desired) {
                    await addHeart.mutateAsync({ articleId });
                } else {
                    await removeHeart.mutateAsync({ articleId });
                }
                // chỉ áp dụng kết quả nếu đây là commit mới nhất
                if (seq !== seqRef.current) return;
                // (optional) toast.success(desired ? "Bookmarked" : "Unbookmarked");
            } catch (e) {
                if (seq !== seqRef.current) return; // kết quả cũ -> bỏ
                // Revert UI khi lỗi
                setIsHeart((prev) => !prev);
                // (optional) toast.error("Update bookmark failed");
            }
        },
        {
            delay: debounceMs,
            leading: false,
            flushOnUnmount: true,
        }
    );

    const onClick = (e: React.MouseEvent) => {
        if (!info) {
            router.push(ROUTER_CLIENT.LOGIN);
            return;
        }
        e.stopPropagation();
        // Toggle UI ngay, ghi nhận “ý định” rồi để debounce commit
        setIsHeart((prev) => {
            if (prev) {
                setHeartCount((prev1) => prev1 - 1);
            } else {
                setHeartCount((prev1) => prev1 + 1);
            }
            const next = !prev;
            desiredRef.current = next;
            commit();
            return next;
        });
    };

    return (
        <Button onClick={onClick} size="icon" className="h-6 px-[5px] rounded-lg w-auto" variant={"ghost"} aria-pressed={isHeart}>
            <div className="flex items-center gap-1 justify-center">
                <Heart
                    // style={{ width: 16, height: 16 }}
                    className="transition-transform"
                    // tô màu khi đã bookmark
                    color="#fe0169"
                    fill={isHeart ? "#fe0169" : "none"}
                />
                {heartCount > 0 && (
                    <AnimatedScore
                        value={heartCount}
                        className="font-semibold text-center text-muted-foreground"
                        fontPx={12} // khớp text-sm
                        maxDigits={1} // khóa bề rộng 3 chữ số (000..999) trước khi compact
                        compact // hiển thị 1.2K, 3.4M...
                        compactDecimals={1}
                    />
                )}
            </div>
        </Button>
    );
}
