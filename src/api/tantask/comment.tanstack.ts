import { TCreateCommentReq } from "@/types/comment.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createCommentAction, getCommentByArticleAction } from "../actions/comment.action";

export const useCreateComment = () => {
    return useMutation({
        mutationFn: async (payload: TCreateCommentReq) => {
            const { data, status, message } = await createCommentAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useCreateComment: data });
            return data;
        },
    });
};

export const useGetCommentByArticle = (payload: any) => {
    return useQuery({
        queryKey: ["get-comment-by-article", payload],
        queryFn: async () => {
            const { pagination, filters, sort } = payload;
            const { pageIndex, pageSize } = pagination;
            const query = `page=${pageIndex}&pageSize=${pageSize}&filters=${JSON.stringify(filters)}&sortBy=${sort?.sortBy}&isDesc=${sort?.isDesc}`;

            const { data, status, message } = await getCommentByArticleAction(query);
            if (status === "error" || data === null) throw new Error(message);

            console.log({ useGetCommentByArticle: data });
            return data;
        },
    });
};

export const useMutationCommentByParent = () => {
    return useMutation({
        mutationFn: async (payload: any) => {
            const { pagination, filters, sort } = payload;
            const { pageIndex, pageSize } = pagination;
            const query = `page=${pageIndex}&pageSize=${pageSize}&filters=${JSON.stringify(filters)}&sortBy=${sort?.sortBy}&isDesc=${sort?.isDesc}`;

            const { data, status, message } = await getCommentByArticleAction(query);
            if (status === "error" || data === null) throw new Error(message);
            
            console.log({ useMutationCommentByParent: data });
            return data;
        },
    });
};
