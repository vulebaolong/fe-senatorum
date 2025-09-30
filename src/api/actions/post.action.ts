"use server";

import { ENDPOINT } from "@/constant/endpoint.constant";
import { TRes, TResAction } from "@/types/app.type";
import { TArticle } from "@/types/article.type";
import api from "../core.api";
import { TUpsertPostDarftReq } from "@/types/post.type";

export async function getDraftPostAction(): Promise<TResAction<TArticle | null>> {
    try {
        const result = await api.get<TRes<TArticle | null>>(`${ENDPOINT.POST.POST_GET_DRAFT}`);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function upsertPostDraftAction(payload: TUpsertPostDarftReq): Promise<TResAction<TArticle | null>> {
    try {
        const result = await api.post<TRes<TArticle>>(ENDPOINT.POST.POST_UPSERT_DRAFT, payload);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function uploadImagePostAction(payload: FormData): Promise<TResAction<string | null>> {
    try {
        const result = await api.post<TRes<string>>(ENDPOINT.POST.POST_UPLOAD_IMAGE, payload);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function deleteImagePostByPublicIdAction(payload: string): Promise<TResAction<boolean | null>> {
    try {
        const result = await api.delete<TRes<boolean>>(`${ENDPOINT.POST.POST_DELETE_IMAGE}/?publicId=${payload}`);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function publishPostAction(): Promise<TResAction<TArticle | null>> {
    try {
        const result = await api.post<TRes<TArticle>>(ENDPOINT.POST.POST_PUBLISH);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}
