"use server";

import { TArticleBookmark, TArticleBookmarkReq } from "@/types/article-bookmark.type";
import api from "../core.api";
import { ENDPOINT } from "@/constant/endpoint.constant";
import { TRes } from "@/types/app.type";
import { TArticleHeart, TArticleHeartReq } from "@/types/article-heart.type";

export async function getAllArticleHeartAction() {
    try {
        const result = await api.get<TRes<TArticleHeart[]>>(`${ENDPOINT.ARTICLE_HEART.HEART_ALL}`);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function addHeartAction(payload: TArticleHeartReq) {
    try {
        const result = await api.post<TRes<boolean>>(`${ENDPOINT.ARTICLE_HEART.HEART_ADD}/${payload.articleId}`);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function removeHeartAction(payload: TArticleHeartReq) {
    try {
        const result = await api.delete<TRes<boolean>>(`${ENDPOINT.ARTICLE_HEART.HEART_REMOVE}/${payload.articleId}`);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}
