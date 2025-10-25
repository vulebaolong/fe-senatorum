"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useDebouncedCallback } from "@mantine/hooks";
import { useAddBookmark, useRemoveBookmark } from "@/api/tantask/article-bookmark.tanstack";
import { TArticle } from "@/types/article.type";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import { ROUTER_CLIENT } from "@/constant/router.constant";
// optional: import toast from "@/components/ui/use-toast";

type TProps = {
    articleId: TArticle["id"];
    initial?: boolean;
    debounceMs?: number;
    variant?: "default" | "link" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
};

export default function ArticleBookmark({ articleId, initial = false, debounceMs = 300, variant = "ghost" }: TProps) {
    const addBookmark = useAddBookmark();
    const removeBookmark = useRemoveBookmark();
    const info = useAppSelector((state) => state.user.info);
    const router = useRouter();

    // UI state (optimistic)
    const [isBookmarked, setIsBookmarked] = useState<boolean>(initial);

    // lưu “trạng thái người dùng muốn” gần nhất
    const desiredRef = useRef<boolean>(initial);
    useEffect(() => {
        desiredRef.current = isBookmarked;
    }, [isBookmarked]);

    // chống race: chỉ nhận kết quả của lần commit mới nhất
    const seqRef = useRef(0);

    // Debounce 300ms: chỉ gọi API với trạng thái cuối cùng
    const commit = useDebouncedCallback(
        async () => {
            const desired = desiredRef.current;
            const seq = ++seqRef.current;

            try {
                if (desired) {
                    await addBookmark.mutateAsync({ articleId });
                } else {
                    await removeBookmark.mutateAsync({ articleId });
                }
                // chỉ áp dụng kết quả nếu đây là commit mới nhất
                if (seq !== seqRef.current) return;
                // (optional) toast.success(desired ? "Bookmarked" : "Unbookmarked");
            } catch (e) {
                if (seq !== seqRef.current) return; // kết quả cũ -> bỏ
                // Revert UI khi lỗi
                setIsBookmarked((prev) => !prev);
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
        setIsBookmarked((prev) => {
            const next = !prev;
            desiredRef.current = next;
            commit();
            return next;
        });
    };

    return (
        <Button onClick={onClick} size="icon" className="size-6" variant={variant} aria-pressed={isBookmarked}>
            <Bookmark
                // style={{ width: 15, height: 15 }}
                className="transition-transform text-muted-foreground"
                // tô màu khi đã bookmark
                fill={isBookmarked ? "currentColor" : "none"}
            />
        </Button>
    );
}
