"use server";

import { ENDPOINT } from "@/constant/endpoint.constant";
import { TRes, TResAction, TResPagination } from "@/types/app.type";
import { TEditProfileReq, TUser } from "@/types/user.type";
import api from "../core.api";

export async function uploadAvatarAction(): Promise<TResAction<boolean | null>> {
    try {
        const result = await api.post<TRes<boolean>>(ENDPOINT.USER.UPLOAD_AVATAR);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function deleteAvatarAction(): Promise<TResAction<boolean | null>> {
    try {
        const result = await api.delete<TRes<boolean>>(ENDPOINT.USER.DELETE_AVATAR);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function uploadAvatarDraftAction(payload: FormData): Promise<TResAction<string | null>> {
    try {
        const result = await api.post<TRes<string>>(ENDPOINT.USER.UPLOAD_AVATAR_DRAFT, payload);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function deleteAvatarDraftAction(): Promise<TResAction<boolean | null>> {
    try {
        const result = await api.delete<TRes<boolean>>(ENDPOINT.USER.DELETE_AVATAR_DRAFT);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function findAllUserAction(): Promise<TResAction<TResPagination<TUser> | null>> {
    try {
        const result = await api.get<TRes<TResPagination<TUser>>>(`${ENDPOINT.USER.USER}?pageSize=100`);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function getDetailUserAction(userId: string): Promise<TResAction<TUser | null>> {
    try {
        const result = await api.get<TRes<TUser>>(`${ENDPOINT.USER.USER}/${userId}`);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function searchNameUserAction(filters: string): Promise<TResAction<TResPagination<TUser> | null>> {
    try {
        const queryFilters = { name: filters };
        const result = await api.get<TRes<TResPagination<TUser>>>(
            `${ENDPOINT.USER.USER}?pageSize=100&page=1&filters=${JSON.stringify(queryFilters)}`
        );
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function editProfileAction(payload: TEditProfileReq): Promise<TResAction<any | null>> {
    try {
        const result = await api.patch<TRes<any>>(`${ENDPOINT.USER.USER_EDIT_PROFILE}`, payload);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}
