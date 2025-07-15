"use server";

import { ENDPOINT } from "@/constant/endpoint.constant";
import { clearTokens, setAccessToken, setRefreshToken } from "@/helpers/cookies.helper";
import { TRes, TResAction } from "@/types/app.type";
import { TLoginGoogleWithTotpReq, TLoginMagicLinkReq, TLoginRes, TRegisterReq, TRegisterRes, TVerifyMagicLinkReq } from "@/types/auth.type";
import { TUser } from "@/types/user.type";
import api from "../core.api";

export async function registerAction(payload: TRegisterReq): Promise<TResAction<TRegisterRes | null>> {
    try {
        const result = await api.post<TRes<TRegisterRes>>(ENDPOINT.REGISTER, payload);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function loginFormAction(payload: TLoginMagicLinkReq): Promise<TResAction<TLoginRes | null>> {
    try {
        const result = await api.post<TRes<TLoginRes>>(ENDPOINT.LOGIN, payload);
        const { data } = result;
        if (!data.isTotp && data?.accessToken && data?.refreshToken) {
            await setAccessToken(data?.accessToken);
            await setRefreshToken(data?.refreshToken);
        }
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function loginMagicLinkAction(payload: TLoginMagicLinkReq): Promise<TResAction<TLoginRes | null>> {
    try {
        const result = await api.post<TRes<TLoginRes>>(ENDPOINT.CREATE_MAGIC_LINK, payload);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function verifyMagicLinkAction(payload: TVerifyMagicLinkReq): Promise<TResAction<TLoginRes | null>> {
    try {
        const result = await api.post<TRes<TLoginRes>>(ENDPOINT.VERIFY_MAGIC_LINK, payload);
        const { data } = result;
        if (!data.isTotp && data?.accessToken && data?.refreshToken) {
            await setAccessToken(data?.accessToken);
            await setRefreshToken(data?.refreshToken);
        }
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function loginGoogleAction(payload: TLoginGoogleWithTotpReq): Promise<TResAction<TLoginRes | null>> {
    try {
        const result = await api.post<TRes<TLoginRes>>(ENDPOINT.LOGIN_GOOGLE, payload);
        const { data } = result;
        if (!data.isTotp && data?.accessToken && data?.refreshToken) {
            await setAccessToken(data?.accessToken);
            await setRefreshToken(data?.refreshToken);
        }
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function getInfoAction(): Promise<TResAction<TUser | null>> {
    try {
        const result = await api.get<TRes<TUser>>(ENDPOINT.GET_INFO);
        const { data } = result;

        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function clearTokensAction() {
    try {
        await clearTokens();
        return true;
    } catch (error) {
        console.error("Clear Token Failed:", error);
        throw error;
    }
}
