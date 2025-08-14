"use server";

import { TRes, TResAction } from "@/types/app.type";
import api from "../core.api";
import { ENDPOINT } from "@/constant/endpoint.constant";
import { TChapter, TUpsertChapterReq } from "@/types/chapter.type";

export async function getDraftChapterAction(): Promise<TResAction<TChapter | null>> {
    try {
        const result = await api.get<TRes<TChapter | null>>(`${ENDPOINT.CHAPTER.CHAPTER_GET_DRAFT}`);
        const { data } = result;
        console.log({ getDraftChapterAction: data });
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}

export async function upsertChapterAction(payload: TUpsertChapterReq): Promise<TResAction<TChapter | null>> {
    try {
        const result = await api.post<TRes<TChapter>>(ENDPOINT.CHAPTER.CHAPTER_UPSERT, payload);
        const { data } = result;
        return { status: "success", message: result.message, data: data };
    } catch (error: any) {
        return { status: "error", message: error?.message, data: null };
    }
}
