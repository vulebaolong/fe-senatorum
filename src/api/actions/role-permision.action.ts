"use server";

import { ENDPOINT } from "@/constant/endpoint.constant";
import { TRes, TResAction } from "@/types/app.type";
import { TToggleRolePermissionReq, TToggleRolePermissionRes } from "@/types/role.type";
import api from "../core.api";


export async function toggleRolePermissionAction(payload: TToggleRolePermissionReq): Promise<TResAction<TToggleRolePermissionRes | null>> {
    try {
        const result = await api.post<TRes<TToggleRolePermissionRes>>(`${ENDPOINT.ROLE_PERMISSION.TOGGLE_ROLE_PERMISSION}`, payload);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}
