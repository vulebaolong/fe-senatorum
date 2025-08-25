"use server";

import { ENDPOINT } from "@/constant/endpoint.constant";
import { TRes, TResAction, TResPagination } from "@/types/app.type";
import { TNotification } from "@/types/notification.type";
import api from "../core.api";

export async function getAllNotificationAction(query: string): Promise<TResAction<TResPagination<TNotification> | null>> {
    try {
        const result = await api.get<TRes<TResPagination<TNotification>>>(`${ENDPOINT.NOTIFICATION.NOTIFICATION}?${query}`);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function countUnreadNotificationAction(): Promise<TResAction<number | null>> {
    try {
        const result = await api.get<TRes<number | null>>(`${ENDPOINT.NOTIFICATION.COUNT_UNREAD_NOTIFICATION}`);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function readNotificationAction(notificationId: TNotification["id"]): Promise<TResAction<boolean | null>> {
    try {
        const result = await api.patch<TRes<boolean | null>>(`${ENDPOINT.NOTIFICATION.READ_NOTIFICATION}/${notificationId}`);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}
