import {
    deleteAvatarAction,
    deleteAvatarDraftAction,
    deleteBannerAction,
    deleteBannerDraftAction,
    editProfileAction,
    findAllUserAction,
    getDetailUserAction,
    getUsersAction,
    searchNameUserAction,
    uploadAvatarAction,
    uploadAvatarDraftAction,
    uploadBannerAction,
    uploadBannerDraftAction,
} from "@/api/actions/user.action";
import { buildQueryString } from "@/helpers/build-query";
import { TQuery } from "@/types/app.type";
import { TEditProfileReq } from "@/types/user.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
            return data.items;
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

// avatart
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
            // await wait(10000);
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

// banner
export const useUploadBanner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const { data, status, message } = await uploadBannerAction();
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useUploadBanner: data });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["query-info"] });
        },
    });
};

export const useDeleteBanner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const { data, status, message } = await deleteBannerAction();
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useDeleteBannerDraft: data });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["query-info"] });
        },
    });
};

export const useUploadBannerDraft = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: FormData) => {
            const { data, status, message } = await uploadBannerDraftAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useUploadBannerDraft: data });
            // await wait(10000);
            return data;
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["query-info"] });
        },
    });
};

export const useDeleteBannerDraft = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const { data, status, message } = await deleteBannerDraftAction();
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useDeleteBannerDraft: data });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["query-info"] });
        },
    });
};

export const useGetNameUser = (payload: TQuery & { enabled: boolean }) => {
    return useQuery({
        queryKey: ["name-user", payload],
        queryFn: async () => {
            console.log(payload);
            const queryString = buildQueryString(payload);

            const { data, status, message } = await getUsersAction(queryString);
            if (status === "error" || data === null) throw new Error(message);
            // await wait(5000);
            console.log({ useGetNameUser: data });
            return data.items;
        },
        enabled: payload.enabled,
    });
};
