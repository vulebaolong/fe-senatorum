import { TBaseTimestamps } from "./base.type";

export type TArticleBookmarkReq = {
    articleId: number;
};

export type ArticleBookmark = {
    id: number;
    articleId: number;
    userId: number;
} & TBaseTimestamps;
