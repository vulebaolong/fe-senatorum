"use server";

import { ENDPOINT } from "@/constant/endpoint.constant";
import { TRes, TResAction, TResPagination } from "@/types/app.type";
import { TChatGroup } from "@/types/chat.type";
import api from "../core.api";


export async function findAllChatGroupOneAction(): Promise<TResAction<TResPagination<TChatGroup> | null>> {
    try {
        const result = await api.get<TRes<TResPagination<TChatGroup>>>(`${ENDPOINT.CHAT_GROUP.CHAT_GROUP}?pageSize=100&isOne=true`);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function findAllChatGroupManyAction(): Promise<TResAction<TResPagination<TChatGroup> | null>> {
    try {
        const result = await api.get<TRes<TResPagination<TChatGroup>>>(`${ENDPOINT.CHAT_GROUP.CHAT_GROUP}?pageSize=100&isOne=false`);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}
