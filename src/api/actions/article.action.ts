"use server";

import { ENDPOINT } from "@/constant/endpoint.constant";
import { TRes, TResAction, TResPagination } from "@/types/app.type";
import { TArticle, TCreateArticleReq } from "@/types/article.type";
import api from "../core.api";

export async function getAllArticleAction(query: string): Promise<TResAction<TResPagination<TArticle> | null>> {
   try {
      const result = await api.get<TRes<TResPagination<TArticle>>>(`${ENDPOINT.ARTICLE.ARTICLE_ALL}?${query}`);
      const { data } = result;
      return { status: "success", message: result.message, data: data };
   } catch (error: any) {
      return { status: "error", message: error?.message, data: null };
   }
}

export async function getOtherArticleAction(query: string): Promise<TResAction<TResPagination<TArticle> | null>> {
   try {
      const result = await api.get<TRes<TResPagination<TArticle>>>(`${ENDPOINT.ARTICLE.ARTICLE_OTHER}${query}`);
      const { data } = result;
      return { status: "success", message: result.message, data: data };
   } catch (error: any) {
      return { status: "error", message: error?.message, data: null };
   }
}

export async function getDetailArticleAction(slug: string): Promise<TResAction<TArticle | null>> {
   try {
      const result = await api.get<TRes<TArticle>>(`${ENDPOINT.ARTICLE.ARTICLE}/${slug}`);
      const { data } = result;
      return { status: "success", message: result.message, data: data };
   } catch (error: any) {
      return { status: "error", message: error?.message, data: null };
   }
}

export async function createArticleAction(payload: TCreateArticleReq): Promise<TResAction<boolean | null>> {
   try {
      console.log({ body: payload });
      const result = await api.post<TRes<boolean>>(ENDPOINT.ARTICLE.ARTICLE, payload);
      const { data } = result;
      return { status: "success", message: result.message, data: data };
   } catch (error: any) {
      return { status: "error", message: error?.message, data: null };
   }
}
