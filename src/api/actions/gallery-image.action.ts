"use server";

import { TRes, TResAction } from "@/types/app.type";
import { TArticle, TPublishArticleReq, TUpdateArticleReq, TUpsertArticleDarftReq } from "@/types/article.type";
import api from "../core.api";
import { ENDPOINT } from "@/constant/endpoint.constant";

export async function getDraftGalleryImageAction(): Promise<TResAction<TArticle | null>> {
    try {
        const result = await api.get<TRes<TArticle | null>>(`${ENDPOINT.GALLERY_IMAGE.GALLERY_IMAGE_GET_DRAFT}`);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function upSertThumbnailAction(payload: FormData): Promise<TResAction<any | null>> {
    try {
        const result = await api.post<TRes<any>>(ENDPOINT.GALLERY_IMAGE.GALLERY_IMAGE_UPSERT_THUMBNAIL, payload);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function upsertGalleryImageDraftAction(payload: TUpsertArticleDarftReq): Promise<TResAction<TArticle | null>> {
    try {
        const result = await api.post<TRes<TArticle>>(ENDPOINT.GALLERY_IMAGE.GALLERY_IMAGE_UPSERT_DRAFT, payload);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function publishGalleryImageAction(payload: TPublishArticleReq): Promise<TResAction<boolean | null>> {
    try {
        const result = await api.post<TRes<boolean>>(ENDPOINT.GALLERY_IMAGE.GALLERY_IMAGE_PUBLISH, payload);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function getDetailGalleryImageAction(slug: string): Promise<TResAction<TArticle | null>> {
    try {
        const result = await api.get<TRes<TArticle>>(`${ENDPOINT.GALLERY_IMAGE.GALLERY_IMAGE}/${slug}`);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function galleryImageEditAction(payload: TUpdateArticleReq): Promise<TResAction<boolean | null>> {
    try {
        const result = await api.patch<TRes<boolean>>(`${ENDPOINT.GALLERY_IMAGE.GALLERY_IMAGE_EDIT}/${payload.id}`, payload.formData);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}
