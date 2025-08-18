"use server";

import { ENDPOINT } from "@/constant/endpoint.constant";
import { TRes } from "@/types/app.type";
import { TArticleUnVoteReq, TArticleVoteReq } from "@/types/article-vote.type";
import api from "../core.api";

export async function articleVoteAction({ articleId, value }: TArticleVoteReq) {
    try {
        const result = await api.post<TRes<boolean>>(`${ENDPOINT.ARTICLE_VOTE.ARTICLE_VOTE}/${articleId}`, { value });
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function articleUnVoteAction({ articleId }: TArticleUnVoteReq) {
    try {
        const result = await api.delete<TRes<boolean>>(`${ENDPOINT.ARTICLE_VOTE.ARTICLE_VOTE}/${articleId}`);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}
