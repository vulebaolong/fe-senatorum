import { TArticleHeartReq } from "@/types/article-heart.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { addHeartAction, getAllArticleHeartAction, removeHeartAction } from "../actions/article-heart.action";

export const useGetAllArticleHeart = () => {
    return useQuery({
        queryKey: ["get-all-article-heart"],
        queryFn: async () => {
            const { data, status, message } = await getAllArticleHeartAction();
            if (status === "error" || data === null) throw new Error(message);

            const dataKey = _.keyBy(data, "articleId");
            console.log({ useGetAllArticleHeart: dataKey });
            return dataKey;
        },
    });
};

export const useAddHeart = () => {
    return useMutation({
        mutationFn: async (payload: TArticleHeartReq) => {
            const { data, status, message } = await addHeartAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useAddBookmark: data });
            return data;
        },
    });
};

export const useRemoveHeart = () => {
    return useMutation({
        mutationFn: async (payload: TArticleHeartReq) => {
            const { data, status, message } = await removeHeartAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useRemoveBookmark: data });
            return data;
        },
    });
};
