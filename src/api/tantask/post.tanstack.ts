import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteImagePostByPublicIdAction, getDraftPostAction, publishPostAction, uploadImagePostAction, upsertPostDraftAction } from "../actions/post.action";
import { TUpsertPostDarftReq } from "@/types/post.type";

export const useGetDraftPost = () => {
    return useQuery({
        queryKey: ["get-draft-post"],
        queryFn: async () => {
            const { data, status, message } = await getDraftPostAction();
            if (status === "error" || data === null) throw new Error(message);

            console.log({ useGetDraftPost: data });
            return data;
        },
    });
};

export const useUpsertPostDarft = () => {
    return useMutation({
        mutationFn: async (payload: TUpsertPostDarftReq) => {
            const { data, status, message } = await upsertPostDraftAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useUpsertPostDarft: data });
            return data;
        },
    });
};

export const useUploadImagePost = () => {
    return useMutation({
        mutationFn: async (payload: FormData) => {
            const { data, status, message } = await uploadImagePostAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useUploadImagePost: data });
            return data;
        },
    });
};

export const useDeleteImagePostByPublicId = () => {
    return useMutation({
        mutationFn: async (payload: string) => {
            const { data, status, message } = await deleteImagePostByPublicIdAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useDeleteImagePostByPublicId: data });
            return data;
        },
    });
};

export const usePublishPost = () => {
    return useMutation({
        mutationFn: async () => {
            const { data, status, message } = await publishPostAction();
            if (status === "error" || data === null) throw new Error(message);
            console.log({ usePublishPost: data });
            return data;
        },
    });
};