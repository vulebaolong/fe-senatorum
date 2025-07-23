import { useQuery } from "@tanstack/react-query";
import { getGetChatMessageAction } from "../actions/chat-message.action";

export const useGetChatMessage = (payload: any) => {
   return useQuery({
      queryKey: ["get-message-list-chat", payload],
      queryFn: async () => {
         const { pagination, filters, sort } = payload;
         const { pageIndex, pageSize } = pagination;
         const query = `page=${pageIndex}&pageSize=${pageSize}&filters=${JSON.stringify(filters)}&sortBy=${sort?.sortBy}&isDesc=${sort?.isDesc}`;

         const { data, status, message } = await getGetChatMessageAction(query);
         if (status === "error" || data === null) throw new Error(message);

         console.log({ useGetChatMessage: data });
         return data;
      },
   });
};