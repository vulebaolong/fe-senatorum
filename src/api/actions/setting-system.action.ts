"use server";

import { ENDPOINT } from "@/constant/endpoint.constant";
import { TRes, TResAction } from "@/types/app.type";
import { TSettingSystem } from "@/types/setting-system.type";
import api from "../core.api";

export async function getVersion(): Promise<TResAction<TSettingSystem | null>> {
    try {
        const result = await api.get<TRes<TSettingSystem>>(`${ENDPOINT.SETTING_SYSTEM.SETTING_SYSTEM}/0198fbbe-99de-73cf-a866-256d37babc27`);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}
