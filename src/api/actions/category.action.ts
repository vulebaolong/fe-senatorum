"use server";

import { ENDPOINT } from "@/constant/endpoint.constant";
import { TRes, TResAction, TResPagination } from "@/types/app.type";
import { TCategory } from "@/types/category.type";
import api from "../core.api";

export async function getListCategoryArticleAction(): Promise<TResAction<TResPagination<TCategory> | null>> {
    try {
        const result = await api.get<TRes<TResPagination<TCategory>>>(`${ENDPOINT.CATEGORY.CATEGORY}?pageSize=9999`);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}
