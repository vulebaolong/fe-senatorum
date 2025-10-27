// src/hooks/use-article-view.ts
"use client";

import { TArticleViewReq } from "@/types/article-view.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { articleViewAction, articleViewEasyAction } from "../actions/article-view.action";
import { TArticle } from "@/types/article.type";

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

// export function useArticleViewEasy() {
//     return useMutation({
//         mutationFn: async (payload: TArticleViewReq) => {
//             const { data, status, message } = await articleViewActionEasy(payload);
//             if (status === "error" || data === null) throw new Error(message);
//             return true;
//         },
//     });
// }

export const useArticleViewEasy = (articleId: TArticle["id"]) => {
    return useQuery({
        queryKey: ["article-view", articleId],
        queryFn: async () => {
            const { data, status, message } = await articleViewEasyAction(articleId);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useArticleViewEasy: data });
            return data;
        },
        enabled: !!articleId,
    });
};
