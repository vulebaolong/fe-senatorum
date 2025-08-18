import { TArticleUnVoteReq, TArticleVoteReq } from "@/types/article-vote.type";
import { useMutation } from "@tanstack/react-query";
import { articleUnVoteAction, articleVoteAction } from "../actions/article-vote.action";
import { wait } from "@/helpers/function.helper";

export const useArticleVote = () => {
    return useMutation({
        mutationFn: async (payload: TArticleVoteReq) => {
            const { data, status, message } = await articleVoteAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useArticleVote: data });
            return data;
        },
    });
};

export const useArticleUnVote = () => {
    return useMutation({
        mutationFn: async (payload: TArticleUnVoteReq) => {
            const { data, status, message } = await articleUnVoteAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useArticleUnVote: data });
            return data;
        },
    });
};