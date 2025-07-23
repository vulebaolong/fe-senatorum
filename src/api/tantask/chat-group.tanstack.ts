import { useQuery } from "@tanstack/react-query";
import { findAllChatGroupManyAction, findAllChatGroupOneAction } from "../actions/chat-group.action";

export const useFindAllChatGroupOne = () => {
   return useQuery({
      queryKey: ["chat-group-list-one"],
      queryFn: async () => {
         const { data, status, message } = await findAllChatGroupOneAction();
         if (status === "error" || data === null) throw new Error(message);
         console.log({ useFindAllChatGroupOne: data });
         return data;
      },
   });
};

export const useFindAllChatGroupMany = () => {
   return useQuery({
      queryKey: ["chat-group-list-many"],
      queryFn: async () => {
         const { data, status, message } = await findAllChatGroupManyAction();
         if (status === "error" || data === null) throw new Error(message);
         console.log({ useFindAllChatGroupMany: data });
         return data;
      },
   });
};