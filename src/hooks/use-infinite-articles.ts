import { useInfiniteQuery } from "@tanstack/react-query";
import {
    getAllArticleAction,
    getMyArticleAction,
    getMyBookmarkedArticleAction,
    getMyHeartArticleAction,
    getMyUpvotedArticleAction,
} from "@/api/actions/article.action";

type UseInfiniteArticlesParams = {
    type: "all" | "my" | "upvoted" | "bookmarked" | "heart";
    pageSize?: number;
    filters?: Record<string, any>;
    id?: string; // nếu cần, ví dụ feed user khác
    sort?: { sortBy?: string; isDesc?: boolean };
};

export function useInfiniteArticles({
    type,
    pageSize = 8,
    filters = {},
    id,
    sort = { sortBy: "createdAt", isDesc: true },
}: UseInfiniteArticlesParams) {
    async function fetchPage({ pageParam = 1 }: { pageParam?: number }) {
        const query = `page=${pageParam}&pageSize=${pageSize}&filters=${encodeURIComponent(JSON.stringify(filters))}&sortBy=${sort.sortBy}&isDesc=${
            sort.isDesc
        }${id ? `&id=${id}` : ""}`;

        // Gọi đúng action theo type
        if (type === "all") {
            const { data, status, message } = await getAllArticleAction(query);
            if (status === "error" || !data) throw new Error(message);
            return data;
        }
        if (type === "my") {
            const { data, status, message } = await getMyArticleAction(query);
            if (status === "error" || !data) throw new Error(message);
            return data;
        }
        if (type === "upvoted") {
            const { data, status, message } = await getMyUpvotedArticleAction(query);
            if (status === "error" || !data) throw new Error(message);
            return data;
        }
        if (type === "bookmarked") {
            const { data, status, message } = await getMyBookmarkedArticleAction(query);
            if (status === "error" || !data) throw new Error(message);
            return data;
        }
        // heart
        const { data, status, message } = await getMyHeartArticleAction(query);
        if (status === "error" || !data) throw new Error(message);
        return data;
    }

    return useInfiniteQuery({
        queryKey: ["infinite-articles", type, filters, id, sort, pageSize],
        initialPageParam: 1,
        queryFn: fetchPage,
        getNextPageParam: (lastPage) => {
            return lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined;
        },
    });
}
