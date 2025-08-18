import { TArticle } from "./article.type";
import { TBaseTimestamps } from "./base.type";
import { TUser } from "./user.type";

export type TArticleBookmark = {
    id: string;
    articleId: TArticle["id"];
    userId: TUser["id"];
} & TBaseTimestamps;

export type TArticleBookmarkReq = {
    articleId: TArticleBookmark["id"];
};
