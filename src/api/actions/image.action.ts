"use server";

import { TRes, TResAction } from "@/types/app.type";
import api from "../core.api";
import { ENDPOINT } from "@/constant/endpoint.constant";

export async function uploadImageDraftAction(payload: FormData): Promise<TResAction<any | null>> {
    try {
        console.log({ body: payload });
        const result = await api.post<TRes<any>>(ENDPOINT.IMAGE.DRAFT, payload);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function deleteImageDraftAction(payload: string): Promise<TResAction<any | null>> {
    try {
        console.log({ body: payload });
        const result = await api.delete<TRes<any>>(`${ENDPOINT.IMAGE.DELETE}/${payload}`);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}
