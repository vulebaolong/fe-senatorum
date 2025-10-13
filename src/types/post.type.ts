import { TArticle } from "./article.type";

export type TUpsertPostDarftReq = {
    content?: string;
};

export type TUpdatePostReq = {
    id: TArticle["id"];
    formData: FormData;
};