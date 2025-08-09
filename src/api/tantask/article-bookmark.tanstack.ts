import { TArticleBookmarkReq } from "@/types/article-bookmark.type";
import { useMutation } from "@tanstack/react-query";
import { toggleArticleBookmarkAction } from "../actions/article-bookmark.action";

export const useToggleArticleBookmark = () => {
    return useMutation({
        mutationFn: async (payload: TArticleBookmarkReq) => {
            const { data, status, message } = await toggleArticleBookmarkAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ usePublishArticle: data });
            return data;
        },
    });
};