"use server";

import { ENDPOINT } from "@/constant/endpoint.constant";
import { TRes, TResAction } from "@/types/app.type";
import { TCategory } from "@/types/category.type";
import api from "../core.api";

export async function getListCategoryArticleAction(): Promise<TResAction<TCategory[] | null>> {
    try {
        const { message, data } = await api.get<TRes<TCategory[]>>(`${ENDPOINT.CATEGORY.CATEGORY}`);
        console.log({ getListCategoryArticleAction: data });
        return { status: "success", message: message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}
