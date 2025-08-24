// src/hooks/use-article-view.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { TArticle } from "@/types/article.type";
import { articleViewAction } from "../actions/article-view.action";
import { TArticleViewReq } from "@/types/article-view.type";

/**
 * Dùng thủ công: const { mutate, isPending } = useArticleViewMutation();
 * mutate(articleId)
 */
export function useArticleView() {
    return useMutation({
        mutationFn: async (payload: TArticleViewReq) => {
            const { data, status, message } = await articleViewAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            return true;
        },
    });
}
