import { TArticleBookmarkReq } from "@/types/article-bookmark.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addBookmarkAction, getAllArticleBookmarkAction, removeBookmarkAction, toggleArticleBookmarkAction } from "../actions/article-bookmark.action";
import _ from "lodash";

export const useToggleArticleBookmark = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: TArticleBookmarkReq) => {
            const { data, status, message } = await toggleArticleBookmarkAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useToggleArticleBookmark: data });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`get-all-article-bookmark`] });
        },
    });
};

export const useGetAllArticleBookmark = () => {
    return useQuery({
        queryKey: ["get-all-article-bookmark"],
        queryFn: async () => {
            const { data, status, message } = await getAllArticleBookmarkAction();
            if (status === "error" || data === null) throw new Error(message);

            const dataKey = _.keyBy(data, "articleId");
            console.log({ useGetAllArticleBookmark: dataKey });
            return dataKey;
        },
    });
};

export const useAddBookmark = () => {
    return useMutation({
        mutationFn: async (payload: TArticleBookmarkReq) => {
            const { data, status, message } = await addBookmarkAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useAddBookmark: data });
            return data;
        },
    });
};

export const useRemoveBookmark = () => {
    return useMutation({
        mutationFn: async (payload: TArticleBookmarkReq) => {
            const { data, status, message } = await removeBookmarkAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useRemoveBookmark: data });
            return data;
        },
    });
};
