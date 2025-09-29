"use server";

import { TArticleBookmark, TArticleBookmarkReq } from "@/types/article-bookmark.type";
import api from "../core.api";
import { ENDPOINT } from "@/constant/endpoint.constant";
import { TRes } from "@/types/app.type";

export async function toggleArticleBookmarkAction(payload: TArticleBookmarkReq) {
    try {
        const result = await api.post<TRes<boolean>>(`${ENDPOINT.ARTICLE_BOOKMARK.BOOKMARK_TOGGLE}`, payload);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function getAllArticleBookmarkAction() {
    try {
        const result = await api.get<TRes<TArticleBookmark[]>>(`${ENDPOINT.ARTICLE_BOOKMARK.BOOKMARK_ALL}`);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function addBookmarkAction(payload: TArticleBookmarkReq) {
    try {
        const result = await api.post<TRes<boolean>>(`${ENDPOINT.ARTICLE_BOOKMARK.BOOKMARK_ADD}/${payload.articleId}`);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function removeBookmarkAction(payload: TArticleBookmarkReq) {
    try {
        const result = await api.delete<TRes<boolean>>(`${ENDPOINT.ARTICLE_BOOKMARK.BOOKMARK_REMOVE}/${payload.articleId}`);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}
