"use server";

import { ENDPOINT } from "@/constant/endpoint.constant";
import { TRes, TResAction } from "@/types/app.type";
import { TType } from "@/types/type.type";
import api from "../core.api";

export async function getListTypeArticleAction(): Promise<TResAction<TType[] | null>> {
    try {
        const result = await api.get<TRes<TType[]>>(`${ENDPOINT.TYPE.TYPE}?pageSize=9999`);
        const { data } = result;
        // console.log({ getListTypeArticleAction: data });
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}
