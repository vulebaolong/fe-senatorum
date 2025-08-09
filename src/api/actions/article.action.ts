"use server";

import { ENDPOINT } from "@/constant/endpoint.constant";
import { TRes, TResAction, TResPagination } from "@/types/app.type";
import { TArticle, TCreateArticleReq, TUpsertArticleReq } from "@/types/article.type";
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

export async function getDraftArticleAction(): Promise<TResAction<TArticle | null>> {
   try {
      const result = await api.get<TRes<TArticle>>(`${ENDPOINT.ARTICLE.ARTICLE_GET_DRAFT}`);
      const { data } = result;
      return { status: "success", message: result.message, data: data };
   } catch (error: any) {
      return { status: "error", message: error?.message, data: null };
   }
}

export async function createArticleAction(payload: TCreateArticleReq): Promise<TResAction<boolean | null>> {
   try {
      const result = await api.post<TRes<boolean>>(ENDPOINT.ARTICLE.ARTICLE, payload);
      const { data } = result;
      return { status: "success", message: result.message, data: data };
   } catch (error: any) {
      return { status: "error", message: error?.message, data: null };
   }
}

export async function upsertArticleAction(payload: TUpsertArticleReq): Promise<TResAction<TArticle | null>> {
   try {
      const result = await api.post<TRes<TArticle>>(ENDPOINT.ARTICLE.ARTICLE_UPSERT, payload);
      const { data } = result;
      return { status: "success", message: result.message, data: data };
   } catch (error: any) {
      return { status: "error", message: error?.message, data: null };
   }
}
