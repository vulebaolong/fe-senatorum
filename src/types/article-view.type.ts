import { TArticle } from "./article.type";

export type TArticleViewReq = {
    articleId: TArticle["id"];
    uaFamily?: string;
    country?: string;
};
