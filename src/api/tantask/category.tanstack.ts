import { useQuery } from "@tanstack/react-query";
import { getListCategoryArticleAction } from "../actions/category.action";

export const useGetListCategoryArticle = () => {
   return useQuery({
      queryKey: ["list-category-article"],
      queryFn: async () => {
         const { data, status, message } = await getListCategoryArticleAction();
         if (status === "error" || data === null) throw new Error(message);
         console.log({ useGetListCategoryArticle: data });
         return data;
      },
   });
};