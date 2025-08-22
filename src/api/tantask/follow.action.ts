import { useMutation, useQuery } from "@tanstack/react-query";
import { followAction, getCountFollowAction, unfollowAction } from "../actions/follow.action";
import { TFollowReq } from "@/types/follow.type";
import { TUser } from "@/types/user.type";

export const useFollow = () => {
    return useMutation({
        mutationFn: async (payload: TFollowReq) => {
            const { data, status, message } = await followAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useUpsertThumbnail: data });
            return data;
        },
    });
};

export const useUnfollow = () => {
    return useMutation({
        mutationFn: async (payload: TFollowReq) => {
            const { data, status, message } = await unfollowAction(payload);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useUpsertThumbnail: data });
            return data;
        },
    });
};

export const useGetCountFollow = (userId: TUser["id"]) => {
    return useQuery({
        queryKey: ["get-count-follow", userId],
        queryFn: async () => {
            const { data, status, message } = await getCountFollowAction(userId);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useGetCountFollow: data });
            return data;
        },
    });
};
