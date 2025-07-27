import { useMutation } from "@tanstack/react-query";
import { uploadImageDraftAction } from "../actions/image.action";

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