import { useMutation } from "@tanstack/react-query";
import { deleteImageDraftAction, uploadImageDraftAction, upSertThumbnailAction } from "../actions/image.action";

export const useUploadImageDraft = () => {
    return useMutation({
        mutationFn: async (payload: FormData) => {
            const { data, status, message } = await uploadImageDraftAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useCreateComment: data });
            return data;
        },
    });
};

export const useUpsertThumbnail = () => {
    return useMutation({
        mutationFn: async (payload: FormData) => {
            const { data, status, message } = await upSertThumbnailAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useUpsertThumbnail: data });
            return data;
        },
    });
};

export const useDeleteImageDraft = () => {
    return useMutation({
        mutationFn: async (payload: string) => {
            const { data, status, message } = await deleteImageDraftAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useCreateComment: data });
            return data;
        },
    });
};
