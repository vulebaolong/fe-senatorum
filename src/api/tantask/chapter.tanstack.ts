import { TChapter, TUpsertChapterReq } from "@/types/chapter.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getDraftChapterAction, upsertChapterAction } from "../actions/chapter.action";

export const useGetDraftChapter = (initialData: TChapter | null) => {
    return useQuery({
        queryKey: ["get-draft-chapter"],
        queryFn: async () => {
            const { data, status, message } = await getDraftChapterAction();
            if (status === "error" || data === null) throw new Error(message);

            console.log({ useGetDraftChapter: data });
            return data;
        },
        initialData: initialData,
        refetchOnMount: false,
    });
};

export const useUpsertChapter = () => {
    return useMutation({
        mutationFn: async (payload: TUpsertChapterReq) => {
            const { data, status, message } = await upsertChapterAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useUpsertArticle: data });
            return data;
        },
    });
};
