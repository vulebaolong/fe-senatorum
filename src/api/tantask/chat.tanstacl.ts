import { CHAT_BUBBLE, CHAT_OPENED } from "@/constant/chat.constant";
import { getChatOpened } from "@/helpers/chat.helper";
import { useQuery } from "@tanstack/react-query";

export const useGetChatListUserItem = () => {
    return useQuery({
        queryKey: ["chat-list-user-item"],
        queryFn: async () => {
            return getChatOpened(CHAT_OPENED).slice(0, 2);
        },
    });
};

export const useGetChatListUserBubble = () => {
    return useQuery({
        queryKey: ["chat-list-user-bubble"],
        queryFn: async () => {
            return getChatOpened(CHAT_BUBBLE);
        },
    });
};


