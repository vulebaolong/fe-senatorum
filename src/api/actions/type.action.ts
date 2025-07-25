"use server";

import { ENDPOINT } from "@/constant/endpoint.constant";
import { TRes, TResAction, TResPagination } from "@/types/app.type";
import { TType } from "@/types/type.type";
import api from "../core.api";

export async function getListTypeArticleAction(): Promise<TResAction<TResPagination<TType> | null>> {
    try {
        const result = await api.get<TRes<TResPagination<TType>>>(`${ENDPOINT.TYPE.TYPE}?pageSize=9999`);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}
