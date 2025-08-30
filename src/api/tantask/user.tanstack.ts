import {
    deleteAvatarAction,
    deleteAvatarDraftAction,
    editProfileAction,
    findAllUserAction,
    getDetailUserAction,
    searchNameUserAction,
    uploadAvatarAction,
    uploadAvatarDraftAction,
} from "@/api/actions/user.action";
import { wait } from "@/helpers/function.helper";
import { TEditProfileReq } from "@/types/user.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUploadAvatar = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const { data, status, message } = await uploadAvatarAction();
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useUploadAvatar: data });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["query-info"] });
        },
    });
};

export const useDeleteAvatar = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const { data, status, message } = await deleteAvatarAction();
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useDeleteAvatarDraft: data });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["query-info"] });
        },
    });
};

export const useUploadAvatarDraft = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: FormData) => {
            const { data, status, message } = await uploadAvatarDraftAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useUploadAvatarDraft: data });
            await wait(10000);
            return data;
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["query-info"] });
        },
    });
};

export const useDeleteAvatarDraft = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const { data, status, message } = await deleteAvatarDraftAction();
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useDeleteAvatarDraft: data });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["query-info"] });
        },
    });
};

export const useFindAllUser = () => {
    return useQuery({
        queryKey: ["user-list"],
        queryFn: async () => {
            const { data, status, message } = await findAllUserAction();
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useFindAllUser: data });
            return data;
        },
    });
};

export const useSearchNameUser = () => {
    return useMutation({
        mutationFn: async (payload: string) => {
            const { data, status, message } = await searchNameUserAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            // await wait(5000);
            console.log({ useSearchNameUser: data });
            return data;
        },
    });
};

export const useDetailUser = (id: string) => {
    return useQuery({
        queryKey: [`detail-user`, id],
        queryFn: async () => {
            const { data, status, message } = await getDetailUserAction(id);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useDetailUser: data });
            return data;
        },
    });
};

export const useEditProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: TEditProfileReq) => {
            const { data, status, message } = await editProfileAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useEditProfile: data });
            await queryClient.invalidateQueries({ queryKey: ["query-info"] });
            return data;
        },
    });
};
