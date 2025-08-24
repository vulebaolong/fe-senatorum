"use server";

import { ENDPOINT } from "@/constant/endpoint.constant";
import { TRes } from "@/types/app.type";
import { TArticleViewReq } from "@/types/article-view.type";
import api from "../core.api";

export async function articleViewAction(payload: TArticleViewReq) {
    try {
        const result = await api.post<TRes<boolean>>(`${ENDPOINT.ARTICLE_VIEW.ARTICLE_VIEW}/${payload.articleId}/view`, payload);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}
