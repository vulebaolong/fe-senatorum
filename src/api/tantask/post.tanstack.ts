import { createArticleAction, getAllPostAction, getMyPostAction, getOtherPostAction } from "@/api/actions/post.action";
import { wait } from "@/helpers/function.helper";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetAllPost = (payload: any) => {
    return useQuery({
        queryKey: ["get-all-post", payload],
        queryFn: async () => {
            const { pagination, filters, sort } = payload;
            const { pageIndex, pageSize } = pagination;
            const query = `page=${pageIndex}&pageSize=${pageSize}&filters=${JSON.stringify(filters)}&sortBy=${sort?.sortBy}&isDesc=${sort?.isDesc}`;

            const { data, status, message } = await getAllPostAction(query);
            if (status === "error" || data === null) throw new Error(message);

            await wait(5000);
            console.log({ useGetAllPost: data });
            return data;
        },
    });
};

export const useGetMyPost = (payload: any) => {
    return useQuery({
        queryKey: ["get-my-post", payload],
        queryFn: async () => {
            const { pagination, filters, sort } = payload;
            const { pageIndex, pageSize } = pagination;
            const query = `page=${pageIndex}&pageSize=${pageSize}&filters=${JSON.stringify(filters)}&sortBy=${sort?.sortBy}&isDesc=${sort?.isDesc}`;

            const { data, status, message } = await getMyPostAction(query);
            if (status === "error" || data === null) throw new Error(message);

            console.log({ useGetMyPost: data });
            return data;
        },
    });
};

export const useGetOtherPost = (payload: any & { id?: string }) => {
    return useQuery({
        queryKey: ["get-other-post", payload],
        queryFn: async () => {
            const { pagination, filters, sort, id } = payload;
            const { pageIndex, pageSize } = pagination;
            console.log({ id });
            if (!id) throw new Error("ID is required");
            const query = `/${id}?page=${pageIndex}&pageSize=${pageSize}&filters=${JSON.stringify(filters)}&sortBy=${sort?.sortBy}&isDesc=${
                sort?.isDesc
            }`;

            const { data, status, message } = await getOtherPostAction(query);
            if (status === "error" || data === null) throw new Error(message);

            console.log({ useGetOtherPost: data });
            return data;
        },
    });
};

export const useCreateArticle = () => {
    return useMutation({
        mutationFn: async (payload: FormData) => {
            const { data, status, message } = await createArticleAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            return data;
        },
    });
};
