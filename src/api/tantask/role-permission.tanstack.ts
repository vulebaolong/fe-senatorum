import { TToggleRolePermissionReq } from "@/types/role.type";
import { useMutation } from "@tanstack/react-query";
import { toggleRolePermissionAction } from "../actions/role-permision.action";

export const useToggleRolePermission = () => {
    return useMutation({
        mutationFn: async (payload: TToggleRolePermissionReq) => {
            const { data, status, message } = await toggleRolePermissionAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            return data;
        },
    });
};
