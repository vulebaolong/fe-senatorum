import {
    getInfoAction,
    loginFormAction,
    loginGoogleAction,
    loginMagicLinkAction,
    registerAction,
    verifyMagicLinkAction,
} from "@/api/actions/auth.action";
import { resError } from "@/helpers/function.helper";
import { useAppDispatch } from "@/redux/hooks";
import { SET_INFO } from "@/redux/slices/user.slice";
import { TLoginFormReq, TLoginGoogleWithTotpReq, TLoginMagicLinkReq, TRegisterReq, TVerifyMagicLinkReq } from "@/types/auth.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetInfoMutation = () => {
    const dispatch = useAppDispatch();
    return useMutation({
        mutationFn: async () => {
            try {
                const { data, status, message } = await getInfoAction();
                if (status === "error" || data === null) throw new Error(message);
                console.log({ useGetInfoMutation: data });
                dispatch(SET_INFO(data));
                return true;
            } catch (error) {
                throw error;
            }
        },
    });
};

export const useGetInfoQuery = () => {
    const dispatch = useAppDispatch();

    return useQuery({
        queryKey: ["query-info"],
        queryFn: async () => {
            try {
                const { data, status, message } = await getInfoAction();
                if (status === "error" || data === null) throw new Error(message);
                console.log({ useGetInfoQuery: data });
                dispatch(SET_INFO(data));
                return data;
            } catch (error) {
                console.log(error);
                return null;
            }
        },
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: async (payload: TRegisterReq) => {
            const { data, status, message } = await registerAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            return data;
        },
        onError: (error) => {
            console.log(error);
            toast.error(resError(error, `Register failed`));
        },
    });
};

export const useLoginForm = () => {
    return useMutation({
        mutationFn: async (payload: TLoginFormReq) => {
            const { data, status, message } = await loginFormAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            return data;
        },
        onError: (error) => {
            toast.error(resError(error, `Login failed`));
        },
    });
};

export const useLoginMagicLink = () => {
    return useMutation({
        mutationFn: async (payload: TLoginMagicLinkReq) => {
            const { data, status, message } = await loginMagicLinkAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            return data;
        },
        onError: (error) => {
            toast.error(resError(error, `Login failed`));
        },
    });
};

export const useVerifyMagicLink = () => {
    return useMutation({
        mutationFn: async (payload: TVerifyMagicLinkReq) => {
            const { data, status, message } = await verifyMagicLinkAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            return data;
        },
    });
};

export const useLoginGoogle = () => {
    return useMutation({
        mutationFn: async (payload: TLoginGoogleWithTotpReq) => {
            const { data, status, message } = await loginGoogleAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            return data;
        },
        onError: (error) => {
            toast.error(resError(error, `Login failed`));
        },
    });
};
