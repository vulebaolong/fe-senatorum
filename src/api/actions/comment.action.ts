"use server";

import { ENDPOINT } from "@/constant/endpoint.constant";
import { TRes, TResAction, TResPagination } from "@/types/app.type";
import { TComment, TCreateCommentReq, TDeleteComment, TUpdateComment } from "@/types/comment.type";
import api from "../core.api";

export async function createCommentAction(payload: TCreateCommentReq): Promise<TResAction<TComment | null>> {
    try {
        const result = await api.post<TRes<TComment>>(ENDPOINT.COMMENT.COMMENT, payload);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function getCommentByArticleAction(query: string): Promise<TResAction<TResPagination<TComment> | null>> {
    try {
        const result = await api.get<TRes<TResPagination<TComment>>>(`${ENDPOINT.COMMENT.COMMENT}?${query}`);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function updateCommentAction(payload: TUpdateComment): Promise<TResAction<boolean | null>> {
    try {
        const result = await api.patch<TRes<boolean>>(`${ENDPOINT.COMMENT.UPDATE_COMMENT}/${payload.id}`, { content: payload.content });
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function deleteCommentAction(payload: TDeleteComment): Promise<TResAction<boolean | null>> {
    try {
        const result = await api.delete<TRes<boolean>>(`${ENDPOINT.COMMENT.DELETE_COMMENT}/${payload.id}`);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}
