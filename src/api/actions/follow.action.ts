"use server";

import { ENDPOINT } from "@/constant/endpoint.constant";
import { TRes, TResAction } from "@/types/app.type";
import { TFollowCountRes, TFollowReq } from "@/types/follow.type";
import api from "../core.api";
import { TUser } from "@/types/user.type";

export async function followAction(payload: TFollowReq): Promise<TResAction<boolean | null>> {
    try {
        const result = await api.post<TRes<boolean>>(ENDPOINT.FOLLOW.FOLLOW, payload);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function unfollowAction(payload: TFollowReq): Promise<TResAction<boolean | null>> {
    try {
        const result = await api.delete<TRes<boolean>>(`${ENDPOINT.FOLLOW.UN_FOLLOW}/${payload.followingId}`);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function getCountFollowAction(userId: TUser[`id`]): Promise<TResAction<TFollowCountRes | null>> {
    try {
        const result = await api.get<TRes<TFollowCountRes>>(`${ENDPOINT.FOLLOW.GET_COUNT_FOLLOW}/${userId}`);
        const { data } = result;
        console.log({ getCountFollowAction: data });
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}
