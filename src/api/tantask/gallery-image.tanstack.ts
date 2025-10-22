import { useMutation, useQuery } from "@tanstack/react-query";
import { galleryImageEditAction, getDraftGalleryImageAction, publishGalleryImageAction, upsertGalleryImageDraftAction, upSertThumbnailAction } from "../actions/gallery-image.action";
import { TPublishArticleReq, TUpdateArticleReq, TUpsertArticleDarftReq } from "@/types/article.type";

export const useGetDraftGalleryImage = () => {
    return useQuery({
        queryKey: ["get-draft-gallery-image"],
        queryFn: async () => {
            const { data, status, message } = await getDraftGalleryImageAction();
            if (status === "error" || data === null) throw new Error(message);

            console.log({ useGetDraftGalleryImage: data });
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

export const useUpsertGalleryImageDarft = () => {
    return useMutation({
        mutationFn: async (payload: TUpsertArticleDarftReq) => {
            const { data, status, message } = await upsertGalleryImageDraftAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useUpsertGalleryImageDarft: data });
            return data;
        },
    });
};

export const usePublishGalleryImage = () => {
    return useMutation({
        mutationFn: async (payload: TPublishArticleReq) => {
            const { data, status, message } = await publishGalleryImageAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ usePublishGalleryImage: data });
            return data;
        },
    });
};

export const useGalleryImageEdit = () => {
    return useMutation({
        mutationFn: async (payload: TUpdateArticleReq) => {
            const { data, status, message } = await galleryImageEditAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useGalleryImageEdit: data });
            return data;
        },
    });
};