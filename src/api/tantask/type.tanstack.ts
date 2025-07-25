import { useQuery } from "@tanstack/react-query";
import { getListTypeArticleAction } from "../actions/type.action";

export const useGetListTypeArticle = () => {
   return useQuery({
      queryKey: ["list-type-article"],
      queryFn: async () => {
         const { data, status, message } = await getListTypeArticleAction();
         if (status === "error" || data === null) throw new Error(message);
         console.log({ useGetListTypeArticle: data });
         return data;
      },
   });
};