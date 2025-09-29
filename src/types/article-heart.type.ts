import { TArticle } from "./article.type";
import { TBaseTimestamps } from "./base.type";
import { TUser } from "./user.type";

export type TArticleHeart = {
    id: string;
    articleId: TArticle["id"];
    userId: TUser["id"];
} & TBaseTimestamps;

export type TArticleHeartReq = {
    articleId: TArticleHeart["id"];
};
