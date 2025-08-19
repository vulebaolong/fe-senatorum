import {
    createArticleAction,
    getAllArticleAction,
    getDetailArticleAction,
    getMyArticleAction,
    getMyUpvotedArticleAction,
    getOtherArticleAction,
    publishArticleAction,
    upsertArticleDraftAction,
    upsertArticleEditAction
} from "@/api/actions/article.action";
import { TCreateArticleReq, TPublishArticleReq, TUpsertArticleDarftReq, TUpsertArticleEditReq } from "@/types/article.type";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetAllArticle = (payload: any) => {
    return useQuery({
        queryKey: ["get-all-article", payload],
        queryFn: async () => {
            const { pagination, filters, sort } = payload;
            const { pageIndex, pageSize } = pagination;
            const query = `page=${pageIndex}&pageSize=${pageSize}&filters=${JSON.stringify(filters)}&sortBy=${sort?.sortBy}&isDesc=${sort?.isDesc}`;

            const { data, status, message } = await getAllArticleAction(query);
            if (status === "error" || data === null) throw new Error(message);

            // await wait(5000);
            console.log({ useGetAllArticle: data });
            return data;
        },
    });
};

export const useGetMyUpvotedArticle = (payload: any) => {
    return useQuery({
        queryKey: ["get-my-upvoted-article", payload],
        queryFn: async () => {
            const { pagination, filters, sort } = payload;
            const { pageIndex, pageSize } = pagination;
            const query = `page=${pageIndex}&pageSize=${pageSize}&filters=${JSON.stringify(filters)}&sortBy=${sort?.sortBy}&isDesc=${sort?.isDesc}`;

            const { data, status, message } = await getMyUpvotedArticleAction(query);
            if (status === "error" || data === null) throw new Error(message);

            // await wait(5000);
            console.log({ useGetAllArticle: data });
            return data;
        },
    });
};

export const useGetMyArticle = (payload: any) => {
    return useQuery({
        queryKey: ["get-my-article", payload],
        queryFn: async () => {
            const { pagination, filters, sort } = payload;
            const { pageIndex, pageSize } = pagination;
            const query = `page=${pageIndex}&pageSize=${pageSize}&filters=${JSON.stringify(filters)}&sortBy=${sort?.sortBy}&isDesc=${sort?.isDesc}`;

            const { data, status, message } = await getMyArticleAction(query);
            if (status === "error" || data === null) throw new Error(message);

            console.log({ useGetMyArticle: data });
            return data;
        },
    });
};

export const useGetOtherArticle = (payload: any & { id?: string }) => {
    return useQuery({
        queryKey: ["get-other-article", payload],
        queryFn: async () => {
            const { pagination, filters, sort, id } = payload;
            const { pageIndex, pageSize } = pagination;
            console.log({ id });
            if (!id) throw new Error("ID is required");
            const query = `/${id}?page=${pageIndex}&pageSize=${pageSize}&filters=${JSON.stringify(filters)}&sortBy=${sort?.sortBy}&isDesc=${
                sort?.isDesc
            }`;

            const { data, status, message } = await getOtherArticleAction(query);
            if (status === "error" || data === null) throw new Error(message);

            console.log({ useGetOtherArticle: data });
            return data;
        },
    });
};

export const useGetDetailArticle = (payload: string) => {
    return useQuery({
        queryKey: ["get-detail-article", payload],
        queryFn: async () => {
            const { data, status, message } = await getDetailArticleAction(payload);
            if (status === "error" || data === null) throw new Error(message);

            console.log({ useGetDetailArticle: data });
            return data;
        },
    });
};

// export const useGetDraftArticle = (initialData: TArticle | null) => {
//     return useQuery({
//         queryKey: ["get-draft-article"],
//         queryFn: async () => {
//             const { data, status, message } = await getDraftArticleAction();
//             if (status === "error" || data === null) throw new Error(message);

//             console.log({ useGetDraftArticle: data });
//             return data;
//         },
//         initialData: initialData,
//         refetchOnMount: false,
//     });
// };

export const useCreateArticle = () => {
    return useMutation({
        mutationFn: async (payload: TCreateArticleReq) => {
            const { data, status, message } = await createArticleAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useCreateArticle: data });
            return data;
        },
    });
};

export const usePublishArticle = () => {
    return useMutation({
        mutationFn: async (payload: TPublishArticleReq) => {
            const { data, status, message } = await publishArticleAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ usePublishArticle: data });
            return data;
        },
    });
};

export const useUpsertArticleDarft = () => {
    return useMutation({
        mutationFn: async (payload: TUpsertArticleDarftReq) => {
            const { data, status, message } = await upsertArticleDraftAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useUpsertArticle: data });
            return data;
        },
    });
};

export const useUpsertArticleEdit = () => {
    return useMutation({
        mutationFn: async (payload: TUpsertArticleEditReq) => {
            const { data, status, message } = await upsertArticleEditAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useUpsertArticle: data });
            return data;
        },
    });
};
