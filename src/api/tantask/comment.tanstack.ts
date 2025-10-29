import { TCreateCommentReq, TDeleteComment, TUpdateComment } from "@/types/comment.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCommentAction, deleteCommentAction, getCommentByArticleAction, updateCommentAction } from "../actions/comment.action";
import { toast } from "sonner";
import { resError } from "@/helpers/function.helper";

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
            const { page, pageSize } = pagination;
            const query = `page=${page}&pageSize=${pageSize}&filters=${JSON.stringify(filters)}&sortBy=${sort?.sortBy}&isDesc=${sort?.isDesc}`;

            const { data, status, message } = await getCommentByArticleAction(query);
            if (status === "error" || data === null) throw new Error(message);

            console.log({ useGetCommentByArticle: data });
            return data;
        },
        placeholderData: (prev) => prev, // giữ dữ liệu cũ trong lúc refetch
    });
};

export const useMutationCommentByParent = () => {
    return useMutation({
        mutationKey: ["get-comment-by-parent"],
        mutationFn: async (payload: any) => {
            console.log(123);
            const { pagination, filters, sort } = payload;
            const { page, pageSize } = pagination;
            const query = `page=${page}&pageSize=${pageSize}&filters=${JSON.stringify(filters)}&sortBy=${sort?.sortBy}&isDesc=${sort?.isDesc}`;

            console.log(query);

            const { data, status, message } = await getCommentByArticleAction(query);
            if (status === "error" || data === null) throw new Error(message);

            console.log({ useMutationCommentByParent: data });
            return data;
        },
    });
};

export const useUpdateComment = () => {
    return useMutation({
        mutationFn: async (payload: TUpdateComment) => {
            const { data, status, message } = await updateCommentAction(payload);
            if (status === "error" || data === null) throw new Error(message);

            console.log({ useMutationCommentByParent: data });
            return data;
        },
    });
};

export const useDeleteComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: TDeleteComment) => {
            const { data, status, message } = await deleteCommentAction(payload);
            if (status === "error" || data === null) throw new Error(message);

            console.log({ useDeleteComment: data });
            return data;
        },
        onSuccess: () => {
            // queryClient.invalidateQueries({ queryKey: [`get-comment-by-parent`] });
            // queryClient.invalidateQueries({ queryKey: [`get-comment-by-article`] });
        },
        onError: (error) => {
            toast.error(resError(error, `Delete comment failed`));
        },
    });
};
