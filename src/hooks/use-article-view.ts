// src/hooks/use-article-view.ts (tiếp)
import { useArticleView } from "@/api/tantask/article-view.tanstack";
import { TArticle } from "@/types/article.type";
import { useEffect, useRef } from "react";

/**
 * Tự động gọi view sau delay khi trang visible.
 * Mặc định TTL 6h để tránh bắn lại trong cùng session.
 */
export function useAutoArticleView(articleId: TArticle["id"], opts?: { enabled?: boolean; delayMs?: number; clientTtlMs?: number }) {
    const { enabled = true, delayMs = 4000, clientTtlMs = 6 * 60 * 60 * 1000 } = opts || {};
    const { mutate, isPending } = useArticleView();
    const firedRef = useRef(false);

    useEffect(() => {
        if (!enabled || !articleId) return;

        // check TTL trong sessionStorage
        const key = `article:view:${articleId}`;
        try {
            const last = Number(sessionStorage.getItem(key) || 0);
            if (Date.now() - last < clientTtlMs) return; // đã bắn trong TTL
        } catch {}

        let timer: any;

        const fire = () => {
            if (firedRef.current) return;
            firedRef.current = true;
            timer = setTimeout(() => {
                mutate({ articleId }, {
                    onSuccess: () => {
                        try {
                            sessionStorage.setItem(key, String(Date.now()));
                        } catch {}
                    },
                    onError: () => {
                        // cho phép thử lại nếu cần: firedRef.current = false;
                    },
                });
            }, delayMs);
        };

        // chỉ chạy khi tab visible
        const onVis = () => {
            if (document.visibilityState === "visible") fire();
        };

        if (typeof document !== "undefined") {
            if (document.visibilityState === "visible") fire();
            document.addEventListener("visibilitychange", onVis);
        }

        return () => {
            clearTimeout(timer);
            document.removeEventListener("visibilitychange", onVis);
        };
    }, [enabled, articleId, delayMs, clientTtlMs, mutate]);

    return { isPending };
}
